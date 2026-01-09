-- Tasks Tablosuna Trello Özellikleri Ekle
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS labels JSONB DEFAULT '[]'::jsonb;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS checklists JSONB DEFAULT '[]'::jsonb;

-- Yorumlar Tablosu
CREATE TABLE IF NOT EXISTS task_comments (
    id BIGSERIAL PRIMARY KEY,
    task_id BIGINT REFERENCES tasks(id) ON DELETE CASCADE,
    created_by BIGINT REFERENCES team_members(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);

-- Dosya Ekleri Tablosu
CREATE TABLE IF NOT EXISTS task_attachments (
    id BIGSERIAL PRIMARY KEY,
    task_id BIGINT REFERENCES tasks(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT,
    uploaded_by BIGINT REFERENCES team_members(id),
    created_at TIMESTAMP DEFAULT now()
);

-- RLS (Güvenlik)
ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_attachments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated users to read comments" ON task_comments;
DROP POLICY IF EXISTS "Allow authenticated users to insert comments" ON task_comments;
DROP POLICY IF EXISTS "Allow authenticated users to delete comments" ON task_comments;

CREATE POLICY "Allow authenticated users to read comments" ON task_comments FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to insert comments" ON task_comments FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to delete comments" ON task_comments FOR DELETE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated users to read attachments" ON task_attachments;
DROP POLICY IF EXISTS "Allow authenticated users to insert attachments" ON task_attachments;
DROP POLICY IF EXISTS "Allow authenticated users to delete attachments" ON task_attachments;

CREATE POLICY "Allow authenticated users to read attachments" ON task_attachments FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to insert attachments" ON task_attachments FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to delete attachments" ON task_attachments FOR DELETE USING (auth.role() = 'authenticated');
