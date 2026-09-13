CREATE TABLE IF NOT EXISTS price_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mandi TEXT NOT NULL,
    district TEXT,
    state TEXT,
    commodity TEXT NOT NULL,
    variety TEXT,
    grade TEXT,
    min_price NUMERIC NOT NULL,
    max_price NUMERIC NOT NULL,
    modal_price NUMERIC NOT NULL,
    date DATE NOT NULL,
    source TEXT DEFAULT 'Agmarknet OGD',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(mandi, commodity, variety, grade, date)
);

CREATE INDEX IF NOT EXISTS idx_price_history_mandi_commodity ON price_history(mandi, commodity, date);
