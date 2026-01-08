
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manuel Config (Test ortamı olduğu için)
const url = 'https://vdeomxngkpkbfsnphcwl.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkZW9teG5na3BrYmZzbnBoY3dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4NzQ1NTYsImV4cCI6MjA4MzQ1MDU1Nn0.C1c_jr4DBsJ3fl4CrNYnu7asD1sTMyu0nDFnzo_j4QI';

const supabase = createClient(url, key);

async function seedData() {
    console.log("🚀 Veri Aktarımı Başlıyor...");

    try {
        // --- 1. POSTS (Blog) ---
        console.log("\n📄 Blog Yazıları Aktarılıyor...");
        const postsPath = path.resolve(__dirname, '../data/posts.json');
        if (fs.existsSync(postsPath)) {
            const postsData = JSON.parse(fs.readFileSync(postsPath, 'utf8').replace(/^\uFEFF/, ''));

            // Supabase formatına uygun hale getir (id'yi kaldır, auto-generate olsun veya id ile zorla)
            const formattedPosts = postsData.map(p => ({
                id: p.id,
                title: p.title,
                slug: p.slug || p.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
                content: p.content || '',
                excerpt: p.excerpt || '',
                category: p.category,
                image: p.image,
                status: 'published',
                read_time: p.readTime || '5 dk',
                created_at: new Date().toISOString()
            }));

            // Temizle ve Ekle
            await supabase.from('posts').delete().neq('id', 0); // Hepsini sil
            const { error } = await supabase.from('posts').insert(formattedPosts);

            if (error) console.error("❌ Blog Hata:", error.message);
            else console.log(`✅ ${formattedPosts.length} blog yazısı eklendi.`);
        }

        // --- 2. PROJECTS (Portfolyo) ---
        console.log("\n💼 Projeler Aktarılıyor...");
        const projectsPath = path.resolve(__dirname, '../data/projects.json');
        if (fs.existsSync(projectsPath)) {
            const projectsData = JSON.parse(fs.readFileSync(projectsPath, 'utf8').replace(/^\uFEFF/, ''));

            const formattedProjects = projectsData.map(p => ({
                id: p.id,
                title: p.title,
                client: p.client,
                category: p.category,
                description: p.desc || p.description || '',
                image: p.image,
                created_at: new Date().toISOString()
            }));

            await supabase.from('projects').delete().neq('id', 0);
            const { error } = await supabase.from('projects').insert(formattedProjects);

            if (error) console.error("❌ Portfolyo Hata:", error.message);
            else console.log(`✅ ${formattedProjects.length} proje eklendi.`);
        }

        // --- 3. SERVICES (Hizmetler) ---
        console.log("\n🛠️ Hizmetler Aktarılıyor...");
        const servicesPath = path.resolve(__dirname, '../data/services.json');
        if (fs.existsSync(servicesPath)) {
            const servicesData = JSON.parse(fs.readFileSync(servicesPath, 'utf8').replace(/^\uFEFF/, ''));

            const formattedServices = servicesData.map(s => ({
                id: s.id,
                title: s.title,
                slug: s.slug || s.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
                descr: s.desc || '', // 'desc' reserved word, schema 'descr'
                icon: s.icon || 'Layers',
                status: s.status || 'Aktif',
                views: 0,
                projects_count: 0
            }));

            await supabase.from('services').delete().neq('id', 0);
            const { error } = await supabase.from('services').insert(formattedServices);

            if (error) console.error("❌ Hizmetler Hata:", error.message);
            else console.log(`✅ ${formattedServices.length} hizmet eklendi.`);
        }

        console.log("\n✨ İŞLEM TAMAMLANDI! Veri tabanı senkronize edildi.");

    } catch (e) {
        console.error("Genel Hata:", e);
    }
}

seedData();
