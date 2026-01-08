
const { createClient } = require('@supabase/supabase-js');

// .env.local'dan okumak için dotenv lazım ama manuel girelim test için (node environment)
const url = 'https://vdeomxngkpkbfsnphcwl.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkZW9teG5na3BrYmZzbnBoY3dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4NzQ1NTYsImV4cCI6MjA4MzQ1MDU1Nn0.C1c_jr4DBsJ3fl4CrNYnu7asD1sTMyu0nDFnzo_j4QI';

const supabase = createClient(url, key);

async function testConnection() {
    console.log("Supabase bağlantısı deneniyor...");
    try {
        const { data, error } = await supabase.from('posts').select('*').limit(1);
        if (error) {
            console.error("HATA:", error.message);
            if (error.code === '42P01') {
                console.log("\n>>> SONUÇ: Tablo bulunamadı. Lütfen SQL kodunu çalıştırın. <<<");
            }
        } else {
            console.log("\n>>> SONUÇ: BAŞARILI! Tabloya erişildi. <<<");
            console.log("Gelen veri:", data);
        }
    } catch (e) {
        console.error("Beklenmedik hata:", e);
    }
}

testConnection();
