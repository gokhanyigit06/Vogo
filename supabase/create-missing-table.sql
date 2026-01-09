-- EKSİK TABLO OLUŞTURMA VE TAM YETKİLENDİRME
-- Hata: "relation task_attachments does not exist" için çözüm.

-- 1. task_attachments Tablosunu Oluştur
CREATE TABLE IF NOT EXISTS task_attachments (
    id BIGSERIAL PRIMARY KEY,
    task_id BIGINT REFERENCES tasks(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tablo İzinlerini (RLS) Herkese Aç (Hata almamak için)
ALTER TABLE task_attachments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable all access for task_attachments" ON task_attachments;
CREATE POLICY "Enable all access for task_attachments" 
ON task_attachments 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- 3. Storage Bucket Kontrolü
INSERT INTO storage.buckets (id, name, public) 
VALUES ('task-attachments', 'task-attachments', true) 
ON CONFLICT (id) DO UPDATE SET public = true;

-- 4. Storage İzinleri (Public Upload/Read)
DROP POLICY IF EXISTS "Give public access to task-attachments" ON storage.objects;
CREATE POLICY "Give public access to task-attachments"
ON storage.objects
FOR ALL
USING ( bucket_id = 'task-attachments' )
WITH CHECK ( bucket_id = 'task-attachments' );
