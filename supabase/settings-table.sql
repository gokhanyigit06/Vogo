-- Settings tablosunu oluştur
CREATE TABLE IF NOT EXISTS settings (
    id BIGINT PRIMARY KEY DEFAULT 1,
    site_title TEXT DEFAULT 'Vogo Agency',
    site_description TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    instagram TEXT,
    twitter TEXT,
    linkedin TEXT,
    maintenance_mode BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS'i aktifleştir
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Herkes okuyabilir
CREATE POLICY "Allow public read settings" ON settings FOR SELECT USING (true);

-- Herkese insert/update izni (admin paneli için)
CREATE POLICY "Allow all for settings" ON settings FOR ALL USING (true);

-- Varsayılan ayarları ekle
INSERT INTO settings (id, site_title, site_description, email, phone, address, instagram, twitter, linkedin)
VALUES (
    1,
    'Vogo Agency',
    'Dijital Çözümler ve Web Tasarım Ajansı',
    'info@vogoagency.com',
    '+90 555 123 45 67',
    'İstanbul, Türkiye',
    'https://instagram.com/vogoagency',
    'https://twitter.com/vogoagency',
    'https://linkedin.com/company/vogoagency'
)
ON CONFLICT (id) DO NOTHING;
