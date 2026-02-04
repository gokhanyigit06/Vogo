#!/bin/sh
set -e

echo "Veritabani senkronize ediliyor (prisma db push)..."
# Veritabanı şemasını güvenli şekilde güncelle (veri silmeden)
npx prisma db push --skip-generate

echo "Admin kullanicisi olusturuluyor (seeding)..."
node prisma/seed.js

echo "Uygulama baslatiliyor..."
# Next.js standalone sunucusunu başlat
node server.js
