import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const bcrypt = require('bcrypt');

async function main() {
  await prisma.user.deleteMany();
  console.log('Tüm eski kullanıcılar silindi.');

  const hashedPassword = await bcrypt.hash('kayserituranderneq1727!', 10);
  
  const adminUser = await prisma.user.create({
    data: {
      email: 'kayseritdb@gmail.com',
      password: hashedPassword,
      name: 'İl Başkanı',
      role: 'PRESIDENT',
      mustChangePassword: false
    }
  });
  console.log('Yeni yönetici hesabı oluşturuldu:', adminUser.email);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
