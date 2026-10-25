import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
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

app.use(cors({
  origin: [
    'https://kayseritdb.com.tr',
    'https://www.kayseritdb.com.tr',
    'http://localhost:5173',
    'http://localhost:4173',
  ],
  credentials: true,
}));
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

// Multer: memory storage so we can handle errors and write manually
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

// --- Authentication Routes ---

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
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
    console.error(error);
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

    // Dosyayı diske yaz
    const ext = path.extname(req.file.originalname) || '.jpg';
    const filename = `image-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
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

app.post('/api/events/:id/register', async (req, res) => {
  const { name, phone, email } = req.body;
  const eventId = req.params.id;
  try {
    // Check if event exists
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) return res.status(404).json({ error: 'Etkinlik bulunamadı' });

    // Validate fields
    if (!name || !phone || !email) {
      return res.status(400).json({ error: 'Lütfen tüm alanları doldurun' });
    }

    const registration = await prisma.eventRegistration.create({
      data: { eventId, name, phone, email }
    });
    res.json(registration);
  } catch (error) {
    console.error(error);
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
app.post('/api/applications', async (req, res) => {
  const data = req.body;
  try {
    const application = await prisma.membershipApplication.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        birthDate: data.birthDate || '',
        livesInKayseri: data.livesInKayseri || '',
        education: data.education || '',
        ideology: data.ideology || '',
        politicalParty: data.politicalParty || '',
        definitionTurkculuk: data.definitionTurkculuk || '',
        turanMeaning: data.turanMeaning || '',
        reasonToJoin: data.reasonToJoin || '',
        favoriteLeader: data.favoriteLeader || '',
        status: 'PENDING'
      }
    });

    // Notify Admin
    try {
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: process.env.SMTP_USER, // Send to admin email
        subject: `Yeni Üyelik Başvurusu: ${data.name}`,
        html: `<p><b>İsim:</b> ${data.name}</p>
               <p><b>E-posta:</b> ${data.email}</p>
               <p><b>Telefon:</b> ${data.phone}</p>
               ${data.birthDate ? `<p><b>Doğum Tarihi:</b> ${data.birthDate}</p>` : ''}
               ${data.livesInKayseri ? `<p><b>Kayseri'de mi yaşıyor?:</b> ${data.livesInKayseri}</p>` : ''}
               ${data.education ? `<p><b>Eğitim Durumu:</b> ${data.education}</p>` : ''}
               ${data.ideology ? `<p><b>İdeolojik Görüş:</b> ${data.ideology}</p>` : ''}
               ${data.politicalParty ? `<p><b>Siyasi Parti Üyeliği:</b> ${data.politicalParty}</p>` : ''}
               ${data.favoriteLeader ? `<p><b>En Beğendiği Lider:</b> ${data.favoriteLeader}</p>` : ''}
               ${data.definitionTurkculuk ? `<p><b>Türkçülüğün Tanımı:</b> ${data.definitionTurkculuk}</p>` : ''}
               ${data.turanMeaning ? `<p><b>Turan Ne Demek:</b> ${data.turanMeaning}</p>` : ''}
               ${data.reasonToJoin ? `<p><b>Katılma Sebebi:</b> ${data.reasonToJoin}</p>` : ''}
               <p><b>Eklenen Mesaj:</b><br/> ${data.message}</p>
               <hr/>
               <p>Yönetim panelinden başvuruyu inceleyip onaylayabilirsiniz.</p>`
      });
    } catch (mailError) {
      console.error('Admin mail notification failed:', mailError);
    }

    res.json(application);
  } catch (error) {
    console.error(error);
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
