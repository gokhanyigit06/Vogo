-- Storage Bucket için RLS Politikaları
-- Bu dosyayı Supabase SQL Editor'da çalıştır

-- 1. Images bucket için INSERT politikası (Herkes yükleyebilir)
CREATE POLICY "Anyone can upload images"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'images');

-- 2. Images bucket için SELECT politikası (Herkes görüntüleyebilir)
CREATE POLICY "Anyone can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'images');

-- 3. Images bucket için DELETE politikası (Herkes silebilir)
CREATE POLICY "Anyone can delete images"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'images');

-- ✅ TAMAMLANDI!
-- Artık resim yükleme çalışacak.
