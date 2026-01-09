# 🎉 Blog Sistemi Güncellemeleri - Supabase Kurulum Rehberi

## ✅ Yapılan Değişiklikler

### 1. Blog Detay Sayfası Dinamik Hale Getirildi
- Mock data kaldırıldı
- API'den dinamik veri çekme
- Slug bazlı routing

### 2. SEO Optimizasyonları Eklendi
- Open Graph meta tags
- Twitter Cards
- JSON-LD Schema
- Dinamik sitemap

### 3. Otomatik Slug Oluşturma
- Türkçe karakter desteği (ş→s, ğ→g vb.)
- Başlık yazarken otomatik URL oluşturma

---

## 🔧 Supabase Kurulumu (ZORUNLU)

### Adım 1: Supabase Dashboard'a Git
1. https://supabase.com adresinden projenize giriş yapın
2. Sol menüden **SQL Editor**'ı açın

### Adım 2: Ana Schema'yı Çalıştır
`supabase/schema.sql` dosyasının içeriğini kopyalayıp SQL Editor'a yapıştırın ve **RUN** butonuna tıklayın.

Bu şunları oluşturur:
- ✅ `posts` tablosu
- ✅ `projects` tablosu  
- ✅ `services` tablosu
- ✅ `messages` tablosu
- ✅ RLS (Row Level Security) politikaları

### Adım 3: Updated At Kolonunu Ekle
`supabase/add-updated-at.sql` dosyasının içeriğini çalıştırın.

Bu:
- ✅ `posts` tablosuna `updated_at` kolonu ekler
- ✅ Otomatik güncelleme trigger'ı oluşturur

### Adım 4: Storage Bucket Oluştur (Resim Yükleme İçin)
1. Supabase Dashboard > **Storage** bölümüne git
2. **New Bucket** butonuna tıkla
3. Bucket adı: `images`
4. **Public bucket** seçeneğini işaretle ✅
5. **Create bucket**

**Not:** Public bucket yapmayı unutma, yoksa yüklenen resimler gözükmez!

### Adım 5: Storage RLS Politikalarını Ekle
Supabase SQL Editor'da `supabase/storage-policies.sql` dosyasının içeriğini çalıştır.

Bu sayede:
- ✅ Herkes resim yükleyebilir
- ✅ Herkes resimleri görüntüleyebilir
- ✅ Yöneticiler resim silebilir

**Önemli:** Bu adımı yapmazsan "row-level security policy" hatası alırsın!

---

## 🌐 Environment Variables

`.env.local` dosyanızda şunların olduğundan emin olun:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Not:** Bunları Supabase Dashboard > Settings > API'den alabilirsiniz.

---

## 🧪 Test Etme

### 1. Geliştirme Sunucusunu Başlat
```bash
npm run dev
```

### 2. Admin Panelinden Yazı Ekle
- http://localhost:3000/admin/blog/new
- Başlık yaz (slug otomatik oluşur)
- İçerik ekle
- Yayınla

### 3. Blog'u Kontrol Et
- http://localhost:3000/blog
- Yeni yazının göründüğünü kontrol et
- Yazıya tıkla, detay sayfasının açıldığını gör

### 4. SEO Kontrolü
- Blog detay sayfasında sağ tık > "Kaynağı Görüntüle"
- `<meta property="og:title"` gibi tagların olduğunu kontrol et
- http://localhost:3000/sitemap.xml adresine git
- Blog yazılarının sitemap'te olduğunu gör

---

## 🚀 Canlıya Alma (Git Push)

```bash
git add .
git commit -m "feat: Blog sistemi SEO optimizasyonları ve dinamik içerik"
git push
```

Vercel otomatik deploy edecek! 🎉

---

## 📝 Notlar

- **Local Fallback:** Supabase bağlantısı yoksa `data/posts.json` kullanılır
- **Slug:** Türkçe karakterler otomatik İngilizce'ye dönüştürülür
- **SEO:** Her blog yazısı için otomatik meta taglar oluşturulur
- **Sitemap:** Google'a otomatik bildirim için `/sitemap.xml` güncellenir

---

## 🆘 Sorun Giderme

### "Post bulunamadı" hatası
- Supabase'de SQL'lerin çalıştığını kontrol edin
- Environment variables'ları kontrol edin
- Browser console'da hata mesajlarını inceleyin

### Slug çalışmıyor
- Admin panelden yeni yazı oluştururken slug preview'ın göründüğünü kontrol edin
- Başlıkta Türkçe karakter varsa otomatik dönüştürülmeli

### SEO tagları görünmüyor
- Build alın: `npm run build && npm start`
- Production'da meta taglar render edilir

---

**Hazırlayan:** Antigravity AI 🚀  
**Tarih:** 10 Ocak 2026
