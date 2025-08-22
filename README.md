# Discord Sunucu Patlatma Botu / Discord Server Nuking Bot

[![License: apo411](https://img.shields.io/badge/License-apo411-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-16.0+-green.svg)](https://nodejs.org/)
[![Discord.js](https://img.shields.io/badge/Discord.js-14.14.1+-blue.svg)](https://discord.js.org/)

## 🎯 Demo

```
  ____ ___ ____   ____ ___  ____  ____
 |  _ \_ _/ ___| / ___/ _ \|  _ \|  _ \
 | | | | |\___ \| |  | | | | |_) | | | |
 | |_| | | ___) | |__| |_| |  _ <| |_| |
 |____/___|____/ \____\___/|_| \_\____/

  ____   _  _____ _        _  _____ __  __    _
 |  _ \ / \|_   _| |      / \|_   _|  \/  |  / \
 | |_) / _ \ | | | |     / _ \ | | | |\/| | / _ \
 |  __/ ___ \| | | |___ / ___ \| | | |  | |/ ___ \
 |_| /_/   \_\_| |_____/_/   \_\_| |_|  |_/_/   \_

╔══════════════════════════════════════════════════════════════╗
║                    SUNUCU PATLATMA PANELİ                  ║
║                            411                             ║
╚══════════════════════════════════════════════════════════════╝

╔══════════════════════════════════════════════════════════════╗
║                        DİL SEÇİMİ                          ║
╚══════════════════════════════════════════════════════════════╝

? Dil seçin / Select Language: (Use arrow keys)
❯ 🇹🇷 Türkçe
   🇺🇸 English
```

---

## 🇹🇷 Türkçe

### 📋 Açıklama
Bu proje, Discord sunucularında test amaçlı kullanılmak üzere tasarlanmış bir "nuking" botudur. Bot, sunucu yöneticilerine sunucuyu yeniden yapılandırma imkanı sağlar.

### ⚠️ Uyarı
**Bu bot sadece test amaçlı kullanılmalıdır!** Gerçek sunucularda kullanım Discord ToS'a aykırı olabilir ve hesabınızın kapatılmasına neden olabilir.

### 🚀 Özellikler
- **Çok Dilli Panel**: Türkçe ve İngilizce dil desteği
- **Bot Türü Seçimi**: Self Bot veya Normal Bot seçenekleri
- **Kanal Yönetimi**: Kanalları silme ve yeniden oluşturma
- **Rol Yönetimi**: Rolleri silme ve yeniden oluşturma
- **Toplu Mesaj**: Tüm kanallara paralel mesaj gönderimi
- **Üye Yönetimi**: Toplu ban ve DM gönderimi
- **Panel Üzerinden İşlemler**: Bot'u başlatmadan Discord komutlarını çalıştırma
- **Güvenlik**: Sadece yetkili kullanıcılar komutları kullanabilir

### 📥 Kurulum

#### Gereksinimler
- Node.js 16.0 veya üzeri
- npm veya yarn

#### Adımlar
1. Projeyi klonlayın:
```bash
git clone <repository-url>
cd patlatma_v2
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Panel'i başlatın:
```bash
npm run panel
```

### 🎮 Kullanım

### 📱 Panel Görünümü

```
  ____ ___ ____   ____ ___  ____  ____
 |  _ \_ _/ ___| / ___/ _ \|  _ \|  _ \
 | | | | |\___ \| |  | | | | |_) | | | |
 | |_| | | ___) | |__| |_| |  _ <| |_| |
 |____/___|____/ \____\___/|_| \_\____/

  ____   _  _____ _        _  _____ __  __    _
 |  _ \ / \|_   _| |      / \|_   _|  \/  |  / \
 | |_) / _ \ | | | |     / _ \ | | | |\/| | / _ \
 |  __/ ___ \| | | |___ / ___ \| | | |  | |/ ___ \
 |_| /_/   \_\_| |_____/_/   \_\_| |_|  |_/_/   \_

╔══════════════════════════════════════════════════════════════╗
║                    SUNUCU PATLATMA PANELİ                  ║
║                            411                             ║
╚══════════════════════════════════════════════════════════════╝

╔══════════════════════════════════════════════════════════════╗
║                           ANA MENÜ                          ║
╠══════════════════════════════════════════════════════════════╣
║  1. Bot Türü Seçimi                                        ║
║  2. Bot Konfigürasyonu                                     ║
║  3. Tüm Ayarlar                                             ║
║  4. Ayarları Görüntüle                                     ║
║  5. Sunucu İşlemleri                                       ║
║  6. Bot'u Başlat                                           ║
║  7. Çıkış                                                   ║
╚══════════════════════════════════════════════════════════════╝

? Seçiminizi yapın: (Use arrow keys)
❯ 1. Bot Türü Seçimi
  2. Bot Konfigürasyonu
  3. Kanal Ayarları
  4. Rol Ayarları
  5. Mesaj Ayarları
  6. DM Mesaj Ayarları
  7. Ayarları Görüntüle
```

#### Panel Komutları
1. **Dil Seçimi**: Türkçe veya İngilizce seçin
2. **Bot Türü**: Self Bot veya Normal Bot seçin
3. **Tüm Ayarlar**: Kanal, rol, mesaj ve DM ayarlarını tek yerden düzenleyin
4. **Ayarları Görüntüle**: Mevcut tüm ayarları görüntüleyin
5. **Sunucu İşlemleri**: Discord komutlarını panel üzerinden çalıştırın
6. **Bot Başlatma**: Bot'u başlatın

#### Discord Komutları
- `!kanal` - Tüm kanalları sil ve yenilerini oluştur (20'şer tane)
- `!rol` - Tüm rolleri sil ve yenilerini oluştur (20'şer tane)
- `!mesaj` - Tüm kanallara mesaj gönder (20'şer tane)
- `!ban` - Tüm üyeleri banla
- `!dm` - Tüm üyelere DM gönder

### 🔧 Konfigürasyon
Bot ayarları `panel_settings.json` dosyasında saklanır:
- `channels`: Oluşturulacak kanal isimleri
- `roles`: Oluşturulacak rol isimleri
- `message`: Gönderilecek mesaj
- `dmMessage`: DM olarak gönderilecek mesaj
- `guildId`: Hedef sunucu ID'si
- `token`: Bot token'ı
- `botType`: Bot türü (self/bot)
- `authorizedUsers`: Komutları kullanabilecek kullanıcı ID'leri

---

## 🇺🇸 English

### 📋 Description
This project is a Discord "nuking" bot designed for testing purposes on Discord servers. The bot provides server administrators with the ability to reconfigure their servers.

### ⚠️ Warning
**This bot should only be used for testing purposes!** Using it on real servers may violate Discord ToS and could result in your account being banned.

### 🚀 Features
- **Multi-language Panel**: Turkish and English language support
- **Bot Type Selection**: Self Bot or Normal Bot options
- **Channel Management**: Delete and recreate channels
- **Role Management**: Delete and recreate roles
- **Bulk Messaging**: Parallel message sending to all channels
- **Member Management**: Bulk banning and DM sending
- **Direct Panel Operations**: Execute Discord commands without starting the bot
- **Security**: Only authorized users can use commands

### 📥 Installation

#### Requirements
- Node.js 16.0 or higher
- npm or yarn

#### Steps
1. Clone the project:
```bash
git clone <repository-url>
cd patlatma_v2
```

2. Install dependencies:
```bash
npm install
```

3. Start the panel:
```bash
npm run panel
```

### 🎮 Usage

### 📱 Panel Interface

```
  ____ ___ ____   ____ ___  ____  ____
 |  _ \_ _/ ___| / ___/ _ \|  _ \|  _ \
 | | | | |\___ \| |  | | | | |_) | | | |
 | |_| | | ___) | |__| |_| |  _ <| |_| |
 |____/___|____/ \____\___/|_| \_\____/

  ____   _  _____ _        _  _____ __  __    _
 |  _ \ / \|_   _| |      / \|_   _|  \/  |  / \
 | |_) / _ \ | | | |     / _ \ | | | |\/| | / _ \
 |  __/ ___ \| | | |___ / ___ \| | | |  | |/ ___ \
 |_| /_/   \_\_| |_____/_/   \_\_| |_|  |_/_/   \_

╔══════════════════════════════════════════════════════════════╗
║                   DISCORD SERVER NUKING PANEL              ║
║                            411                             ║
╚══════════════════════════════════════════════════════════════╝

╔══════════════════════════════════════════════════════════════╗
║                          MAIN MENU                          ║
╠══════════════════════════════════════════════════════════════╣
║  1. Bot Type Selection                                     ║
║  2. Bot Configuration                                      ║
║  3. All Settings                                           ║
║  4. View Settings                                          ║
║  5. Server Operations                                      ║
║  6. Start Bot                                              ║
║  7. Exit                                                   ║
╚══════════════════════════════════════════════════════════════╝

? Make your selection: (Use arrow keys)
❯ 1. Bot Type Selection
  2. Bot Configuration
  3. Channel Settings
  4. Role Settings
  5. Message Settings
  6. DM Message Settings
  7. View Settings
```

#### Panel Commands
1. **Language Selection**: Choose Turkish or English
2. **Bot Type**: Select Self Bot or Normal Bot
3. **All Settings**: Edit channel, role, message and DM settings from one place
4. **View Settings**: View all current settings
5. **Server Operations**: Execute Discord commands directly from panel
6. **Bot Startup**: Start the bot

#### Discord Commands
- `!kanal` - Delete all channels and create new ones (20 each)
- `!rol` - Delete all roles and create new ones (20 each)
- `!mesaj` - Send message to all channels (20 each)
- `!ban` - Ban all members
- `!dm` - Send DM to all members

### 🔧 Configuration
Bot settings are stored in `panel_settings.json`:
- `channels`: Channel names to create
- `roles`: Role names to create
- `message`: Message to send
- `dmMessage`: Message to send via DM
- `guildId`: Target server ID
- `token`: Bot token
- `botType`: Bot type (self/bot)
- `authorizedUsers`: User IDs who can use commands

---

## 📁 Proje Yapısı / Project Structure

```
patlatma_v2/
├── bot.js              # Ana bot dosyası / Main bot file
├── panel.js            # CMD panel / CMD panel
├── config.js           # Varsayılan ayarlar / Default settings
├── panel_settings.json # Panel ayarları / Panel settings
├── package.json        # Proje bağımlılıkları / Project dependencies
├── README.md           # Bu dosya / This file
└── LICENSE             # apo411 lisansı / apo411 license
```

## 🚀 Scripts

```bash
npm start      # Bot'u başlat / Start bot
npm run panel  # Panel'i başlat / Start panel
npm run dev    # Geliştirme modu / Development mode
```

## 🔒 Güvenlik / Security

- Sadece yetkili kullanıcılar komutları kullanabilir
- Bot token'ları güvenli şekilde saklanır
- Self Bot kullanımı risklidir ve Discord ToS'a aykırı olabilir

- Only authorized users can use commands
- Bot tokens are stored securely
- Self Bot usage is risky and may violate Discord ToS

## 📝 Lisans / License

Bu proje [apo411 lisansı](LICENSE) altında lisanslanmıştır.

This project is licensed under the [apo411 license](LICENSE).

---

## 🤝 Katkıda Bulunma / Contributing

1. Projeyi fork edin / Fork the project
2. Feature branch oluşturun / Create a feature branch
3. Değişikliklerinizi commit edin / Commit your changes
4. Branch'inizi push edin / Push to the branch
5. Pull Request oluşturun / Create a Pull Request

## 📞 İletişim / Contact

- **Proje**: Discord Sunucu Patlatma Botu
- **Lisans**: apo411
- **Amaç**: Test amaçlı / For testing purposes

---

## 📸 Screenshots

### 🎮 Panel Interface
```
  ____ ___ ____   ____ ___  ____  ____
 |  _ \_ _/ ___| / ___/ _ \|  _ \|  _ \
 | | | | |\___ \| |  | | | | |_) | | | |
 | |_| | | ___) | |__| |_| |  _ <| |_| |
 |____/___|____/ \____\___/|_| \_\____/

  ____   _  _____ _        _  _____ __  __    _
 |  _ \ / \|_   _| |      / \|_   _|  \/  |  / \
 | |_) / _ \ | | | |     / _ \ | | | |\/| | / _ \
 |  __/ ___ \| | | |___ / ___ \| | | |  | |/ ___ \
 |_| /_/   \_\_| |_____/_/   \_\_| |_|  |_/_/   \_

╔══════════════════════════════════════════════════════════════╗
║                    SUNUCU PATLATMA PANELİ                  ║
║                            411                             ║
╚══════════════════════════════════════════════════════════════╝

╔══════════════════════════════════════════════════════════════╗
║                        DİL SEÇİMİ                          ║
╚══════════════════════════════════════════════════════════════╝

? Dil seçin / Select Language: (Use arrow keys)
❯ 🇹🇷 Türkçe
   🇺🇸 English
```

### 📋 Main Menu
```
╔══════════════════════════════════════════════════════════════╗
║                          MAIN MENU                          ║
╠══════════════════════════════════════════════════════════════╣
║  1. Bot Type Selection                                     ║
║  2. Bot Configuration                                      ║
║  3. Channel Settings                                       ║
║  4. Role Settings                                          ║
║  5. Message Settings                                       ║
║  6. DM Message Settings                                    ║
║  7. View Settings                                          ║
║  8. Start Bot                                              ║
║  9. Exit                                                   ║
╚══════════════════════════════════════════════════════════════╝

? Make your selection: (Use arrow keys)
❯ 1. Bot Type Selection
  2. Bot Configuration
  3. Channel Settings
  4. Role Settings
  5. Message Settings
  6. DM Message Settings
  7. View Settings
```

---

<div align="center">
  <p><strong>⚠️ Sadece test amaçlı kullanın! / Use only for testing purposes! ⚠️</strong></p>
  <p><em>apo411 lisansı altında / Under apo411 license</em></p>
</div>
