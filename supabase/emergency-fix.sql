-- ACİL DURUM DÜZELTMESİ (EMERGENCY FIX)
-- Bu scripti çalıştırınca İZİN HATASI almamalısın.

-- 1. Storage (Dosya) İzinlerini Tamamen Aç
DROP POLICY IF EXISTS "Allow All Storage" ON storage.objects;
CREATE POLICY "Allow All Storage" ON storage.objects FOR ALL USING (true) WITH CHECK (true);

-- 2. DB Tablo İzinlerini Tamamen Aç (Task Attachments)
ALTER TABLE task_attachments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow All Attachments" ON task_attachments;
CREATE POLICY "Allow All Attachments" ON task_attachments FOR ALL USING (true) WITH CHECK (true);

-- 3. Bucket'ı Garantiye Al
INSERT INTO storage.buckets (id, name, public)
VALUES ('task-attachments', 'task-attachments', true)
ON CONFLICT (id) DO UPDATE SET public = true;
