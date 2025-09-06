/* eslint-disable */
const { PrismaClient, Role, BloodGroup } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const bank = await prisma.bloodBank.create({ data: { name: 'Central Blood Bank' } });
  const groups = ['A_POS','A_NEG','B_POS','B_NEG','AB_POS','AB_NEG','O_POS','O_NEG'];
  for (const g of groups) {
    await prisma.inventory.create({ data: { bloodBankId: bank.id, bloodGroup: g, units: 10 } });
  }
  await prisma.user.upsert({ where: { email: 'admin@bb.com' }, update: {}, create: { email: 'admin@bb.com', name: 'Admin', passwordHash: await bcrypt.hash('admin123',10), role: Role.ADMIN } });
  await prisma.user.upsert({ where: { email: 'hospital@bb.com' }, update: {}, create: { email: 'hospital@bb.com', name: 'City Hospital', passwordHash: await bcrypt.hash('hospital123',10), role: Role.HOSPITAL } });
  await prisma.user.upsert({ where: { email: 'patient@bb.com' }, update: {}, create: { email: 'patient@bb.com', name: 'John Doe', passwordHash: await bcrypt.hash('patient123',10), role: Role.PATIENT } });
  console.log('Seeded data complete.');
}

main().then(()=>prisma.$disconnect()).catch(async (e)=>{ console.error(e); await prisma.$disconnect(); process.exit(1); });
