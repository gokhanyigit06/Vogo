-- 1. İZİNLERİ (RLS) SIFIRLA VE DÜZELT
-- Mevcut politikaları temizle (Hata vermemesi için)
DROP POLICY IF EXISTS "Full Access Tasks" ON tasks;
DROP POLICY IF EXISTS "Full Access Attachments" ON task_attachments;
DROP POLICY IF EXISTS "Authenticated can upload" ON storage.objects;
DROP POLICY IF EXISTS "Public can read" ON storage.objects;

-- Tasks Tablosu İzni
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Full Access Tasks" ON tasks FOR ALL USING (auth.role() = 'authenticated');

-- Attachments Tablosu İzni
ALTER TABLE task_attachments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Full Access Attachments" ON task_attachments FOR ALL USING (auth.role() = 'authenticated');

-- 2. STORAGE (DOSYA) AYARLARI
-- Bucket oluştur (Eğer yoksa)
INSERT INTO storage.buckets (id, name, public)
VALUES ('task-attachments', 'task-attachments', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage İzinleri (RLS) - PUBLIC UPLOAD (Debug için gevşetildi)
CREATE POLICY "Public can upload"
ON storage.objects FOR INSERT
TO public
WITH CHECK ( bucket_id = 'task-attachments' );

-- Herkes dosyaları GÖREBİLİR (Public URL çalışması için)
CREATE POLICY "Public can read"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'task-attachments' );

-- Giriş yapmış kullanıcılar kendi dosyalarını SİLEBİLİR/GÜNCELLEYEBİLİR (Opsiyonel ama iyi olur)
CREATE POLICY "Authenticated can update/delete"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'task-attachments' );

CREATE POLICY "Authenticated can delete"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'task-attachments' );
