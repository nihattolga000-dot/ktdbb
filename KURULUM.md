# KTDB Projesi Kurulum Rehberi

Bu projeyi başka bir bilgisayara indirdiğinizde çalıştırmak için aşağıdaki adımları sırasıyla uygulamanız gerekmektedir. Proje bir "Monorepo" (tek depo içinde hem frontend hem backend) yapısındadır.

## 1. Frontend (Arayüz) Bağımlılıklarının Kurulumu
Projenin ana dizininde (root) terminal açın ve aşağıdaki komutu çalıştırın:
```bash
npm install
```

## 2. Backend (Sunucu) Bağımlılıklarının Kurulumu
Ana dizinden `server` klasörüne girin ve backend bağımlılıklarını kurun:
```bash
cd server
npm install
```

## 3. Çevre Değişkenleri (.env) Ayarı
Güvenlik gereği `.env` dosyası GitHub'a yüklenmemiştir (gitignore). `server` klasörü içinde yeni bir `.env` dosyası oluşturun ve içerisine aşağıdaki veritabanı bağlantı bilgilerini yapıştırın:
```env
DATABASE_URL="postgresql://postgres.vyovmrpsqsjtbqbkoftc:jphrthmA_Tdb_Kayseri@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.vyovmrpsqsjtbqbkoftc:jphrthmA_Tdb_Kayseri@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"
JWT_SECRET="super-secret-jwt-key"
```

## 4. Prisma (Veritabanı) İstemcisinin Oluşturulması
`.env` dosyasını oluşturduktan sonra `server` dizini içerisindeyken Prisma istemcisini oluşturmak için şu komutu çalıştırın:
```bash
npx prisma generate
```

## 5. Projeyi Çalıştırma
Projeyi geliştirmek ve çalıştırmak için **iki ayrı terminale** ihtiyacınız olacak.

**Terminal 1 (Backend - Sunucu için):**
`server` klasörünün içindeyken:
```bash
npm run dev
```
*(Bu komut arka plan sunucusunu `http://localhost:5000` adresinde başlatır)*

**Terminal 2 (Frontend - Arayüz için):**
Projenin ana klasörüne dönün (`cd ..` ile) ve:
```bash
npm run dev
```
*(Bu komut arayüzü başlatır, terminalde çıkan `http://localhost:5173` gibi bir linke tıklayarak siteye erişebilirsiniz)*
