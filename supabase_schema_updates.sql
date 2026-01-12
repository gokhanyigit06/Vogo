-- 1. Clients Tablosu Güncellemesi (Cari Bakiye için)
ALTER TABLE clients ADD COLUMN IF NOT EXISTS total_revenue DECIMAL(10,2) DEFAULT 0;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS total_paid DECIMAL(10,2) DEFAULT 0;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS balance DECIMAL(10,2) DEFAULT 0;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS last_transaction_date TIMESTAMP;

-- 2. Income Tablosu Güncellemesi
ALTER TABLE income ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'paid'; 
ALTER TABLE income ADD COLUMN IF NOT EXISTS is_paid BOOLEAN DEFAULT true;

-- 3. Payables (Borçlar) Tablosu
CREATE TABLE IF NOT EXISTS payables (
    id BIGSERIAL PRIMARY KEY,
    vendor_name TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    due_date DATE,
    status TEXT DEFAULT 'pending',
    category TEXT,
    description TEXT,
    paid_date DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. Client Transactions (Cari Hareketler)
CREATE TABLE IF NOT EXISTS client_transactions (
    id BIGSERIAL PRIMARY KEY,
    client_id BIGINT REFERENCES clients(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    reference_id BIGINT,
    transaction_date TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 5. RLS Politikaları
ALTER TABLE payables ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON payables;
CREATE POLICY "Enable all access for authenticated users" ON payables FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE client_transactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON client_transactions;
CREATE POLICY "Enable all access for authenticated users" ON client_transactions FOR ALL USING (auth.role() = 'authenticated');

-- 6. Otomatik Müşteri Bakiyesi Hesaplama Fonksiyonu (KRİTİK GÜNCELLEME)
CREATE OR REPLACE FUNCTION update_client_revenue(target_client_id BIGINT)
RETURNS VOID AS $$
DECLARE
    total_rev DECIMAL(10,2);
    total_pd DECIMAL(10,2);
BEGIN
    -- Eğer client_id yoksa işlem yapma
    IF target_client_id IS NULL THEN
        RETURN;
    END IF;

    -- Toplam fatura edilen (Gelir tablosundaki her şey borç hanesidir)
    SELECT COALESCE(SUM(amount), 0) INTO total_rev
    FROM income
    WHERE client_id = target_client_id;

    -- Toplam tahsil edilen (status='paid' olanlar)
    SELECT COALESCE(SUM(amount), 0) INTO total_pd
    FROM income
    WHERE client_id = target_client_id
    AND (status = 'paid' OR is_paid = true);

    -- Müşteriyi güncelle
    UPDATE clients
    SET 
        total_revenue = total_rev,
        total_paid = total_pd,
        balance = total_rev - total_pd, -- Pozitif bakiye = Müşteri Borçlu
        last_transaction_date = NOW()
    WHERE id = target_client_id;
END;
$$ LANGUAGE plpgsql;

-- 7. Trigger (Gelir eklenince/silinince bakiyeyi otomatik güncelle)
CREATE OR REPLACE FUNCTION trigger_update_client_revenue()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'DELETE') THEN
        PERFORM update_client_revenue(OLD.client_id);
    ELSE
        PERFORM update_client_revenue(NEW.client_id);
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_income_change ON income;
CREATE TRIGGER on_income_change
AFTER INSERT OR UPDATE OR DELETE ON income
FOR EACH ROW EXECUTE FUNCTION trigger_update_client_revenue();
