# Assets Klasörü

Bu klasör, uygulamanın görsel içeriklerini (ikonlar, splash screen, vb.) içerir.

## Gerekli Dosyalar

Expo uygulaması çalıştırmak için aşağıdaki görseller gereklidir. Şu an için Expo default görselleri kullanılabilir.

### 1. icon.png
- **Boyut**: 1024x1024 px
- **Format**: PNG
- **Açıklama**: Uygulama ikonu

### 2. splash.png
- **Boyut**: 1242x2436 px (veya daha büyük)
- **Format**: PNG
- **Açıklama**: Açılış ekranı görseli

### 3. adaptive-icon.png
- **Boyut**: 1024x1024 px
- **Format**: PNG
- **Açıklama**: Android adaptive icon

### 4. favicon.png
- **Boyut**: 48x48 px
- **Format**: PNG
- **Açıklama**: Web favicon

### 5. notification-icon.png
- **Boyut**: 96x96 px
- **Format**: PNG
- **Açıklama**: Bildirim ikonu (Android)

## Tasarım Önerileri

### Renk Paleti
- **Primary**: #2196F3 (Mavi)
- **Secondary**: #4CAF50 (Yeşil)
- **Accent**: #FF9800 (Turuncu)
- **Background**: #F5F5F5 (Açık Gri)

### İkon Teması
- Kalp ve sağlık sembolleri
- Modern ve minimal tasarım
- Yaşlılar için görünür ve net

## Geçici Çözüm

Eğer özel görseller hazır değilse:

1. Expo default görselleri kullanabilirsiniz
2. Veya şu komutla placeholder görseller oluşturabilirsiniz:

```bash
expo install expo-asset
```

3. Online araçlar:
   - [App Icon Generator](https://www.appicon.co/)
   - [MakeAppIcon](https://makeappicon.com/)
   - [Expo Asset Tools](https://docs.expo.dev/guides/app-icons/)

## Not

Görseller hazırlandıktan sonra `app.json` dosyasındaki yolların doğru olduğundan emin olun.
