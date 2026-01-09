-- Partner Finance (Cari) Update
-- Expenses tablosuna 'paid_by' kolonu ekle
ALTER TABLE expenses 
ADD COLUMN IF NOT EXISTS paid_by UUID REFERENCES team_members(id) ON DELETE SET NULL;

-- Açıklama:
-- paid_by IS NULL -> Şirket Kasasından ödendi (Company Expense)
-- paid_by IS NOT NULL -> O kişi cebinden ödedi (Partner/Employee Expense)

-- Mevcut RLS politikasını güncelle (Create/Read izni zaten vardı, yeni kolon için ekstra işlem gerekmez ama kontrol edelim)
-- Expenses tablosunda zaten "Allow all" politikası var, bu yüzden sorun yok.
