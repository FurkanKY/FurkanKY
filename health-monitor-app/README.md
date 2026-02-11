# Yaşlı Sağlık İzleme Mobil Uygulaması

Giyilebilir sensör tabanlı akıllı güvenlik sistemi için mobil uygulama. Bu uygulama, yaşlı bireylerin sağlık durumunu gerçek zamanlı izler ve acil durumlarda bakıcılara bildirim gönderir.

## Proje Hakkında

Bu proje, Biyomedikal Mühendisliği Bölümü için geliştirilmiş bir akıllı sağlık izleme sistemidir. Giyilebilir cihazlardan (bileklik/kol bandı) alınan sensör verilerini işleyerek aşağıdaki durumları tespit eder:

- **Düşme Tespiti**: İvmeölçer ve jiroskop verileriyle ani düşmeleri algılar
- **Hareketsizlik Kontrolü**: Uzun süreli hareketsizlik durumlarını tespit eder
- **Nabız Takibi**: Kalp atış hızını izler ve anormal değerlerde uyarı verir
- **Manuel Acil Durum**: Kullanıcı acil durum butonuna basarak yardım çağırabilir

## Özellikler

### 1. Gerçek Zamanlı İzleme
- Kalp atış hızı takibi (PPG sensörü)
- Hareket sensörü verileri (ivmeölçer + jiroskop)
- Aktivite durumu göstergesi
- Anlık durum rozetleri

### 2. Özelleştirilebilir Eşik Değerleri
Bakıcılar aşağıdaki parametreleri ayarlayabilir:
- Minimum/maksimum nabız değerleri
- Hareketsizlik süresi eşiği
- Düşme tespiti hassasiyeti
- Düşme sonrası hareketsizlik süresi

### 3. Uyarı Sistemi
- Gerçek zamanlı bildirimler
- SMS/anlık bildirim/çağrı desteği (hazır)
- Uyarı geçmişi ve filtreleme
- Öncelik bazlı uyarı seviyeleri (kritik, yüksek, normal)

### 4. Bluetooth Bağlantısı
- Giyilebilir cihaz bağlantısı (mock implementasyon)
- Bağlantı durumu göstergesi
- Pil seviyesi takibi (hazır)

## Teknolojiler

- **React Native** - Cross-platform mobil uygulama geliştirme
- **Expo** - Geliştirme ve build platformu
- **React Native Paper** - Material Design UI bileşenleri
- **React Navigation** - Navigasyon yönetimi
- **Expo Notifications** - Push bildirimleri
- **AsyncStorage** - Yerel veri saklama
- **React Native BLE Manager** - Bluetooth bağlantısı (hazır)

## Kurulum

### Gereksinimler
- Node.js (v14 veya üzeri)
- npm veya yarn
- Expo CLI
- Android Studio (Android geliştirme için) veya Xcode (iOS geliştirme için)
- Expo Go uygulaması (telefonda test için)

### Adımlar

1. **Projeyi klonlayın:**
```bash
git clone <repository-url>
cd health-monitor-app
```

2. **Bağımlılıkları yükleyin:**
```bash
npm install
# veya
yarn install
```

3. **Expo CLI'yi global olarak yükleyin (yüklü değilse):**
```bash
npm install -g expo-cli
```

4. **Uygulamayı başlatın:**
```bash
npm start
# veya
expo start
```

5. **Uygulamayı çalıştırın:**
   - **Android**: `a` tuşuna basın veya telefonunuzdaki Expo Go uygulamasıyla QR kodu tarayın
   - **iOS**: `i` tuşuna basın veya telefonunuzdaki Expo Go uygulamasıyla QR kodu tarayın
   - **Web**: `w` tuşuna basın (sınırlı özellikler)

## Kullanım

### Ana Sayfa (Dashboard)
1. **İzlemeyi Başlatın**: "İzlemeyi Başlat" butonuna tıklayın
2. **Gerçek Zamanlı Veri**: Kalp atış hızı, hareket sensörü ve aktivite durumu kartlarını görüntüleyin
3. **Uyarılar**: Anormal durumlar tespit edildiğinde aktif uyarılar bölümünde görüntülenir
4. **Bluetooth**: "Bağlan" butonu ile giyilebilir cihazı bağlayabilirsiniz (şu an mock veri)

### Ayarlar
1. **Kalp Atış Hızı Eşikleri**: Minimum ve maksimum nabız değerlerini ayarlayın
2. **Hareketsizlik Tespiti**: Hareketsizlik için bekleme süresini belirleyin
3. **Düşme Tespiti**: İvme eşiği ve düşme sonrası hareketsizlik süresini ayarlayın
4. **Bildirimler**: Bildirim ve ses ayarlarını yapılandırın
5. **Kaydet**: Değişiklikleri kaydetmeyi unutmayın!

### Uyarılar
- Tüm geçmiş uyarıları görüntüleyin
- Uyarı tipine göre filtreleyin
- Arama yaparak belirli uyarıları bulun
- İstediğiniz uyarıyı silmek için X butonuna tıklayın

## Proje Yapısı

```
health-monitor-app/
├── App.js                      # Ana uygulama giriş noktası
├── app.json                    # Expo yapılandırması
├── package.json                # Bağımlılıklar
├── babel.config.js             # Babel yapılandırması
└── src/
    ├── components/             # Yeniden kullanılabilir UI bileşenleri
    │   ├── AlertCard.js       # Uyarı kartı
    │   ├── HealthCard.js      # Sağlık verisi kartı
    │   ├── StatusBadge.js     # Durum rozeti
    │   └── ThresholdSlider.js # Eşik ayarlama slider'ı
    ├── navigation/             # Navigasyon yapılandırması
    │   └── AppNavigator.js    # Bottom tab navigator
    ├── screens/                # Ana ekranlar
    │   ├── DashboardScreen.js # Gösterge paneli
    │   ├── SettingsScreen.js  # Ayarlar ekranı
    │   └── AlertsScreen.js    # Uyarı geçmişi
    ├── services/               # İş mantığı servisleri
    │   ├── SensorDataService.js      # Sensör veri işleme
    │   ├── BluetoothService.js       # Bluetooth bağlantısı
    │   └── NotificationService.js    # Bildirim yönetimi
    └── utils/                  # Yardımcı fonksiyonlar
        ├── constants.js        # Sabit değerler
        └── helpers.js          # Yardımcı fonksiyonlar
```

## Veri Akışı

1. **Sensör Verisi Toplama**:
   - Giyilebilir cihaz → Bluetooth → BluetoothService
   - Mock veri: SensorDataService otomatik veri üretir

2. **Veri İşleme**:
   - SensorDataService sensör verilerini analiz eder
   - Eşik değerlerle karşılaştırma yapar
   - Uyarı durumlarını belirler

3. **Bildirimler**:
   - Kritik uyarılar tespit edildiğinde
   - NotificationService bildirimleri gönderir
   - AlertsScreen'de geçmiş kaydedilir

4. **Ayarlar**:
   - SettingsScreen'den eşik değerleri güncellenir
   - AsyncStorage'da saklanır
   - SensorDataService'e uygulanır

## Geliştirme Notları

### Mock Veri
Uygulama şu anda mock (simüle edilmiş) sensör verisi kullanmaktadır. Gerçek giyilebilir cihaz bağlandığında:

1. `src/services/BluetoothService.js` dosyasını güncelleyin
2. `react-native-ble-manager` kütüphanesini kullanarak gerçek BLE bağlantısı ekleyin
3. Cihazdan gelen verileri parse edin
4. `SensorDataService.js`'deki `generateMockData()` fonksiyonunu gerçek verilerle değiştirin

### Bildirim İzinleri
İlk çalıştırmada uygulama bildirim izni isteyecektir. İzin verilmezse uyarılar sadece uygulama içinde görüntülenir.

### Platform-Specific Notlar

**Android:**
- Bluetooth izinleri app.json'da tanımlıdır
- Konum izni Bluetooth taraması için gereklidir
- Bildirimler için kanal yapılandırması otomatik oluşturulur

**iOS:**
- Info.plist'e Bluetooth kullanım açıklaması eklenmelidir
- Bildirim izinleri runtime'da istenir
- Background modes ayarları gerekebilir

## Build ve Deployment

### Android APK Oluşturma
```bash
expo build:android
```

### iOS IPA Oluşturma
```bash
expo build:ios
```

### Expo Updates ile OTA Güncelleme
```bash
expo publish
```

## Bonus Özellikler (Gelecek Güncellemeler)

- [ ] Yapay zeka destekli düşme tespiti
- [ ] GPS entegrasyonu ile konum paylaşımı
- [ ] Sesli komut desteği ("Yardım et")
- [ ] Grafik ve trend analizi
- [ ] Çoklu kullanıcı desteği
- [ ] Bulut senkronizasyonu
- [ ] Doktor/hastane bilgi paylaşımı

## Lisans

Bu proje Yıldız Teknik Üniversitesi Biyomedikal Mühendisliği bölümü için geliştirilmiştir.

## İletişim

Furkan Kadir Yılmaz
- LinkedIn: [Furkan Kadir Yılmaz](https://www.linkedin.com/in/furkan-kadir-yilmaz/)
- GitHub: [@FurkanKY](https://github.com/FurkanKY)

## Teşekkürler

YTÜ Biyomedikal Mühendisliği Bölümü'ne proje konusu önerisi için teşekkürler.
