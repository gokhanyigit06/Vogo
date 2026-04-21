const posts = [
    {
        title: "E-Ticarette Dönüşüm Oranını (CR) Artırmanın 5 Kesin Yolu",
        slug: "e-ticarette-donusum-oranini-cr-artirmanin-5-kesin-yolu",
        excerpt: "Ziyaretçileriniz sitenize geliyor ama satın almıyor mu? Sepeti terk etme oranlarını düşürüp geliri artıracak UI/UX optimizasyonları ve sepet kurguları.",
        content: "<p>E-ticaret sitelerinde ziyaretçiyi getirmek işin sadece yarısıdır. Asıl zor kısım, o ziyaretçiyi müşteriye dönüştürebilmektir (Conversion Rate). Türkiye standartlarında bir e-ticaret sitesinin dönüşüm oranı (CR) ortalama %1.5 - %2 arasındadır. Eğer sizin oranınız %1'in altındaysa aşağıdaki 5 kritik maddeyi derhal sitenize entegre etmelisiniz:</p><h3>1. Hızlı ve Pürüzsüz Checkout (Ödeme) Sayfası</h3><p>Müşteriyi kasada bekletmeyin! Gereksiz form alanlarını kaldırın, 'Misafir Olarak Devam Et' seçeneğini çok belirgin yapın ve iyzico/PayTR gibi tek tıkla ödeme altyapılarını kullanın.</p><h3>2. Sayfa Hızı (Core Web Vitals) Optimizasyonu</h3><p>Sitenizin açılmasındaki her 1 saniyelik gecikme, dönüşüm oranınızı %20 düşürür. Next.js gibi modern mimarilere geçiş yaparak bunu çözebilirsiniz.</p>",
        category: "E-Ticaret",
        date: "Eki 24, 2026",
        readTime: "6 dk",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?w=1504&q=80",
        status: "published"
    },
    {
        title: "Yapay Zeka Destekli Reklam Kampanyaları",
        slug: "yapay-zeka-destekli-reklam-kampanyalari",
        excerpt: "Meta Advantage+ ve Google PMax ile algoritmayı kendi lehinize nasıl çevirirsiniz?",
        content: "<p>Geleneksel hedefleme ayarları (yaş, ilgi alanı seçmek) artık geride kaldı. Google'ın Performance Max (PMax) ve Meta'nın Advantage+ algoritmaları tamamen makine öğrenimine dayanıyor.</p><p>Buradaki asıl kilit nokta, sisteme doğru hesap kurulumu ile kaliteli sinyaller ve iyi tasarlanmış görseller/videolar vermektir. Pikselinizin hatasız çalışması ve dönüşüm API'si (CAPI) entegrasyonu, bu kampanyalardan maksimum verim almanın %80'ini oluşturur.</p>",
        category: "Performans Reklamları",
        date: "Eki 20, 2026",
        readTime: "4 dk",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
        status: "published"
    },
    {
        title: "2026'da SEO: Yapay Zeka İçerikleri İşe Yarıyor mu?",
        slug: "2026da-seo-yapay-zeka-icerikleri-ise-yariyor-mu",
        excerpt: "Sadece ChatGPT kullanarak organik sıralama almak hala mümkün mü?",
        content: "<p>Google'ın 2024 ve 2025'te arka arkaya yaptığı Core Update güncellemeleri, kalitesiz ve sadece AI tarafından üretilmiş içerikleri yerle bir etti.</p><h3>Peki Yapay Zeka Yasak Mı?</h3><p>Hayır. Olay içeriğin nasıl üretildiği değil, okuyucuya değer katıp katmadığı üzerine dönüyor. Yapay zekayı bir yardımcı pilot gibi kullanıp, içeriğe kendi sektörel deneyimlerinizi ('Experience' metriklerini) eklerseniz hala sıralama alabilirsiniz.</p>",
        category: "SEO",
        date: "Eki 18, 2026",
        readTime: "5 dk",
        image: "https://images.unsplash.com/photo-1504868584819-f8e8b716656f?w=800&q=80",
        status: "published"
    },
    {
        title: "VogoPOS ile Sipariş Hacmini %30 Artırın",
        slug: "vogopos-ile-siparis-hacmini-30-artirin",
        excerpt: "Restoran ve kafeler için iştah açan QR Menü tasarımlarının ciroya olan doğrudan etkisi.",
        content: "<p>Geleneksel basılı menüler hem masraflı hem de sabittir. Sipariş sırasında müşterinin yanına giden garson, 'A bu kalmamıştı' diyorsa, mekanda ciro kaybı başlıyor demektir.</p><p>VogoPOS altyapısıyla iştah açıcı görsellerle donatılmış, saniyeler içerisinde güncellenebilen ve en önemlisi ödeme entegrasyonu sağlayan bir QR Menü sistemi, müşteri memnuniyetini tepeye taşır.</p>",
        category: "VogoPOS",
        date: "Eki 15, 2026",
        readTime: "3 dk",
        image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80",
        status: "published"
    },
    {
        title: "Sıfırdan Ölçeklenmeye: ROAS Nedir?",
        slug: "sifirdan-olceklenmeye-roas-nedir",
        excerpt: "Reklam yatırımlarınızın Getirisi (ROAS) nasıl doğru hesaplanır ve hedeflenir?",
        content: "<p>ROAS (Return on Ad Spend), bir reklama yatırdığınız her 1 TL'nin size kaç TL olarak geri döndüğünü gösterir.</p><h3>Örnek vaka:</h3><p>10.000 TL reklam harcaması yapıp 50.000 TL değerinde ürün satışı gerçekleştirdiyseniz, ROAS oranınız 5, yani %500'dür.</p><p>Performans pazarlaması ajanslarının en büyük farkı, ROAS metriklerini kârlılık sınırının (Breakeven ROAS) üzerinde tutarak ciroyu güvenle ölçekleyebilmeleridir.</p>",
        category: "Performans Reklamları",
        date: "Eki 10, 2026",
        readTime: "7 dk",
        image: "https://images.unsplash.com/photo-1533750349088-cd071a92ebf6?w=800&q=80",
        status: "published"
    }
];

async function seed() {
    for (const post of posts) {
        console.log(`Adding post: ${post.title}`);
        try {
            const res = await fetch('http://localhost:3000/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(post)
            });
            const data = await res.json();
            console.log('Result:', data);
        } catch(e) {
            console.error('Error adding post', e);
        }
    }
}

seed();
