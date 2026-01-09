-- Business Hub Database Schema (Updated - Compatible with existing tables)
-- Run this in Supabase SQL Editor

-- ============================================
-- 1. CLIENTS (Müşteriler) - NEW TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS clients (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  website TEXT,
  status TEXT DEFAULT 'active', -- active, potential, inactive
  tags TEXT[], -- web, seo, ads, etc.
  notes TEXT,
  total_revenue DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- ============================================
-- 2. PROJECTS - UPDATE EXISTING OR CREATE
-- ============================================
-- Projects tablosu zaten var, sadece eksik kolonları ekle
DO $$ 
BEGIN
  -- Eğer tablo yoksa oluştur
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'projects') THEN
    CREATE TABLE projects (
      id BIGSERIAL PRIMARY KEY,
      client_id BIGINT REFERENCES clients(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'in_progress',
      category TEXT,
      budget DECIMAL(10,2),
      actual_cost DECIMAL(10,2) DEFAULT 0,
      start_date DATE,
      end_date DATE,
      priority TEXT DEFAULT 'medium',
      progress INTEGER DEFAULT 0,
      image TEXT,
      files JSONB DEFAULT '[]'::jsonb,
      created_at TIMESTAMP DEFAULT now(),
      updated_at TIMESTAMP DEFAULT now()
    );
  ELSE
    -- Tablo varsa, eksik kolonları ekle
    ALTER TABLE projects ADD COLUMN IF NOT EXISTS client_id BIGINT REFERENCES clients(id) ON DELETE SET NULL;
    ALTER TABLE projects ADD COLUMN IF NOT EXISTS budget DECIMAL(10,2);
    ALTER TABLE projects ADD COLUMN IF NOT EXISTS actual_cost DECIMAL(10,2) DEFAULT 0;
    ALTER TABLE projects ADD COLUMN IF NOT EXISTS start_date DATE;
    ALTER TABLE projects ADD COLUMN IF NOT EXISTS end_date DATE;
    ALTER TABLE projects ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'medium';
    ALTER TABLE projects ADD COLUMN IF NOT EXISTS progress INTEGER DEFAULT 0;
    ALTER TABLE projects ADD COLUMN IF NOT EXISTS files JSONB DEFAULT '[]'::jsonb;
    ALTER TABLE projects ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'in_progress';
  END IF;
END $$;

-- ============================================
-- 3. INCOME (Gelirler) - NEW TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS income (
  id BIGSERIAL PRIMARY KEY,
  client_id BIGINT REFERENCES clients(id) ON DELETE SET NULL,
  project_id BIGINT REFERENCES projects(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  date DATE NOT NULL,
  category TEXT DEFAULT 'payment', -- payment, deposit, refund
  payment_method TEXT, -- bank_transfer, cash, card
  invoice_number TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- ============================================
-- 4. EXPENSES (Giderler) - NEW TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS expenses (
  id BIGSERIAL PRIMARY KEY,
  amount DECIMAL(10,2) NOT NULL,
  date DATE NOT NULL,
  category TEXT NOT NULL, -- rent, salary, software, ads, office, other
  description TEXT,
  invoice_number TEXT,
  vendor TEXT, -- Ödeme yapılan firma/kişi
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- ============================================
-- 5. TEAM MEMBERS (Takım Üyeleri) - NEW TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS team_members (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'member', -- admin, manager, member
  email TEXT UNIQUE,
  avatar_url TEXT,
  permissions JSONB DEFAULT '{}'::jsonb,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- ============================================
-- 6. TASKS (Görevler) - NEW TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS tasks (
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

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Clients RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow authenticated users to read clients" ON clients;
DROP POLICY IF EXISTS "Allow authenticated users to insert clients" ON clients;
DROP POLICY IF EXISTS "Allow authenticated users to update clients" ON clients;
DROP POLICY IF EXISTS "Allow authenticated users to delete clients" ON clients;

CREATE POLICY "Allow authenticated users to read clients" ON clients FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to insert clients" ON clients FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to update clients" ON clients FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to delete clients" ON clients FOR DELETE USING (auth.role() = 'authenticated');

-- Income RLS
ALTER TABLE income ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users to read income" ON income FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to insert income" ON income FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to update income" ON income FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to delete income" ON income FOR DELETE USING (auth.role() = 'authenticated');

-- Expenses RLS
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users to read expenses" ON expenses FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to insert expenses" ON expenses FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to update expenses" ON expenses FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to delete expenses" ON expenses FOR DELETE USING (auth.role() = 'authenticated');

-- Team Members RLS
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users to read team_members" ON team_members FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to insert team_members" ON team_members FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to update team_members" ON team_members FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to delete team_members" ON team_members FOR DELETE USING (auth.role() = 'authenticated');

-- Tasks RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users to read tasks" ON tasks FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to insert tasks" ON tasks FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to update tasks" ON tasks FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to delete tasks" ON tasks FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================
-- INDEXES (Performance Optimization)
-- ============================================

CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_income_client_id ON income(client_id);
CREATE INDEX IF NOT EXISTS idx_income_project_id ON income(project_id);
CREATE INDEX IF NOT EXISTS idx_income_date ON income(date);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);

-- ============================================
-- TRIGGERS (Auto-update timestamps)
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_clients_updated_at ON clients;
DROP TRIGGER IF EXISTS update_income_updated_at ON income;
DROP TRIGGER IF EXISTS update_expenses_updated_at ON expenses;
DROP TRIGGER IF EXISTS update_team_members_updated_at ON team_members;
DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_income_updated_at BEFORE UPDATE ON income FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON team_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
