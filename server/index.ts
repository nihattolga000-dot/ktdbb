import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import nodemailer from 'nodemailer';

dotenv.config();

// Configure nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || 'example@gmail.com',
    pass: process.env.SMTP_PASS || 'password',
  },
});

const app = express();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'secret-key-change-this-in-production';

// Production Güvenlik Uyarısı
if (process.env.NODE_ENV === 'production' && JWT_SECRET === 'secret-key-change-this-in-production') {
  console.warn('[SECURITY CRITICAL] Lütfen .env dosyasında güçlü bir JWT_SECRET belirleyiniz!');
}

// ─────────────────────────────────────────────
// GÜVENLİK KATMANI 1: HTTP Security Headers
// ─────────────────────────────────────────────
app.disable('x-powered-by'); // Sunucu teknolojisini saldırganlara ifşa etmez

app.use((req, res, next) => {
  // Clickjacking saldırılarına karşı sayfayı iframe içinde gömmeyi engeller
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  // Tarayıcının MIME türlerini tahmin edip zararlı kod çalıştırmasını (MIME sniffing) engeller
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // XSS saldırılarına karşı tarayıcı filtresini zorunlu kılar
  res.setHeader('X-XSS-Protection', '1; mode=block');
  // Güvenli yönlendirme (referrer sızıntısı önleme)
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
});

// ─────────────────────────────────────────────
// GÜVENLİK KATMANI 2: In-Memory Sliding Window Rate Limiter (Brute-Force & DoS Koruması)
// ─────────────────────────────────────────────
interface RateLimitEntry {
  count: number;
  resetTime: number;
}
const rateLimitStore = new Map<string, RateLimitEntry>();

// Bellek temizliği (Memory leak önleme)
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60000);

const createRateLimiter = (options: { windowMs: number; max: number; message: string }) => {
  return (req: any, res: any, next: any) => {
    const rawIp = req.headers['x-forwarded-for']?.toString().split(',')[0].trim() || req.socket.remoteAddress || 'unknown-ip';
    const key = `${req.baseUrl || req.path}:${rawIp}`;
    const now = Date.now();

    const entry = rateLimitStore.get(key);
    if (!entry || now > entry.resetTime) {
      rateLimitStore.set(key, { count: 1, resetTime: now + options.windowMs });
      return next();
    }

    if (entry.count >= options.max) {
      const retryAfterSec = Math.ceil((entry.resetTime - now) / 1000);
      res.setHeader('Retry-After', retryAfterSec);
      return res.status(429).json({ error: options.message, retryAfter: retryAfterSec });
    }

    entry.count += 1;
    next();
  };
};

// Login için sıkı kaba kuvvet (brute-force) koruması: 15 dakikada en fazla 6 deneme
const loginLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 6,
  message: 'Çok fazla başarısız giriş denemesi. Güvenliğiniz için lütfen 15 dakika sonra tekrar deneyin.',
});

// Başvuru & formlar için spam koruması: 1 saatte en fazla 10 başvuru
const formLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: 'Kısa süre içinde çok fazla başvuru gönderildi. Lütfen daha sonra tekrar deneyiniz.',
});

// HTML Injection & XSS Temizleyici
function escapeHtml(str: any): string {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

app.use(cors({
  origin: [
    'https://kayseritdb.com.tr',
    'https://www.kayseritdb.com.tr',
    'http://localhost:5173',
    'http://localhost:4173',
  ],
  credentials: true,
}));

// DoS saldırılarına karşı JSON ve form veri limiti 10MB'a çekildi
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Ensure uploads directory exists (recursive + absolute path based on __dirname)
const uploadsDir = path.resolve(__dirname, '..', 'uploads');
try {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('[UPLOAD] uploads dir:', uploadsDir);
} catch (e) {
  console.error('[UPLOAD] Could not create uploads dir:', e);
}

// Serve static files from uploads
app.use('/uploads', express.static(uploadsDir));

// ─────────────────────────────────────────────
// GÜVENLİK KATMANI 3: Katı Dosya Yükleme Doğrulaması (File Upload Security)
// ─────────────────────────────────────────────
const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext) || !ALLOWED_MIME_TYPES.has(file.mimetype)) {
      return cb(new Error('Yalnızca güvenli resim dosyaları (.jpg, .jpeg, .png, .webp) yüklenebilir!'));
    }
    cb(null, true);
  },
});

// --- Authentication Routes ---

// Login (Sıkı Rate Limiting Korumalı)
app.post('/api/auth/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'E-posta ve şifre zorunludur' });
  }

  try {
    const trimmedEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: trimmedEmail } });
    if (!user) {
      return res.status(401).json({ error: 'Geçersiz e-posta veya şifre' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Geçersiz e-posta veya şifre' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Middleware for JWT Authentication
const authenticate = (req: any, res: any, next: any) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Yetkisiz erişim' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Geçersiz token' });
  }
};

// Middleware for Admin role checking (President only)
const requireAdmin = (req: any, res: any, next: any) => {
  if (req.user?.role !== 'PRESIDENT') {
    return res.status(403).json({ error: 'Bu işlem için il başkanı yetkisi gerekiyor.' });
  }
  next();
};



// Middleware for Social Media / News (PRESIDENT, VICE_PRESIDENT, KOMISYON_SOSYAL_MEDYA)
const requireSocialMedia = (req: any, res: any, next: any) => {
  const allowed = ['PRESIDENT', 'VICE_PRESIDENT', 'KOMISYON_SOSYAL_MEDYA'];
  if (!allowed.includes(req.user?.role)) {
    return res.status(403).json({ error: 'Bu işlem için Sosyal Medya Komisyonu yetkisi gerekiyor.' });
  }
  next();
};

// Middleware for Event Commission (PRESIDENT, VICE_PRESIDENT, KOMISYON_ETKINLIK)
const requireEventComm = (req: any, res: any, next: any) => {
  const allowed = ['PRESIDENT', 'VICE_PRESIDENT', 'KOMISYON_ETKINLIK'];
  if (!allowed.includes(req.user?.role)) {
    return res.status(403).json({ error: 'Bu işlem için Etkinlik Komisyonu yetkisi gerekiyor.' });
  }
  next();
};

// --- User Management (Admin Only) ---

// Get all users
app.get('/api/users', authenticate, requireAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, createdAt: true }
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Kullanıcılar getirilemedi' });
  }
});

// Create new user
app.post('/api/users', authenticate, requireAdmin, async (req, res) => {
  const { email, password, name, role } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Bu e-posta adresi zaten kullanımda' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name, role }
    });

    res.json({ message: 'Kullanıcı başarıyla oluşturuldu', user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Kullanıcı oluşturulamadı' });
  }
});

// Delete user
app.delete('/api/users/:id', authenticate, requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    // İl başkanı kendini silemesin
    if (req.user.id === id) {
      return res.status(400).json({ error: 'Kendi hesabınızı silemezsiniz' });
    }
    await prisma.user.delete({ where: { id } });
    res.json({ message: 'Kullanıcı silindi' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Kullanıcı silinemedi' });
  }
});

// Update user role
app.put('/api/users/:id/role', authenticate, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  try {
    // İl başkanı kendi rolünü değiştiremesin
    if (req.user.id === id) {
      return res.status(400).json({ error: 'Kendi rolünüzü değiştiremezsiniz' });
    }
    const user = await prisma.user.update({
      where: { id },
      data: { role }
    });
    res.json({ message: 'Rol güncellendi', user: { id: user.id, role: user.role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Rol güncellenemedi' });
  }
});

// Update user info
app.put('/api/users/:id', authenticate, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    const user = await prisma.user.update({
      where: { id },
      data: { name, email }
    });
    res.json({ message: 'Kullanıcı güncellendi', user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Kullanıcı güncellenemedi' });
  }
});

// --- Upload Management ---
app.post('/api/upload', authenticate, async (req: any, res: any) => {
  try {
    // Base64/dataURL gönderildiyse doğrudan döndür
    if (req.body && req.body.image) {
      return res.json({ imageUrl: req.body.image });
    }

    // Multer ile dosyayı memory'e al
    await new Promise<void>((resolve, reject) => {
      upload.single('image')(req, res, (err: any) => {
        if (err) {
          console.error('[UPLOAD] Multer error:', JSON.stringify(err));
          reject(err);
          return;
        }
        resolve();
      });
    });

    if (!req.file) {
      return res.status(400).json({ error: 'Dosya yüklenmedi' });
    }

    // Dosyayı diske yaz (Güvenli uzantı ve tahmin edilemez kriptografik isim)
    const rawExt = path.extname(req.file.originalname).toLowerCase();
    const safeExt = ALLOWED_EXTENSIONS.has(rawExt) ? rawExt : '.jpg';
    const randomHash = crypto.randomBytes(16).toString('hex');
    const filename = `img-${Date.now()}-${randomHash}${safeExt}`;
    const filepath = path.join(uploadsDir, filename);

    console.log('[UPLOAD] Writing file to:', filepath);
    fs.writeFileSync(filepath, req.file.buffer);
    console.log('[UPLOAD] File written successfully:', filename);

    return res.json({ imageUrl: `/uploads/${filename}` });
  } catch (e: any) {
    console.error('[UPLOAD] Error:', e?.message || e);
    res.status(500).json({ error: `Sunucu iç hatası: ${e?.message || 'Bilinmeyen hata'}` });
  }
});

// --- News Management (Social Media Comm) ---
app.get('/api/news', async (req, res) => {
  try {
    const news = await prisma.news.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Haberler getirilemedi' });
  }
});

app.get('/api/news/:id', async (req, res) => {
  try {
    const newsItem = await prisma.news.findUnique({ where: { id: req.params.id } });
    if (!newsItem) return res.status(404).json({ error: 'Haber bulunamadı' });
    res.json(newsItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Haber getirilemedi' });
  }
});

app.post('/api/news', authenticate, requireSocialMedia, async (req, res) => {
  const { title, content, imageUrl } = req.body;
  try {
    const news = await prisma.news.create({
      data: { title, content, imageUrl, authorId: req.user.id }
    });
    res.json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Haber oluşturulamadı' });
  }
});

app.put('/api/news/:id', authenticate, requireSocialMedia, async (req, res) => {
  const { title, content, imageUrl } = req.body;
  try {
    const news = await prisma.news.update({
      where: { id: req.params.id },
      data: { title, content, ...(imageUrl && { imageUrl }) }
    });
    res.json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Haber güncellenemedi' });
  }
});

app.delete('/api/news/:id', authenticate, requireSocialMedia, async (req, res) => {
  try {
    await prisma.news.delete({ where: { id: req.params.id } });
    res.json({ message: 'Haber silindi' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Haber silinemedi' });
  }
});

// --- Gallery Management (Social Media Comm) ---
app.get('/api/gallery', async (req, res) => {
  try {
    const items = await prisma.gallery.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Galeri getirilemedi' });
  }
});

app.post('/api/gallery', authenticate, requireSocialMedia, async (req, res) => {
  const { title, imageUrl } = req.body;
  try {
    const item = await prisma.gallery.create({ data: { title, imageUrl } });
    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Fotoğraf eklenemedi' });
  }
});

// Batch create gallery items
app.post('/api/gallery/batch', authenticate, requireSocialMedia, async (req, res) => {
  const { items } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Yüklenecek görsel listesi bulunamadı' });
  }
  try {
    const created = await prisma.gallery.createMany({
      data: items.map((it: { title?: string; imageUrl: string }) => ({
        title: it.title || null,
        imageUrl: it.imageUrl
      }))
    });
    res.json({ message: 'Fotoğraflar başarıyla yüklendi', count: created.count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Toplu fotoğraflar eklenemedi' });
  }
});

app.put('/api/gallery/:id', authenticate, requireSocialMedia, async (req, res) => {
  const { title } = req.body;
  try {
    const item = await prisma.gallery.update({
      where: { id: req.params.id },
      data: { title }
    });
    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Fotoğraf güncellenemedi' });
  }
});

app.delete('/api/gallery/:id', authenticate, requireSocialMedia, async (req, res) => {
  try {
    await prisma.gallery.delete({ where: { id: req.params.id } });
    res.json({ message: 'Fotoğraf silindi' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Fotoğraf silinemedi' });
  }
});

// --- Event Management (Event Comm) ---
app.get('/api/event-registrations', authenticate, requireEventComm, async (req, res) => {
  try {
    const registrations = await prisma.eventRegistration.findMany({
      include: { event: { select: { title: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(registrations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Etkinlik başvuruları getirilemedi' });
  }
});

app.get('/api/events', async (req, res) => {
  try {
    const events = await prisma.event.findMany({ orderBy: { eventDate: 'asc' } });
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Etkinlikler getirilemedi' });
  }
});

app.get('/api/events/:id/registrations', authenticate, requireEventComm, async (req, res) => {
  try {
    const registrations = await prisma.eventRegistration.findMany({ 
      where: { eventId: req.params.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json(registrations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Başvurular getirilemedi' });
  }
});

app.get('/api/events/:id', async (req, res) => {
  try {
    const event = await prisma.event.findUnique({ where: { id: req.params.id } });
    if (!event) return res.status(404).json({ error: 'Etkinlik bulunamadı' });
    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Etkinlik getirilemedi' });
  }
});

app.post('/api/events/:id/register', formLimiter, async (req, res) => {
  const { name, phone, email } = req.body;
  const eventId = req.params.id;

  if (!name || !phone || !email || typeof name !== 'string' || typeof phone !== 'string' || typeof email !== 'string') {
    return res.status(400).json({ error: 'Lütfen tüm alanları geçerli şekilde doldurun' });
  }

  // Temel E-posta ve telefon uzunluk kontrolü
  const trimmedEmail = email.trim();
  const trimmedName = name.trim();
  const trimmedPhone = phone.trim();

  if (trimmedName.length < 2 || trimmedName.length > 100) {
    return res.status(400).json({ error: 'Geçersiz isim uzunluğu' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    return res.status(400).json({ error: 'Geçersiz e-posta formatı' });
  }

  try {
    // Check if event exists
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) return res.status(404).json({ error: 'Etkinlik bulunamadı' });

    const registration = await prisma.eventRegistration.create({
      data: { eventId, name: trimmedName, phone: trimmedPhone, email: trimmedEmail }
    });
    res.json(registration);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Başvuru alınamadı' });
  }
});

app.post('/api/events', authenticate, requireEventComm, async (req, res) => {
  const { title, description, location, eventDate, imageUrl } = req.body;
  try {
    const event = await prisma.event.create({
      data: { title, description, location, eventDate: new Date(eventDate), imageUrl }
    });
    res.json(event);
  } catch (error) {
    console.error(error);
    console.error('Events POST error:', error);
    res.status(500).json({ error: 'Etkinlik oluşturulamadı' });
  }
});

app.put('/api/events/:id', authenticate, requireEventComm, async (req, res) => {
  const { title, description, location, eventDate, imageUrl } = req.body;
  try {
    const event = await prisma.event.update({
      where: { id: req.params.id },
      data: { 
        title, 
        description, 
        location, 
        eventDate: new Date(eventDate), 
        ...(imageUrl !== undefined ? { imageUrl } : {}) 
      }
    });
    res.json(event);
  } catch (error) {
    console.error(error);
    console.error('Events PUT error:', error);
    res.status(500).json({ error: 'Etkinlik güncellenemedi' });
  }
});

app.delete('/api/events/:id', authenticate, requireEventComm, async (req, res) => {
  try {
    await prisma.event.delete({ where: { id: req.params.id } });
    res.json({ message: 'Etkinlik silindi' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Etkinlik silinemedi' });
  }
});

// --- Project Management (Event Comm) ---
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Projeler getirilemedi' });
  }
});

app.get('/api/projects/:id', async (req, res) => {
  try {
    const project = await prisma.project.findUnique({ where: { id: req.params.id } });
    if (!project) return res.status(404).json({ error: 'Proje bulunamadı' });
    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Proje getirilemedi' });
  }
});

app.post('/api/projects', authenticate, requireEventComm, async (req, res) => {
  const { title, description, status, imageUrl } = req.body;
  try {
    const project = await prisma.project.create({
      data: { title, description, status, imageUrl }
    });
    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Proje oluşturulamadı' });
  }
});

app.put('/api/projects/:id', authenticate, requireEventComm, async (req, res) => {
  const { title, description, status, imageUrl } = req.body;
  try {
    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: { 
        title, 
        description, 
        status, 
        ...(imageUrl !== undefined ? { imageUrl } : {}) 
      }
    });
    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Proje güncellenemedi' });
  }
});

app.delete('/api/projects/:id', authenticate, requireEventComm, async (req, res) => {
  try {
    await prisma.project.delete({ where: { id: req.params.id } });
    res.json({ message: 'Proje silindi' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Proje silinemedi' });
  }
});

// --- Membership Applications ---
app.post('/api/applications', formLimiter, async (req, res) => {
  const data = req.body;

  if (!data || !data.name || !data.email || !data.phone) {
    return res.status(400).json({ error: 'İsim, e-posta ve telefon zorunludur' });
  }

  const cleanName = escapeHtml(String(data.name).trim().slice(0, 100));
  const cleanEmail = String(data.email).trim().toLowerCase();
  const cleanPhone = escapeHtml(String(data.phone).trim().slice(0, 30));
  const cleanMessage = escapeHtml(String(data.message || '').slice(0, 2000));

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return res.status(400).json({ error: 'Geçersiz e-posta adresi' });
  }

  try {
    const application = await prisma.membershipApplication.create({
      data: {
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        message: cleanMessage,
        birthDate: escapeHtml(String(data.birthDate || '').slice(0, 50)),
        livesInKayseri: escapeHtml(String(data.livesInKayseri || '').slice(0, 50)),
        education: escapeHtml(String(data.education || '').slice(0, 100)),
        ideology: escapeHtml(String(data.ideology || '').slice(0, 100)),
        politicalParty: escapeHtml(String(data.politicalParty || '').slice(0, 100)),
        definitionTurkculuk: escapeHtml(String(data.definitionTurkculuk || '').slice(0, 1000)),
        turanMeaning: escapeHtml(String(data.turanMeaning || '').slice(0, 1000)),
        reasonToJoin: escapeHtml(String(data.reasonToJoin || '').slice(0, 1000)),
        favoriteLeader: escapeHtml(String(data.favoriteLeader || '').slice(0, 100)),
        status: 'PENDING'
      }
    });

    // Notify Admin (HTML Injection korumalı)
    try {
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: process.env.SMTP_USER, // Send to admin email
        subject: `Yeni Üyelik Başvurusu: ${cleanName}`,
        html: `<p><b>İsim:</b> ${cleanName}</p>
               <p><b>E-posta:</b> ${cleanEmail}</p>
               <p><b>Telefon:</b> ${cleanPhone}</p>
               ${data.birthDate ? `<p><b>Doğum Tarihi:</b> ${escapeHtml(String(data.birthDate))}</p>` : ''}
               ${data.livesInKayseri ? `<p><b>Kayseri'de mi yaşıyor?:</b> ${escapeHtml(String(data.livesInKayseri))}</p>` : ''}
               ${data.education ? `<p><b>Eğitim Durumu:</b> ${escapeHtml(String(data.education))}</p>` : ''}
               ${data.ideology ? `<p><b>İdeolojik Görüş:</b> ${escapeHtml(String(data.ideology))}</p>` : ''}
               ${data.politicalParty ? `<p><b>Siyasi Parti Üyeliği:</b> ${escapeHtml(String(data.politicalParty))}</p>` : ''}
               ${data.favoriteLeader ? `<p><b>En Beğendiği Lider:</b> ${escapeHtml(String(data.favoriteLeader))}</p>` : ''}
               ${data.definitionTurkculuk ? `<p><b>Türkçülüğün Tanımı:</b> ${escapeHtml(String(data.definitionTurkculuk))}</p>` : ''}
               ${data.turanMeaning ? `<p><b>Turan Ne Demek:</b> ${escapeHtml(String(data.turanMeaning))}</p>` : ''}
               ${data.reasonToJoin ? `<p><b>Katılma Sebebi:</b> ${escapeHtml(String(data.reasonToJoin))}</p>` : ''}
               <p><b>Eklenen Mesaj:</b><br/> ${cleanMessage}</p>
               <hr/>
               <p>Yönetim panelinden başvuruyu inceleyip onaylayabilirsiniz.</p>`
      });
    } catch (mailError) {
      console.error('Admin mail notification failed:', mailError);
    }

    res.json(application);
  } catch (error) {
    console.error('Application create error:', error);
    res.status(500).json({ error: 'Başvuru oluşturulamadı' });
  }
});

app.get('/api/applications', authenticate, requireAdmin, async (req, res) => {
  try {
    const apps = await prisma.membershipApplication.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(apps);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Başvurular getirilemedi' });
  }
});

app.put('/api/applications/:id/approve', authenticate, requireAdmin, async (req, res) => {
  try {
    const appData = await prisma.membershipApplication.findUnique({ where: { id: req.params.id } });
    if (!appData) return res.status(404).json({ error: 'Başvuru bulunamadı' });

    await prisma.membershipApplication.update({
      where: { id: req.params.id },
      data: { status: 'APPROVED' }
    });

    // Send WhatsApp Link to User
    const wpLink = process.env.WHATSAPP_GROUP_LINK || 'https://chat.whatsapp.com/EXAMPLELINK';
    try {
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: appData.email,
        subject: `Üyelik Başvurunuz Onaylandı!`,
        html: `<h3>Merhaba ${appData.name},</h3>
               <p>Üyelik başvurunuz onaylanmıştır. Aramıza hoş geldiniz!</p>
               <p>Aşağıdaki linkten resmi WhatsApp grubumuza katılabilirsiniz:</p>
               <a href="${wpLink}" style="display:inline-block;padding:10px 20px;background:#25D366;color:#fff;text-decoration:none;border-radius:5px;margin-top:10px;">WhatsApp Grubuna Katıl</a>`
      });
    } catch (mailError) {
      console.error('User mail notification failed:', mailError);
    }

    res.json({ message: 'Onaylandı ve mail gönderildi' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'İşlem başarısız' });
  }
});

app.delete('/api/applications/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await prisma.membershipApplication.delete({ where: { id: req.params.id } });
    res.json({ message: 'Başvuru silindi' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Silinemedi' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
