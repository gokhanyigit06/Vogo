#!/bin/sh
set -e

echo "Veritabani semasi guncelleniyor (prisma db push)..."
# Veritabanını şema ile eşitle (db push kullanıyoruz çünkü migration geçmişi yok)
npx prisma db push --accept-data-loss

echo "Uygulama baslatiliyor..."
# Next.js standalone sunucusunu başlat
node server.js
