# Kurulum Rehberi - Setup Guide

Bu dosya, mobil uygulamayı sıfırdan kurmak için detaylı adımları içerir.

## 1. Sistem Gereksinimleri

### Windows
- Windows 10 veya üzeri
- Node.js v14+ ([İndir](https://nodejs.org/))
- Git ([İndir](https://git-scm.com/))
- Android Studio (Android geliştirme için)

### macOS
- macOS 10.15 veya üzeri
- Node.js v14+ ([İndir](https://nodejs.org/))
- Git (genellikle önceden yüklü)
- Xcode (iOS geliştirme için)
- Android Studio (Android geliştirme için)

### Linux
- Ubuntu 18.04+ veya eşdeğeri
- Node.js v14+ (`sudo apt install nodejs npm`)
- Git (`sudo apt install git`)
- Android Studio (Android geliştirme için)

## 2. Node.js ve npm Kurulumu

### Node.js Kurulum Kontrolü
```bash
node --version
npm --version
```

Eğer yüklü değilse:
- [Node.js resmi sitesinden](https://nodejs.org/) LTS versiyonunu indirin
- Kurulumu tamamlayın
- Terminal/Command Prompt'u yeniden başlatın

## 3. Expo CLI Kurulumu

```bash
npm install -g expo-cli
```

Kurulum kontrolü:
```bash
expo --version
```

## 4. Proje Kurulumu

### Adım 1: Projeyi İndirin
```bash
git clone <repository-url>
cd health-monitor-app
```

### Adım 2: Bağımlılıkları Yükleyin
```bash
npm install
```

veya yarn kullanıyorsanız:
```bash
yarn install
```

**Not**: Bu işlem birkaç dakika sürebilir.

### Adım 3: Kurulum Hatalarını Kontrol Edin
Eğer hata alırsanız:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 5. Expo Go Uygulamasını İndirin

### Android
- Google Play Store'dan "Expo Go" uygulamasını indirin
- [Direkt Link](https://play.google.com/store/apps/details?id=host.exp.exponent)

### iOS
- App Store'dan "Expo Go" uygulamasını indirin
- [Direkt Link](https://apps.apple.com/app/expo-go/id982107779)

## 6. Uygulamayı Çalıştırma

### Geliştirme Sunucusunu Başlatın
```bash
npm start
```

veya

```bash
expo start
```

Terminal'de bir QR kod ve menü görünecektir.

### Telefonda Test Etme

#### Android
1. Telefon ve bilgisayarınız aynı WiFi ağında olmalı
2. Expo Go uygulamasını açın
3. "Scan QR Code" seçeneğine tıklayın
4. Terminal'deki QR kodu tarayın

#### iOS
1. Telefon ve bilgisayarınız aynı WiFi ağında olmalı
2. iPhone Kamera uygulamasıyla QR kodu tarayın
3. "Expo Go ile Aç" bildirimine tıklayın

### Emülatörde Test Etme

#### Android Emülatör
1. Android Studio'yu açın
2. AVD Manager'dan bir emülatör oluşturun
3. Emülatörü başlatın
4. Terminal'de `a` tuşuna basın

#### iOS Simulator (Sadece macOS)
1. Xcode'u yükleyin
2. Terminal'de `i` tuşuna basın

## 7. Uygulama Özellikleri

### İlk Çalıştırma
Uygulama açıldığında:
1. Bildirim izni isteyecektir → **İzin Verin**
2. Ana sayfa görünecektir
3. "İzlemeyi Başlat" butonuna tıklayın

### Test Senaryoları

#### 1. Normal İzleme
- Ana sayfada "İzlemeyi Başlat" butonuna tıklayın
- Sağlık kartlarında değerlerin değiştiğini gözlemleyin
- Tüm değerler normal aralıktaysa yeşil rozet görünür

#### 2. Yüksek Nabız Uyarısı
- Uygulama otomatik olarak rastgele yüksek nabız simüle edebilir (%5 olasılık)
- Nabız 120'nin üzerine çıkarsa:
  - Kalp atış hızı kartı kırmızı olur
  - Aktif uyarılar bölümünde mesaj görünür
  - Bildirim gelir

#### 3. Düşme Tespiti
- Uygulama otomatik olarak düşme simüle edebilir (%1 olasılık)
- Düşme tespit edildiğinde:
  - Hareket sensörü kartı kırmızı olur
  - Kritik uyarı görünür
  - Acil bildirim gönderilir

#### 4. Ayarları Değiştirme
1. Alt menüden "Ayarlar" sekmesine gidin
2. Herhangi bir eşik değerini değiştirin
3. "Ayarları Kaydet" butonuna tıklayın
4. Ana sayfaya dönün - yeni eşikler uygulanmıştır

#### 5. Uyarı Geçmişi
1. "Uyarılar" sekmesine gidin
2. Geçmiş uyarıları görüntüleyin
3. Filtreleri kullanarak arama yapın
4. Uyarıları silebilirsiniz

## 8. Sorun Giderme

### "Metro Bundler" hatası
```bash
npm start -- --reset-cache
```

### Expo Go bağlanamıyor
1. Telefon ve bilgisayar aynı ağda mı kontrol edin
2. Güvenlik duvarı Expo'yu engelliyor olabilir
3. Tunnel modunu deneyin:
```bash
expo start --tunnel
```

### npm install hataları
```bash
npm install --legacy-peer-deps
```

### Port zaten kullanımda hatası
```bash
npx kill-port 19000 19001 19002
npm start
```

### iOS Simulator açılmıyor (macOS)
```bash
sudo xcode-select --switch /Applications/Xcode.app
```

## 9. Build Alma (İsteğe Bağlı)

### Android APK
```bash
expo build:android -t apk
```

### iOS IPA (macOS + Apple Developer hesabı gerekli)
```bash
expo build:ios
```

## 10. Yardım ve Kaynaklar

- [Expo Dokümantasyonu](https://docs.expo.dev/)
- [React Native Dokümantasyonu](https://reactnative.dev/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [React Navigation](https://reactnavigation.org/)

## Başarılı Kurulum Kontrol Listesi

- [ ] Node.js ve npm kurulu
- [ ] Expo CLI kurulu
- [ ] Proje klonlandı
- [ ] npm install çalıştırıldı
- [ ] Expo Go telefona indirildi
- [ ] `npm start` çalıştı
- [ ] Uygulama telefonda açıldı
- [ ] Bildirim izni verildi
- [ ] İzleme başlatıldı
- [ ] Kartlarda veri görünüyor

Tüm adımlar tamamlandıysa uygulama kullanıma hazır!

## İletişim

Sorun yaşıyorsanız:
- GitHub Issues'da sorun açın
- Furkan Kadir Yılmaz ile iletişime geçin
