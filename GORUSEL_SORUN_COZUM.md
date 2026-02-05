# 🖼️ Kırık Görseller Sorunu - Çözüm Adımları

## Problem
Coolify'a geçtikten sonra yüklenen proje görselleri kırık görünüyor.

## Neden Oluyor?
Görseller `/uploads/images/` klasörüne kaydediliyor ancak Docker container yeniden başlatıldığında bu klasör sıfırlanıyor. Görsellerin kalıcı olması için **Persistent Volume** kullanmamız gerekiyor.

## ✅ Çözüm

### 1. Coolify'da Persistent Volume Ayarlayın

1. **Coolify Dashboard**'a gidin
2. Vogo uygulamanızı seçin
3. **Storage** veya **Volumes** sekmesine gidin
4. **Add Volume** butonuna tıklayın
5. Şu ayarları yapın:
   ```
   Source (Host Path):      /var/lib/coolify/volumes/vogo-uploads
   Destination (Container): /app/uploads
   ```
6. **Save** ve **Redeploy** yapın

### 2. Mevcut Görseller İçin

Eğer daha önce yüklenmiş görseller varsa ve bunlar kaybolmuşsa:

**Seçenek A: Yeniden Yükleyin**
- Admin panelden projeleri düzenleyip görselleri yeniden yükleyin

**Seçenek B: Eski Görselleri Kurtarın** (Eğer yedek varsa)
1. Coolify'da uygulamanın terminaline girin
2. Görselleri `/app/uploads/images/` klasörüne kopyalayın
3. Permissions düzeltin:
   ```bash
   chown -R nextjs:nodejs /app/uploads
   chmod -R 755 /app/uploads
   ```

### 3. Test Edin

1. Admin panelden yeni bir proje oluşturun
2. Görsel yükleyin
3. Container'ı yeniden başlatın: `docker restart <container-id>`
4. Görselin hala görünür olduğunu kontrol edin

## 🔍 Görsellerin Nerede Saklandığını Kontrol

```bash
# Container içinde
ls -la /app/uploads/images/

# Host makinesinde
ls -la /var/lib/coolify/volumes/vogo-uploads/images/
```

## ⚠️ Önemli Notlar

- Volume ayarı yapıldıktan sonra görseller kalıcı olacaktır
- `.gitignore` dosyası görselleri ignore ediyor (doğru davranış)
- Sadece klasör yapısı (`.gitkeep` dosyaları) Git'e commit ediliyor
- Yedekleme yaparken `/var/lib/coolify/volumes/vogo-uploads/` klasörünü de yedeklemeyi unutmayın

## 📝 Değişiklikler

Bu düzeltme ile yapılan değişiklikler:
- ✅ `uploads/images/` klasörü oluşturuldu
- ✅ `.gitkeep` dosyaları eklendi
- ✅ `.gitignore` güncellendi
- ✅ `Dockerfile` güncellendi (uploads klasörü oluşturuluyor)
- ✅ `COOLIFY_DEPLOY.md` güncellendi (volume talimatları eklendi)
