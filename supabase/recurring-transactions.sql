-- Recurring Transactions (Düzenli Ödemeler) için Update
-- Run this AFTER the main schema

-- Income tablosuna recurring kolonları ekle
ALTER TABLE income ADD COLUMN IF NOT EXISTS is_recurring BOOLEAN DEFAULT false;
ALTER TABLE income ADD COLUMN IF NOT EXISTS recurrence_frequency TEXT; -- monthly, yearly, quarterly
ALTER TABLE income ADD COLUMN IF NOT EXISTS recurrence_day INTEGER; -- Ayın hangi günü (1-31)
ALTER TABLE income ADD COLUMN IF NOT EXISTS recurrence_end_date DATE; -- Tekrarlamayı ne zaman durdur
ALTER TABLE income ADD COLUMN IF NOT EXISTS parent_recurring_id BIGINT; -- Hangi düzenli kaydın bir parçası

-- Expenses tablosuna recurring kolonları ekle
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS is_recurring BOOLEAN DEFAULT false;
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS recurrence_frequency TEXT; -- monthly, yearly, quarterly
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS recurrence_day INTEGER; -- Ayın hangi günü (1-31)
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS recurrence_end_date DATE; -- Tekrarlamayı ne zaman durdur
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS parent_recurring_id BIGINT; -- Hangi düzenli kaydın bir parçası

-- İndeks ekle (performans)
CREATE INDEX IF NOT EXISTS idx_income_is_recurring ON income(is_recurring);
CREATE INDEX IF NOT EXISTS idx_expenses_is_recurring ON expenses(is_recurring);
