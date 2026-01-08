# Vogo Agency - Supabase & Vercel Kurulum Rehberi

Bu proje, veritabanı olarak **Supabase** (PostgreSQL) ve hosting platformu olarak **Vercel** kullanacak şekilde yapılandırılmıştır.

## 1. Supabase Kurulumu

1.  [Supabase.com](https://supabase.com) adresine gidin ve yeni bir proje oluşturun.
2.  Projenize bir isim verin (örn: `vogo-agency-db`) ve güçlü bir şifre belirleyin. (Bu şifreyi unutmayın, Prisma bağlantısında lazım olacak).
3.  Proje oluştuktan sonra sol menüden **Project Settings (Ayarlar) -> API** kısmına gidin.
4.  Şu bilgileri not edin:
    *   `Project URL`
    *   `anon` (public) key

## 2. Veritabanı Bağlantısı (Prisma Ayarları)

1.  Supabase panelinde **Project Settings -> Database** kısmına gidin.
2.  **Connection String** bölümüne gelin ve `URI` sekmesini seçin.
3.  `Mode: Transaction` seçili olsun. Bu `DATABASE_URL`'dir.
4.  `Mode: Session` seçili olsun. Bu `DIRECT_URL`'dir.

## 3. Çevre Değişkenlerini Ayarlama (.env)

Projenizin ana dizininde `.env` adında bir dosya oluşturun ve içine şunları yapıştırın:

```env
# Supabase API (Client-side kullanım için)
NEXT_PUBLIC_SUPABASE_URL="https://SİZİN-PROJECT-URL.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="SİZİN-ANON-KEY"

# Prisma Database (Sunucu tarafı ve migrationlar için)
# [PASSWORD] yerine veritabanı şifrenizi yazın.
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

## 4. Veritabanını Eşitleme (Migration)

Bilgileri girdikten sonra terminalde şu komutu çalıştırarak tabloları Supabase'e gönderin:

```bash
npx prisma db push
```

Bu komut başarıyla biterse, Supabase panelindeki **Table Editor** kısmında `Post`, `Lead`, `Project` tablolarını göreceksiniz.

## 5. Vercel ile Canlıya Alma (Hosting)

1.  [Vercel.com](https://vercel.com) adresine gidin ve GitHub hesabınızla giriş yapın.
2.  `Add New -> Project` diyerek bu projeyi (GitHub reposunu) seçin.
3.  **Environment Variables** kısmına gelin ve `.env` dosyasındaki değerleri (4 adet) tek tek ekleyin.
4.  **Deploy** butonuna basın.

Tebrikler! Vogo Agency artık veritabanı bağlı ve canlıda! 🚀
