
export const MOCK_TASKS = [
    {
        id: 9901,
        title: "Ana Sayfa Tasarım Revizyonu",
        description: "Ana sayfadaki hero alanının mobil uyumluluğu ve modernizasyonu. Renk paletinin güncellenmesi.",
        status: "todo",
        priority: "high",
        due_date: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 gün sonra
        assigned_to: 101,
        project_id: 201,
        checklists: [
            { id: 1, text: "Rakip analizi yapılması", checked: true },
            { id: 2, text: "Wireframe çizimi", checked: false },
            { id: 3, text: "Mobil görünüm onayı", checked: false }
        ],
        team_members: { name: "Ahmet Yılmaz" },
        projects: { name: "Vogo Kurumsal Web" }
    },
    {
        id: 9902,
        title: "Blog Modülü Entegrasyonu",
        description: "CMS üzerinden blog yazılarının çekilmesi ve listelenmesi.",
        status: "in_progress",
        priority: "medium",
        due_date: new Date(Date.now() + 86400000 * 5).toISOString(),
        assigned_to: 102,
        project_id: 201,
        checklists: [],
        team_members: { name: "Zeynep Kaya" },
        projects: { name: "Vogo Kurumsal Web" }
    },
    {
        id: 9903,
        title: "Müşteri Logoları Hazırlığı",
        description: "Referanslar sayfası için logoların svg formatına çevrilmesi.",
        status: "done",
        priority: "low",
        due_date: new Date(Date.now() - 86400000).toISOString(),
        assigned_to: 101,
        project_id: 202,
        checklists: [
            { id: 1, text: "Logoların toplanması", checked: true },
            { id: 2, text: "SVG convert işlemi", checked: true }
        ],
        team_members: { name: "Ahmet Yılmaz" },
        projects: { name: "E-Ticaret Projesi" }
    },
    {
        id: 9904,
        title: "SEO Optimizasyonu",
        description: "Meta taglerin güncellenmesi ve sitemap oluşturulması.",
        status: "todo",
        priority: "high",
        due_date: new Date(Date.now() + 86400000 * 10).toISOString(),
        assigned_to: 103,
        project_id: 202,
        team_members: { name: "Mehmet Demir" },
        projects: { name: "E-Ticaret Projesi" }
    },
    {
        id: 9905,
        title: "Sunucu Bakımı",
        description: "Aylık rutin sunucu kontrolleri ve güncelleme.",
        status: "in_progress",
        priority: "medium",
        due_date: new Date(Date.now() + 86400000).toISOString(),
        assigned_to: 102,
        team_members: { name: "Zeynep Kaya" },
        projects: { name: "İç Sistemler" }
    }
]


export const MOCK_PROJECTS = [
    {
        id: 201,
        title: "Vogo Kurumsal Web",
        description: "Şirketin ana web sitesinin yenilenmesi projesi.",
        status: "in_progress",
        budget: 150000,
        start_date: "2024-01-01",
        end_date: "2024-03-01",
        progress: 65,
        client: "Vogo Tech",
        client_id: 301,
        clients: { company: "Vogo Tech", name: "Volkan G." }
    },
    {
        id: 202,
        title: "E-Ticaret Projesi",
        description: "Yeni bir e-ticaret platformunun sıfırdan geliştirilmesi.",
        status: "planning",
        budget: 450000,
        start_date: "2024-02-15",
        end_date: "2024-08-30",
        progress: 10,
        client: "Global Market A.Ş.",
        client_id: 302,
        clients: { company: "Global Market A.Ş.", name: "Ayşe Y." }
    },
    {
        id: 203,
        title: "Mobil Uygulama",
        description: "Mevcut web uygulamasının mobil versiyonu.",
        status: "completed",
        budget: 200000,
        start_date: "2023-09-01",
        end_date: "2023-12-31",
        progress: 100,
        client: "StartApp Inc.",
        client_id: 303,
        clients: { company: "StartApp Inc.", name: "John Doe" }
    }
]

export const MOCK_TEAM = [
    { id: 101, name: "Ahmet Yılmaz", role: "Frontend Dev", active: true },
    { id: 102, name: "Zeynep Kaya", role: "Backend Dev", active: true },
    { id: 103, name: "Mehmet Demir", role: "Designer", active: true }
]

export const MOCK_CLIENTS = [
    {
        id: 301,
        company: "Vogo Tech",
        name: "Volkan G.",
        email: "volkan@vogo.tech",
        phone: "0555 111 22 33",
        status: "active",
        total_projects: 1,
        total_budget: 150000
    },
    {
        id: 302,
        company: "Global Market A.Ş.",
        name: "Ayşe Y.",
        email: "ayse@global.com",
        phone: "0532 999 88 77",
        status: "active",
        total_projects: 1,
        total_budget: 450000
    },
    {
        id: 303,
        company: "StartApp Inc.",
        name: "John Doe",
        email: "john@startapp.io",
        phone: "+1 555 000 11",
        status: "inactive",
        total_projects: 1,
        total_budget: 200000
    }
]
