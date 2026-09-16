import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const user = await prisma.user.findUnique({ where: { email: 'admin@kayseritdb.org.tr' } });
  if (!user) {
    console.log('Kullanıcı bulunamadı');
    return;
  }
  
  console.log('User role:', user.role);
  
  const isMatch = await bcrypt.compare('admin123', user.password);
  console.log('Şifre eşleşiyor mu?:', isMatch);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
