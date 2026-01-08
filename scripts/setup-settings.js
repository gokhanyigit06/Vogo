
const { createClient } = require('@supabase/supabase-js');

// Config
const url = 'https://vdeomxngkpkbfsnphcwl.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkZW9teG5na3BrYmZzbnBoY3dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4NzQ1NTYsImV4cCI6MjA4MzQ1MDU1Nn0.C1c_jr4DBsJ3fl4CrNYnu7asD1sTMyu0nDFnzo_j4QI';
const supabase = createClient(url, key);

async function createTable() {
    console.log("🛠️ Settings tablosu kontrol ediliyor...");

    // Not: Anon key ile tablo oluşturulamaz (Admin yetkisi gerekir). 
    // Ancak INSERT/UPDATE yapabiliriz eğer tablo varsa.
    // Kullanıcının SQL Editor'den yapması en sağlıklısıydı ama
    // madem uzaktan yapamıyoruz, Kullanıcıya SQL kodunu verelim veya 
    // RPC (Remote Procedure Call) varsa onu deneyelim.

    // Şimdilik sadece uyarı verelim.
    console.log("⚠️ UYARI: Supabase üzerinde TABLO OLUŞTURMA işlemi Anon Key ile yapılamaz.");
    console.log("Lütfen Supabase Dashboard > SQL Editor kısmına gidip şu kodu çalıştırın:");

    console.log(`
    -- Settings Tablosu
    CREATE TABLE IF NOT EXISTS settings (
      id BIGINT PRIMARY KEY DEFAULT 1,
      "siteTitle" TEXT,
      "siteDescription" TEXT,
      email TEXT,
      phone TEXT,
      address TEXT,
      instagram TEXT,
      twitter TEXT,
      linkedin TEXT,
      "maintenanceMode" BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
    );

    -- RLS Politikaları
    ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Public settings are viewable by everyone" ON settings FOR SELECT USING (true);
    CREATE POLICY "Public settings are insertable by everyone" ON settings FOR INSERT WITH CHECK (true);
    CREATE POLICY "Public settings are updateable by everyone" ON settings FOR UPDATE USING (true);
    `);
}

createTable();
