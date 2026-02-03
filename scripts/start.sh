#!/bin/sh
set -e

echo "Veritabani sifirlaniyor ve yeniden olusturuluyor (prisma db push --force-reset)..."
# Veritabanını sil ve yeniden oluştur
npx prisma db push --force-reset --skip-generate

echo "Admin kullanicisi olusturuluyor (seeding)..."
node prisma/seed.js

echo "Uygulama baslatiliyor..."
# Next.js standalone sunucusunu başlat
node server.js
