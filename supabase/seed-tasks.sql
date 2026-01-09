-- Örnek Görevler
INSERT INTO tasks (title, description, status, priority, due_date) VALUES
('Logo İşbaşı Entegrasyonu', 'API dokümantasyonu incelenecek ve entegrasyon yapılacak.', 'todo', 'high', CURRENT_DATE + INTERVAL '2 days'),
('Web Sitesi Revizyonu', 'Ana sayfadaki slider görselleri güncellenecek.', 'in_progress', 'medium', CURRENT_DATE + INTERVAL '1 day'),
('Müşteri Toplantısı', 'Yeni proje için brief alınacak.', 'done', 'low', CURRENT_DATE - INTERVAL '1 day');
