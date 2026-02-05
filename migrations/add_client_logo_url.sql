-- Add logo_url column to clients table
ALTER TABLE public.clients 
ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- Add comment
COMMENT ON COLUMN public.clients.logo_url IS 'Client logo image URL';
