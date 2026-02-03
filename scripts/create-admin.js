
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@vogo.com';
    const password = 'vogoadmin123';
    const name = 'Admin User';

    console.log('🚀 Admin kullanıcısı oluşturuluyor...');

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.upsert({
            where: { email },
            update: {
                password: hashedPassword,
                role: 'ADMIN',
            },
            create: {
                email,
                password: hashedPassword,
                name,
                role: 'ADMIN',
            },
        });

        console.log('✅ Admin başarıyla oluşturuldu/güncellendi!');
        console.log(`📧 Email: ${email}`);
        console.log(`🔑 Şifre: ${password}`);
        console.log('⚠️ Not: Güvenliğiniz için giriş yaptıktan sonra şifrenizi değiştirin.');
    } catch (error) {
        console.error('❌ Hata oluştu:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
