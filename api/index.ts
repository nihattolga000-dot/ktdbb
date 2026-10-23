import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import nodemailer from 'nodemailer';

// ────────────────────────────────────────────────────────────────────
// Nodemailer
// ────────────────────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
});

// ────────────────────────────────────────────────────────────────────
// Prisma & PG Pool (Serverless Singleton Pattern)
// ────────────────────────────────────────────────────────────────────
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient; pool?: Pool };

const pool =
  globalForPrisma.pool ||
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 2, // Serverless fonksiyon başına minimum connection
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

if (!globalForPrisma.pool) globalForPrisma.pool = pool;

const adapter = new PrismaPg(pool);
const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ adapter } as any);

if (!globalForPrisma.prisma) globalForPrisma.prisma = prisma;

// ────────────────────────────────────────────────────────────────────
// Express App & Router
// ────────────────────────────────────────────────────────────────────
const app = express();
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key-change-this-in-production';

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (
      origin.includes('kayseritdb.com.tr') ||
      origin.includes('vercel.app') ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1')
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
}));

app.use(express.json());

// ────────────────────────────────────────────────────────────────────
// Middlewares
// ────────────────────────────────────────────────────────────────────
const authenticate = (req: any, res: any, next: any) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Yetkisiz erişim' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Geçersiz token' });
  }
};

const requireAdmin = (req: any, res: any, next: any) => {
  if (req.user?.role !== 'PRESIDENT') {
    return res.status(403).json({ error: 'Bu işlem için il başkanı yetkisi gerekiyor.' });
  }
  next();
};

const requireSocialMedia = (req: any, res: any, next: any) => {
  const allowed = ['PRESIDENT', 'VICE_PRESIDENT', 'KOMISYON_SOSYAL_MEDYA'];
  if (!allowed.includes(req.user?.role)) {
    return res.status(403).json({ error: 'Bu işlem için Sosyal Medya Komisyonu yetkisi gerekiyor.' });
  }
  next();
};

const requireEventComm = (req: any, res: any, next: any) => {
  const allowed = ['PRESIDENT', 'VICE_PRESIDENT', 'KOMISYON_ETKINLIK'];
  if (!allowed.includes(req.user?.role)) {
    return res.status(403).json({ error: 'Bu işlem için Etkinlik Komisyonu yetkisi gerekiyor.' });
  }
  next();
};

// ────────────────────────────────────────────────────────────────────
// Health Check
// ────────────────────────────────────────────────────────────────────
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', serverless: true, timestamp: new Date().toISOString() });
});

// ────────────────────────────────────────────────────────────────────
// Auth
// ────────────────────────────────────────────────────────────────────
router.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Geçersiz e-posta veya şifre' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Geçersiz e-posta veya şifre' });
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

// ────────────────────────────────────────────────────────────────────
// Users
// ────────────────────────────────────────────────────────────────────
router.get('/users', authenticate, requireAdmin, async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Kullanıcılar getirilemedi' });
  }
});

router.post('/users', authenticate, requireAdmin, async (req, res) => {
  const { email, password, name, role } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'Bu e-posta adresi zaten kullanımda' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, password: hashedPassword, name, role } });
    res.json({ message: 'Kullanıcı başarıyla oluşturuldu', user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Kullanıcı oluşturulamadı' });
  }
});

router.delete('/users/:id', authenticate, requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    if ((req as any).user.id === id) return res.status(400).json({ error: 'Kendi hesabınızı silemezsiniz' });
    await prisma.user.delete({ where: { id } });
    res.json({ message: 'Kullanıcı silindi' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Kullanıcı silinemedi' });
  }
});

router.put('/users/:id/role', authenticate, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  try {
    if ((req as any).user.id === id) return res.status(400).json({ error: 'Kendi rolünüzü değiştiremezsiniz' });
    const user = await prisma.user.update({ where: { id }, data: { role } });
    res.json({ message: 'Rol güncellendi', user: { id: user.id, role: user.role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Rol güncellenemedi' });
  }
});

router.put('/users/:id', authenticate, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    const user = await prisma.user.update({ where: { id }, data: { name, email } });
    res.json({ message: 'Kullanıcı güncellendi', user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Kullanıcı güncellenemedi' });
  }
});

// ────────────────────────────────────────────────────────────────────
// News
// ────────────────────────────────────────────────────────────────────
router.get('/news', async (_req, res) => {
  try {
    const news = await prisma.news.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Haberler getirilemedi' });
  }
});

router.get('/news/:id', async (req, res) => {
  try {
    const newsItem = await prisma.news.findUnique({ where: { id: req.params.id } });
    if (!newsItem) return res.status(404).json({ error: 'Haber bulunamadı' });
    res.json(newsItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Haber getirilemedi' });
  }
});

router.post('/news', authenticate, requireSocialMedia, async (req, res) => {
  const { title, content, imageUrl } = req.body;
  try {
    const news = await prisma.news.create({
      data: { title, content, imageUrl, authorId: (req as any).user.id },
    });
    res.json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Haber oluşturulamadı' });
  }
});

router.put('/news/:id', authenticate, requireSocialMedia, async (req, res) => {
  const { title, content, imageUrl } = req.body;
  try {
    const news = await prisma.news.update({
      where: { id: req.params.id },
      data: { title, content, ...(imageUrl && { imageUrl }) },
    });
    res.json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Haber güncellenemedi' });
  }
});

router.delete('/news/:id', authenticate, requireSocialMedia, async (req, res) => {
  try {
    await prisma.news.delete({ where: { id: req.params.id } });
    res.json({ message: 'Haber silindi' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Haber silinemedi' });
  }
});

// ────────────────────────────────────────────────────────────────────
// Gallery
// ────────────────────────────────────────────────────────────────────
router.get('/gallery', async (_req, res) => {
  try {
    const items = await prisma.gallery.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Galeri getirilemedi' });
  }
});

router.post('/gallery', authenticate, requireSocialMedia, async (req, res) => {
  const { title, imageUrl } = req.body;
  try {
    const item = await prisma.gallery.create({ data: { title, imageUrl } });
    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Fotoğraf eklenemedi' });
  }
});

router.put('/gallery/:id', authenticate, requireSocialMedia, async (req, res) => {
  const { title } = req.body;
  try {
    const item = await prisma.gallery.update({ where: { id: req.params.id }, data: { title } });
    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Fotoğraf güncellenemedi' });
  }
});

router.delete('/gallery/:id', authenticate, requireSocialMedia, async (req, res) => {
  try {
    await prisma.gallery.delete({ where: { id: req.params.id } });
    res.json({ message: 'Fotoğraf silindi' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Fotoğraf silinemedi' });
  }
});

// ────────────────────────────────────────────────────────────────────
// Events
// ────────────────────────────────────────────────────────────────────
router.get('/event-registrations', authenticate, requireEventComm, async (_req, res) => {
  try {
    const registrations = await prisma.eventRegistration.findMany({
      include: { event: { select: { title: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(registrations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Etkinlik başvuruları getirilemedi' });
  }
});

router.get('/events', async (_req, res) => {
  try {
    const events = await prisma.event.findMany({ orderBy: { eventDate: 'asc' } });
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Etkinlikler getirilemedi' });
  }
});

router.get('/events/:id/registrations', authenticate, requireEventComm, async (req, res) => {
  try {
    const registrations = await prisma.eventRegistration.findMany({
      where: { eventId: req.params.id },
      orderBy: { createdAt: 'desc' },
    });
    res.json(registrations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Başvurular getirilemedi' });
  }
});

router.get('/events/:id', async (req, res) => {
  try {
    const event = await prisma.event.findUnique({ where: { id: req.params.id } });
    if (!event) return res.status(404).json({ error: 'Etkinlik bulunamadı' });
    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Etkinlik getirilemedi' });
  }
});

router.post('/events/:id/register', async (req, res) => {
  const { name, phone, email } = req.body;
  const eventId = req.params.id;
  try {
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) return res.status(404).json({ error: 'Etkinlik bulunamadı' });
    if (!name || !phone || !email) return res.status(400).json({ error: 'Lütfen tüm alanları doldurun' });
    const registration = await prisma.eventRegistration.create({ data: { eventId, name, phone, email } });
    res.json(registration);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Başvuru alınamadı' });
  }
});

router.post('/events', authenticate, requireEventComm, async (req, res) => {
  const { title, description, location, eventDate, imageUrl } = req.body;
  try {
    const event = await prisma.event.create({
      data: { title, description, location, eventDate: new Date(eventDate), imageUrl },
    });
    res.json(event);
  } catch (error) {
    console.error('Events POST error:', error);
    res.status(500).json({ error: 'Etkinlik oluşturulamadı' });
  }
});

router.put('/events/:id', authenticate, requireEventComm, async (req, res) => {
  const { title, description, location, eventDate, imageUrl } = req.body;
  try {
    const event = await prisma.event.update({
      where: { id: req.params.id },
      data: { title, description, location, eventDate: new Date(eventDate), ...(imageUrl && { imageUrl }) },
    });
    res.json(event);
  } catch (error) {
    console.error('Events PUT error:', error);
    res.status(500).json({ error: 'Etkinlik güncellenemedi' });
  }
});

router.delete('/events/:id', authenticate, requireEventComm, async (req, res) => {
  try {
    await prisma.event.delete({ where: { id: req.params.id } });
    res.json({ message: 'Etkinlik silindi' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Etkinlik silinemedi' });
  }
});

// ────────────────────────────────────────────────────────────────────
// Projects
// ────────────────────────────────────────────────────────────────────
router.get('/projects', async (_req, res) => {
  try {
    const projects = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Projeler getirilemedi' });
  }
});

router.get('/projects/:id', async (req, res) => {
  try {
    const project = await prisma.project.findUnique({ where: { id: req.params.id } });
    if (!project) return res.status(404).json({ error: 'Proje bulunamadı' });
    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Proje getirilemedi' });
  }
});

router.post('/projects', authenticate, requireEventComm, async (req, res) => {
  const { title, description, status, imageUrl } = req.body;
  try {
    const project = await prisma.project.create({ data: { title, description, status, imageUrl } });
    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Proje oluşturulamadı' });
  }
});

router.put('/projects/:id', authenticate, requireEventComm, async (req, res) => {
  const { title, description, status, imageUrl } = req.body;
  try {
    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: { title, description, status, ...(imageUrl && { imageUrl }) },
    });
    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Proje güncellenemedi' });
  }
});

router.delete('/projects/:id', authenticate, requireEventComm, async (req, res) => {
  try {
    await prisma.project.delete({ where: { id: req.params.id } });
    res.json({ message: 'Proje silindi' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Proje silinemedi' });
  }
});

// ────────────────────────────────────────────────────────────────────
// Membership & Contact Applications
// ────────────────────────────────────────────────────────────────────
router.post('/applications', async (req, res) => {
  const data = req.body;
  try {
    const application = await prisma.membershipApplication.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        message: data.message || '',
        birthDate: data.birthDate || '',
        livesInKayseri: data.livesInKayseri || '',
        education: data.education || '',
        ideology: data.ideology || '',
        politicalParty: data.politicalParty || '',
        definitionTurkculuk: data.definitionTurkculuk || '',
        turanMeaning: data.turanMeaning || '',
        reasonToJoin: data.reasonToJoin || '',
        favoriteLeader: data.favoriteLeader || '',
        status: 'PENDING',
      },
    });

    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        await transporter.sendMail({
          from: process.env.SMTP_USER,
          to: process.env.SMTP_USER,
          subject: `Yeni İletişim / Başvuru Formu: ${data.name}`,
          html: `<p><b>İsim:</b> ${data.name}</p>
                 <p><b>E-posta:</b> ${data.email}</p>
                 <p><b>Telefon:</b> ${data.phone || 'Belirtilmedi'}</p>
                 <p><b>Konu:</b> ${data.subject || 'Genel'}</p>
                 ${data.birthDate ? `<p><b>Doğum Tarihi:</b> ${data.birthDate}</p>` : ''}
                 ${data.education ? `<p><b>Eğitim:</b> ${data.education}</p>` : ''}
                 ${data.ideology ? `<p><b>İdeoloji:</b> ${data.ideology}</p>` : ''}
                 ${data.reasonToJoin ? `<p><b>Katılma Sebebi:</b> ${data.reasonToJoin}</p>` : ''}
                 <p><b>Mesaj:</b><br/> ${data.message}</p>
                 <hr/><p>Yönetim panelinden başvuruyu inceleyebilirsiniz.</p>`,
        });
      } catch (mailError) {
        console.error('Mail notification failed:', mailError);
      }
    }

    res.json(application);
  } catch (error) {
    console.error('Application create error:', error);
    res.status(500).json({ error: 'Başvuru oluşturulamadı' });
  }
});

router.get('/applications', authenticate, requireAdmin, async (_req, res) => {
  try {
    const apps = await prisma.membershipApplication.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(apps);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Başvurular getirilemedi' });
  }
});

router.put('/applications/:id/approve', authenticate, requireAdmin, async (req, res) => {
  try {
    const appData = await prisma.membershipApplication.findUnique({ where: { id: req.params.id } });
    if (!appData) return res.status(404).json({ error: 'Başvuru bulunamadı' });

    await prisma.membershipApplication.update({
      where: { id: req.params.id },
      data: { status: 'APPROVED' },
    });

    const wpLink = process.env.WHATSAPP_GROUP_LINK || 'https://chat.whatsapp.com/FDx1nnfCm2x9QnnKrHvuUw';
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        await transporter.sendMail({
          from: process.env.SMTP_USER,
          to: appData.email,
          subject: 'Üyelik Başvurunuz Onaylandı!',
          html: `<h3>Merhaba ${appData.name},</h3>
                 <p>Üyelik başvurunuz onaylanmıştır. Aramıza hoş geldiniz!</p>
                 <a href="${wpLink}" style="display:inline-block;padding:10px 20px;background:#25D366;color:#fff;text-decoration:none;border-radius:5px;">WhatsApp Grubuna Katıl</a>`,
        });
      } catch (mailError) {
        console.error('User mail notification failed:', mailError);
      }
    }

    res.json({ message: 'Onaylandı ve mail gönderildi' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'İşlem başarısız' });
  }
});

router.delete('/applications/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await prisma.membershipApplication.delete({ where: { id: req.params.id } });
    res.json({ message: 'Başvuru silindi' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Silinemedi' });
  }
});

// Hem /api hem de kök yolları router'a bağla (Vercel rewrite uyumluluğu için)
app.use('/api', router);
app.use('/', router);

export default app;
