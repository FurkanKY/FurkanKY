# Proje Genel Bakış - Project Overview

## Giyilebilir Sensör Tabanlı Akıllı Güvenlik Sistemi - Mobil Uygulama

### Proje Amacı

Bu mobil uygulama, YTÜ Biyomedikal Mühendisliği Bölümü tarafından önerilen "Giyilebilir Sensör Tabanlı Akıllı Güvenlik Sistemi" projesi kapsamında geliştirilmiştir. Yaşlı bireylerin güvenliğini sağlamak ve bakıcıların/ailelerin yaşlıları uzaktan izlemesini kolaylaştırmak için tasarlanmıştır.

### Temel İşlevler

#### 1. Gerçek Zamanlı Sağlık İzleme
- **Kalp Atış Hızı (Nabız)**: PPG sensörü ile sürekli kalp atış takibi
- **Hareket Tespiti**: İvmeölçer ve jiroskop ile aktivite izleme
- **Düşme Algılama**: Ani ivme değişiklikleri ve yer ile temas analizi
- **Hareketsizlik Kontrolü**: Uzun süreli hareketsizlik durumlarının tespiti

#### 2. Akıllı Uyarı Sistemi
- **Otomatik Tespit**: Anormal durumların otomatik algılanması
- **Bildirimler**: Push notification ile anlık uyarılar
- **Uyarı Seviyeleri**:
  - Kritik (düşme, manuel acil durum)
  - Yüksek (anormal nabız, uzun hareketsizlik)
  - Normal (bilgi amaçlı)

#### 3. Özelleştirilebilir Eşikler
Bakıcılar her kullanıcı için özel parametreler ayarlayabilir:
- Minimum/maksimum nabız değerleri
- Hareketsizlik süre limiti
- Düşme hassasiyeti
- Bildirim tercihleri

#### 4. Giyilebilir Cihaz Entegrasyonu
- Bluetooth Low Energy (BLE) bağlantısı
- Otomatik yeniden bağlanma
- Pil durumu takibi
- Bağlantı durumu göstergesi

### Teknik Mimari

```
┌─────────────────────────────────────────┐
│      Giyilebilir Cihaz (Bileklik)       │
│  - İvmeölçer + Jiroskop                 │
│  - PPG Kalp Atış Sensörü                │
│  - Manuel Acil Durum Butonu             │
│  - Bluetooth Modülü                     │
└──────────────┬──────────────────────────┘
               │ BLE
               ▼
┌─────────────────────────────────────────┐
│       Mobil Uygulama (React Native)     │
│                                         │
│  ┌────────────────────────────────┐    │
│  │    BluetoothService            │    │
│  │  - Cihaz tarama ve bağlantı    │    │
│  │  - Veri alma/gönderme          │    │
│  └──────────┬─────────────────────┘    │
│             ▼                           │
│  ┌────────────────────────────────┐    │
│  │    SensorDataService           │    │
│  │  - Veri işleme ve analiz       │    │
│  │  - Eşik kontrolü               │    │
│  │  - Durum tespiti               │    │
│  └──────────┬─────────────────────┘    │
│             ▼                           │
│  ┌────────────────────────────────┐    │
│  │   NotificationService          │    │
│  │  - Bildirim gönderme           │    │
│  │  - SMS/Arama entegrasyonu      │    │
│  └────────────────────────────────┘    │
│                                         │
│  ┌────────────────────────────────┐    │
│  │      UI Components             │    │
│  │  - DashboardScreen             │    │
│  │  - SettingsScreen              │    │
│  │  - AlertsScreen                │    │
│  └────────────────────────────────┘    │
└─────────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│    Bakıcı/Aile/Acil Servisler           │
│  - Gerçek zamanlı bildirimler           │
│  - SMS/Telefon araması                  │
│  - Konum bilgisi (bonus özellik)        │
└─────────────────────────────────────────┘
```

### Veri Akışı

1. **Veri Toplama**
   - Giyilebilir cihaz sensörlerden veri toplar (1 saniye aralıklarla)
   - Bluetooth ile mobil uygulamaya iletir

2. **Veri İşleme**
   - SensorDataService verileri analiz eder:
     - Kalp atış hızı normal aralıkta mı?
     - Düşme tespit edildi mi?
     - Kullanıcı ne kadar süredir hareketsiz?
     - Manuel buton basıldı mı?

3. **Karar Verme**
   - Eşik değerlerle karşılaştırma
   - Uyarı seviyesi belirleme
   - Gerekirse bildirim tetikleme

4. **Bildirim**
   - Kritik durumlar için anında bildirim
   - Uyarı geçmişine kayıt
   - Kullanıcı arayüzünde görselleştirme

### Tespit Senaryoları

#### Senaryo 1: Düşme Tespiti
```
Adımlar:
1. İvmeölçer ani yüksek ivme tespit eder (>2.5g)
2. Kısa süre sonra hareket durur (yere düşme)
3. 10 saniye boyunca hareketsizlik devam eder
4. Sistem "DÜŞME" uyarısı verir
5. Kritik bildirim gönderilir
```

#### Senaryo 2: Anormal Nabız
```
Adımlar:
1. PPG sensörü kalp atışını ölçer
2. Nabız 40'ın altına düşer veya 120'nin üzerine çıkar
3. Sistem "DÜŞÜK/YÜKSEK NABIZ" uyarısı verir
4. Yüksek öncelikli bildirim gönderilir
```

#### Senaryo 3: Uzun Hareketsizlik
```
Adımlar:
1. Son 30 dakikadır anlamlı hareket yok
2. İvmeölçer değerleri minimum seviyede
3. Sistem "HAREKETSİZLİK" uyarısı verir
4. Bildirim gönderilir (bayılma/felç olasılığı)
```

#### Senaryo 4: Manuel Acil Durum
```
Adımlar:
1. Kullanıcı acil durum butonuna basar
2. Bluetooth ile sinyal iletilir
3. Sistem "MANUEL ACİL DURUM" uyarısı verir
4. Anında kritik bildirim gönderilir
```

### Kullanıcı Profilleri

#### 1. Bakıcı/Aile Üyesi
**İhtiyaçlar**:
- Yaşlı bireyi gerçek zamanlı izleme
- Acil durumda anında bildirim alma
- Özelleştirilebilir eşik değerleri
- Geçmiş uyarıları inceleme

**Kullanım Akışı**:
1. Uygulamayı aç
2. Giyilebilir cihaza bağlan
3. Eşik değerlerini ayarla
4. İzlemeyi başlat
5. Uyarıları al ve müdahale et

#### 2. Sağlık Personeli
**İhtiyaçlar**:
- Tıbbi verilere erişim
- Trend analizi
- Uzun dönem kayıtlar

**Gelecek Özellikler**:
- Veri export (CSV/PDF)
- Grafik ve raporlar
- Çoklu hasta izleme

### Güvenlik ve Gizlilik

- **Veri Şifreleme**: Bluetooth bağlantısı şifreli
- **Yerel Depolama**: Veriler cihazda AsyncStorage ile güvenli saklanır
- **İzin Yönetimi**: Bluetooth ve bildirim izinleri kullanıcı kontrolünde
- **GDPR Uyumlu**: Kişisel sağlık verileri korunur

### Performans Optimizasyonları

1. **Düşük Enerji Tüketimi**
   - Bluetooth Low Energy (BLE) kullanımı
   - Sensör uyku modu
   - Optimize edilmiş veri toplama aralıkları

2. **Verimli Veri İşleme**
   - Client-side veri analizi
   - Minimal ağ kullanımı
   - Önbellekleme stratejileri

3. **Kullanıcı Deneyimi**
   - Hızlı başlangıç süresi
   - Akıcı animasyonlar
   - Responsive tasarım

### Test Senaryoları

#### Birim Testleri
- Sensör veri parsing
- Eşik kontrol fonksiyonları
- Düşme algılama algoritması

#### Entegrasyon Testleri
- Bluetooth bağlantı senaryoları
- Bildirim sistemi
- Veri akış testleri

#### Kullanıcı Testleri
- Farklı yaş gruplarıyla usability testi
- Gerçek düşme simülasyonları
- 24 saat süreklilik testi

### Gelecek Geliştirmeler

#### Faz 1 (Mevcut)
- ✅ Temel sağlık izleme
- ✅ Düşme tespiti
- ✅ Bildirim sistemi
- ✅ Eşik özelleştirme

#### Faz 2 (Planlanan)
- [ ] Yapay zeka destekli düşme tespiti
- [ ] GPS konum paylaşımı
- [ ] Sesli komut desteği
- [ ] Grafik ve trend analizi

#### Faz 3 (Gelecek)
- [ ] Bulut senkronizasyonu
- [ ] Çoklu kullanıcı desteği
- [ ] Sağlık platformu entegrasyonu
- [ ] Akıllı ev cihazları entegrasyonu

### Başarı Kriterleri

1. **Doğruluk**: %95+ düşme tespit başarısı
2. **Hız**: <2 saniye uyarı gecikme süresi
3. **Güvenilirlik**: %99+ uptime
4. **Kullanılabilirlik**: Yaşlılar ve bakıcılar tarafından kolayca kullanılabilir
5. **Pil Ömrü**: Giyilebilir cihaz 48+ saat çalışma

### Proje Ekibi Rolleri

- **Mobil Uygulama Geliştirici**: React Native app
- **Gömülü Sistem Mühendisi**: Giyilebilir cihaz firmware
- **Veri Bilimci**: ML tabanlı düşme tespiti algoritması
- **UI/UX Tasarımcı**: Kullanıcı arayüzü
- **Test Mühendisi**: Kalite güvence ve testler

### Kaynaklar ve Referanslar

- YTÜ Biyomedikal Mühendisliği Bölümü
- React Native Documentation
- Expo Platform
- Bluetooth Low Energy Specification
- WHO - Fall Prevention Guidelines

---

**Proje Sahibi**: Furkan Kadir Yılmaz
**Kurum**: Yıldız Teknik Üniversitesi
**Bölüm**: Elektronik ve Haberleşme Mühendisliği
**Tarih**: 2024
**Versiyon**: 1.0.0
