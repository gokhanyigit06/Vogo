-- Tasks tablosunu tamamen silip yeniden oluştur (Temiz kurulum)
DROP TABLE IF EXISTS tasks CASCADE;

CREATE TABLE tasks (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,
  assigned_to BIGINT REFERENCES team_members(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo', -- todo, in_progress, done
  priority TEXT DEFAULT 'medium', -- low, medium, high
  due_date DATE,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- RLS (Güvenlik)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read tasks" ON tasks FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to insert tasks" ON tasks FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to update tasks" ON tasks FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to delete tasks" ON tasks FOR DELETE USING (auth.role() = 'authenticated');
