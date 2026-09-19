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
import { createClient } from '@supabase/supabase-js';

dotenv.config();

// Initialize Supabase Client for Storage
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

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

app.use(cors());
app.use(express.json());

// Serve static files from uploads (only works locally)
if (process.env.VERCEL !== '1') {
  const uploadsDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }
  app.use('/uploads', express.static(uploadsDir));
}

// Multer storage config (Use memory storage for Vercel & Supabase)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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
      { id: user.id, email: user.email, role: user.role, name: user.name, mustChangePassword: user.mustChangePassword },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role, mustChangePassword: user.mustChangePassword } });
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

// Change Password
app.put('/api/auth/change-password', authenticate, async (req: any, res: any) => {
  const { newPassword } = req.body;
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'Şifre en az 6 karakter olmalıdır' });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword, mustChangePassword: false }
    });

    // Optionally generate a new token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name, mustChangePassword: user.mustChangePassword },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ message: 'Şifre başarıyla güncellendi', token, user: { id: user.id, email: user.email, name: user.name, role: user.role, mustChangePassword: user.mustChangePassword } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Şifre güncellenemedi' });
  }
});

// Forgot Password - Send Code
app.post('/api/auth/forgot-password', async (req: any, res: any) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'E-posta adresi gereklidir' });

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'Sistemde bu e-posta adresi ile eşleşen bir üye bulunamadı.' });
    }

    // Generate 6-digit code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    await prisma.user.update({
      where: { id: user.id },
      data: { resetCode, resetCodeExpires }
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: user.email,
      subject: 'Şifre Sıfırlama Kodu',
      html: `<h3>Merhaba ${user.name},</h3>
             <p>Şifrenizi sıfırlamak için aşağıdaki 6 haneli doğrulama kodunu kullanabilirsiniz:</p>
             <h2 style="background: #f4f4f4; padding: 10px; display: inline-block; letter-spacing: 5px;">${resetCode}</h2>
             <p>Bu kod 15 dakika boyunca geçerlidir.</p>
             <p>Eğer şifre sıfırlama talebinde bulunmadıysanız bu e-postayı dikkate almayınız.</p>`
    });

    res.json({ message: 'Şifre sıfırlama kodu e-posta adresinize gönderildi' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'İşlem sırasında bir hata oluştu' });
  }
});

// Reset Password - Verify Code and Update Password
app.post('/api/auth/reset-password', async (req: any, res: any) => {
  const { email, code, newPassword } = req.body;
  
  if (!email || !code || !newPassword) {
    return res.status(400).json({ error: 'Tüm alanları doldurun' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Yeni şifre en az 6 karakter olmalıdır' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user || user.resetCode !== code || !user.resetCodeExpires || user.resetCodeExpires < new Date()) {
      return res.status(400).json({ error: 'Geçersiz veya süresi dolmuş doğrulama kodu' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        password: hashedPassword, 
        mustChangePassword: false,
        resetCode: null,
        resetCodeExpires: null 
      }
    });

    res.json({ message: 'Şifreniz başarıyla sıfırlandı. Yeni şifrenizle giriş yapabilirsiniz.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Şifre sıfırlanırken bir hata oluştu' });
  }
});

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

// --- Upload Management (Supabase Storage) ---
app.post('/api/upload', authenticate, upload.single('image'), async (req: any, res: any) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Dosya yüklenmedi' });
  }

  try {
    const file = req.file;
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
      .from('tdb-gallery')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage.from('tdb-gallery').getPublicUrl(filePath);
    const imageUrl = publicUrlData.publicUrl;

    res.json({ imageUrl });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Görsel yüklenemedi. Supabase ayarlarını kontrol edin.' });
  }
});

app.post('/api/upload/multiple', authenticate, upload.array('images', 50), async (req: any, res: any) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'Dosya yüklenmedi' });
  }

  try {
    const imageUrls: string[] = [];

    for (const file of req.files) {
      const fileExt = file.originalname.split('.').pop();
      const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from('tdb-gallery')
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false
        });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage.from('tdb-gallery').getPublicUrl(filePath);
      imageUrls.push(publicUrlData.publicUrl);
    }

    res.json({ imageUrls });
  } catch (error) {
    console.error('Multiple upload error:', error);
    res.status(500).json({ error: 'Görseller yüklenemedi. Supabase ayarlarını kontrol edin.' });
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
    const items = await prisma.gallery.findMany({ 
      include: { images: true },
      orderBy: { date: 'desc' } 
    });
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Galeri getirilemedi' });
  }
});

app.post('/api/gallery', authenticate, requireSocialMedia, async (req, res) => {
  const { title, date, imageUrls } = req.body;
  if (!imageUrls || imageUrls.length === 0) {
    return res.status(400).json({ error: 'En az bir fotoğraf yüklemelisiniz' });
  }
  try {
    const coverImage = imageUrls[0];
    const item = await prisma.gallery.create({ 
      data: { 
        title, 
        imageUrl: coverImage,
        date: date ? new Date(date) : new Date(),
        images: {
          create: imageUrls.map((url: string) => ({ imageUrl: url }))
        }
      },
      include: { images: true }
    });
    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Albüm eklenemedi' });
  }
});

app.put('/api/gallery/:id', authenticate, requireSocialMedia, async (req, res) => {
  const { title, date } = req.body;
  try {
    const item = await prisma.gallery.update({
      where: { id: req.params.id },
      data: { 
        title,
        ...(date && { date: new Date(date) })
      }
    });
    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Albüm güncellenemedi' });
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
        ...(imageUrl && { imageUrl }) 
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
        ...(imageUrl && { imageUrl }) 
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

if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
