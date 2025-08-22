const inquirer = require('inquirer').default;
const chalk = require('chalk');
const figlet = require('figlet');
const fs = require('fs');
const path = require('path');
const config = require('./config');

// Dil seçenekleri
const LANGUAGES = {
    tr: {
        title: "Discord Sunucu Patlatma Paneli",
        subtitle: "Test Amaçlı",
        selectLanguage: "Dil seçin / Select Language:",
        botTypeQuestion: "Bot türünü seçin:",
        selfBot: "Self Token (Kullanıcı Hesabı)",
        normalBot: "Bot Token (Bot Hesabı)",
        selfBotWarning: "⚠️  UYARI: Self Token kullanımı Discord ToS'a aykırıdır!",
        enterToken: "Discord Token'ınızı girin:",
        enterServerId: "Sunucu ID'sini girin:",
        enterAuthorizedUsers: "Yetkili kullanıcı ID'lerini virgülle ayırarak girin:",
        channelSettings: "Kanal Ayarları",
        roleSettings: "Rol Ayarları", 
        messageSettings: "Mesaj Ayarları",
        dmMessageSettings: "DM Mesaj Ayarları",
        currentSettings: "Mevcut Ayarlar",
        startBot: "Bot'u Başlat",
        exit: "Çıkış",
        enterChannelNames: "Kanal isimlerini virgülle ayırarak girin:",
        enterRoleNames: "Rol isimlerini virgülle ayırarak girin:",
        enterMessage: "Gönderilecek mesajı girin:",
        enterDmMessage: "DM olarak gönderilecek mesajı girin:",
        settingsSaved: "✅ Ayarlar kaydedildi!",
        botStarting: "🚀 Bot başlatılıyor...",
        noSettings: "❌ Panel ayarları bulunamadı!",
        settingsLoaded: "✅ Panel ayarları yüklendi!",
        selectOption: "Bir seçenek seçin:",
        back: "← Geri",
        channels: "Kanallar",
        roles: "Roller",
        message: "Mesaj",
        dmMessage: "DM Mesaj",
        guildId: "Sunucu ID",
        token: "Token",
        botType: "Bot Türü",
        authorizedUsers: "Yetkili Kullanıcılar",
        whichBotType: "Hangi tür bot kullanmak istiyorsunuz?",
        selfBotChoice: "🤖 Self Bot (Kullanıcı hesabı ile) - Daha fazla yetki ama riskli",
        normalBotChoice: "🤖 Normal Bot (Bot hesabı ile) - Güvenli ama sınırlı yetki",
        backChoice: "⬅️  Geri dön",
        selfBotSelected: "Self Bot seçildi! Dikkatli olun!",
        selfBotWarning1: "Discord ToS'a aykırı olabilir!",
        selfBotWarning2: "Hesabınız kapatılabilir!",
        normalBotSelected: "Normal Bot seçildi!",
        normalBotSafe: "Discord ToS uyumlu ve güvenli!",
        operations: "Sunucu İşlemleri",
        operationsDesc: "Discord sunucusunda işlem yap",
        channelOperation: "Kanal İşlemleri",
        roleOperation: "Rol İşlemleri",
        banOperation: "Ban İşlemleri",
        dmOperation: "DM İşlemleri",
        operationSuccess: "✅ İşlem başarıyla tamamlandı!",
        operationFailed: "❌ İşlem başarısız!",
        confirmOperation: "Bu işlemi gerçekleştirmek istediğinizden emin misiniz?",
        operationInProgress: "🔄 İşlem gerçekleştiriliyor...",
        noServerAccess: "❌ Sunucuya erişim yok! Ayarları kontrol edin."
    },
    en: {
        title: "Discord Server Nuking Panel",
        subtitle: "For Testing Purposes",
        selectLanguage: "Select Language / Dil Seçin:",
        botTypeQuestion: "Select bot type:",
        selfBot: "Self Token (User Account)",
        normalBot: "Bot Token (Bot Account)",
        selfBotWarning: "⚠️  WARNING: Using Self Token violates Discord ToS!",
        enterToken: "Enter your Discord Token:",
        enterServerId: "Enter Server ID:",
        enterAuthorizedUsers: "Enter authorized user IDs separated by commas:",
        channelSettings: "Channel Settings",
        roleSettings: "Role Settings",
        messageSettings: "Message Settings", 
        dmMessageSettings: "DM Message Settings",
        currentSettings: "Current Settings",
        startBot: "Start Bot",
        exit: "Exit",
        enterChannelNames: "Enter channel names separated by commas:",
        enterRoleNames: "Enter role names separated by commas:",
        enterMessage: "Enter message to send:",
        enterDmMessage: "Enter message to send via DM:",
        settingsSaved: "✅ Settings saved!",
        botStarting: "🚀 Starting bot...",
        noSettings: "❌ Panel settings not found!",
        settingsLoaded: "✅ Panel settings loaded!",
        selectOption: "Select an option:",
        back: "← Back",
        channels: "Channels",
        roles: "Roles",
        message: "Message",
        dmMessage: "DM Message",
        guildId: "Server ID",
        token: "Token",
        botType: "Bot Type",
        authorizedUsers: "Authorized Users",
        whichBotType: "Which type of bot do you want to use?",
        selfBotChoice: "🤖 Self Bot (User account) - More permissions but risky",
        normalBotChoice: "🤖 Normal Bot (Bot account) - Safe but limited permissions",
        backChoice: "⬅️  Go back",
        selfBotSelected: "Self Bot selected! Be careful!",
        selfBotWarning1: "May violate Discord ToS!",
        selfBotWarning2: "Your account may be banned!",
        normalBotSelected: "Normal Bot selected!",
        normalBotSafe: "Discord ToS compliant and safe!",
        operations: "Server Operations",
        operationsDesc: "Perform operations on Discord server",
        channelOperation: "Channel Operations",
        roleOperation: "Role Operations",
        banOperation: "Ban Operations",
        dmOperation: "DM Operations",
        operationSuccess: "✅ Operation completed successfully!",
        operationFailed: "❌ Operation failed!",
        confirmOperation: "Are you sure you want to perform this operation?",
        operationInProgress: "🔄 Operation in progress...",
        noServerAccess: "❌ No access to server! Check settings."
    }
};

class CMDPanel {
    constructor() {
        this.settingsFile = 'panel_settings.json';
        this.settings = this.loadSettings();
        this.botType = null;
        this.language = 'tr'; // Varsayılan dil
    }

    loadSettings() {
        try {
            if (fs.existsSync(this.settingsFile)) {
                const data = fs.readFileSync(this.settingsFile, 'utf8');
                return JSON.parse(data);
            }
        } catch (error) {
            console.log(chalk.red('Ayarlar yüklenirken hata oluştu, varsayılan ayarlar kullanılıyor.'));
        }
        
        return this.getDefaultSettings();
    }

    getDefaultSettings() {
        return {
            channels: [...config.DEFAULT_CHANNELS],
            roles: [...config.DEFAULT_ROLES],
            message: config.DEFAULT_MESSAGE,
            dmMessage: config.DEFAULT_DM_MESSAGE,
            guildId: '',
            token: '',
            botType: '',
            authorizedUsers: []
        };
    }

    saveSettings() {
        try {
            fs.writeFileSync(this.settingsFile, JSON.stringify(this.settings, null, 2), 'utf8');
        } catch (error) {
            console.log(chalk.red('Ayarlar kaydedilirken hata oluştu!'));
        }
    }

    showBanner() {
        console.clear();
        console.log(chalk.red(figlet.textSync('411', { font: 'Standard' })));
        console.log(chalk.cyan(figlet.textSync('DISCORD', { font: 'Standard' })));
        console.log(chalk.yellow(figlet.textSync('PATLATMA', { font: 'Standard' })));
        console.log(chalk.green('╔══════════════════════════════════════════════════════════════╗'));
        console.log(chalk.green('║                    SUNUCU PATLATMA PANELİ                  ║'));
        console.log(chalk.green('║                            411                             ║'));
        console.log(chalk.green('╚══════════════════════════════════════════════════════════════╝'));
        console.log();
    }

    async selectLanguage() {
        this.showBanner();
        console.log(chalk.blue('╔══════════════════════════════════════════════════════════════╗'));
        console.log(chalk.blue('║                        DİL SEÇİMİ                          ║'));
        console.log(chalk.blue('╚══════════════════════════════════════════════════════════════╝'));
        console.log();

        const { language } = await inquirer.prompt([
            {
                type: 'list',
                name: 'language',
                message: LANGUAGES.tr.selectLanguage,
                choices: [
                    {
                        name: '🇹🇷 Türkçe',
                        value: 'tr'
                    },
                    {
                        name: '🇺🇸 English',
                        value: 'en'
                    }
                ]
            }
        ]);

        this.language = language;
        console.log(chalk.green(`\n✅ ${language === 'tr' ? 'Türkçe' : 'English'} seçildi!`));
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    async showBotTypeSelection() {
        this.showBanner();
        console.log(chalk.blue('╔══════════════════════════════════════════════════════════════╗'));
        console.log(chalk.blue('║                      BOT TÜRÜ SEÇİMİ                        ║'));
        console.log(chalk.blue('╚══════════════════════════════════════════════════════════════╝'));
        console.log();

        const { choice } = await inquirer.prompt([
            {
                type: 'list',
                name: 'choice',
                message: LANGUAGES[this.language].whichBotType,
                choices: [
                    {
                        name: LANGUAGES[this.language].selfBotChoice,
                        value: 'self'
                    },
                    {
                        name: LANGUAGES[this.language].normalBotChoice,
                        value: 'bot'
                    },
                    {
                        name: LANGUAGES[this.language].backChoice,
                        value: 'back'
                    }
                ]
            }
        ]);

        if (choice === 'back') return false;

        this.botType = choice;
        
        if (choice === 'self') {
            console.log(chalk.red(`\n⚠️  ${LANGUAGES[this.language].selfBotSelected}`));
            console.log(chalk.red(`⚠️  ${LANGUAGES[this.language].selfBotWarning1}`));
            console.log(chalk.red(`⚠️  ${LANGUAGES[this.language].selfBotWarning2}`));
        } else {
            console.log(chalk.green(`\n✅ ${LANGUAGES[this.language].normalBotSelected}`));
            console.log(chalk.green(`✅ ${LANGUAGES[this.language].normalBotSafe}`));
        }

        await this.waitForEnter();
        return true;
    }

    async setupBotConfiguration() {
        this.showBanner();
        console.log(chalk.blue('╔══════════════════════════════════════════════════════════════╗'));
        console.log(chalk.blue('║                    BOT KONFİGÜRASYONU                      ║'));
        console.log(chalk.blue('╚══════════════════════════════════════════════════════════════╝'));
        console.log();

        console.log(chalk.yellow(`Bot Türü: ${this.botType === 'self' ? 'Self Bot' : 'Normal Bot'}`));
        console.log();

        const answers = await inquirer.prompt([
            {
                type: 'password',
                name: 'token',
                message: LANGUAGES[this.language].enterToken,
                validate: (input) => input.trim() ? true : (this.language === 'tr' ? 'Token boş olamaz!' : 'Token cannot be empty!')
            },
            {
                type: 'input',
                name: 'guildId',
                message: LANGUAGES[this.language].enterServerId,
                validate: (input) => /^\d+$/.test(input.trim()) ? true : (this.language === 'tr' ? 'Geçersiz Sunucu ID! Sadece rakam olmalı.' : 'Invalid Server ID! Must be numbers only.')
            },
            {
                type: 'input',
                name: 'authorizedUsers',
                message: LANGUAGES[this.language].enterAuthorizedUsers,
                validate: (input) => {
                    const ids = input.split(',').map(id => id.trim()).filter(id => /^\d+$/.test(id));
                    return ids.length > 0 ? true : (this.language === 'tr' ? 'En az bir geçerli Discord ID gerekli!' : 'At least one valid Discord ID required!')
                }
            }
        ]);

        // Ayarları kaydet
        this.settings.token = answers.token;
        this.settings.guildId = answers.guildId;
        this.settings.authorizedUsers = answers.authorizedUsers.split(',').map(id => id.trim());
        this.settings.botType = this.botType;
        this.saveSettings();

        console.log(chalk.green('\n✅ Konfigürasyon kaydedildi!'));
        console.log(chalk.cyan(`Bot Türü: ${this.botType === 'self' ? 'Self Bot' : 'Normal Bot'}`));
        console.log(chalk.cyan(`Sunucu ID: ${answers.guildId}`));
        console.log(chalk.cyan(`Yetkili Kullanıcılar: ${this.settings.authorizedUsers.join(', ')}`));

        await this.waitForEnter();
        return true;
    }

    async showMainMenu() {
        this.showBanner();
        console.log(chalk.green('╔══════════════════════════════════════════════════════════════╗'));
        console.log(chalk.green(`║                        ${this.language === 'tr' ? 'ANA MENÜ' : 'MAIN MENU'}                          ║`));
        console.log(chalk.green('╠══════════════════════════════════════════════════════════════╣'));
        console.log(chalk.green(`║  1. ${this.language === 'tr' ? 'Bot Türü Seçimi' : 'Bot Type Selection'}                                        ║`));
        console.log(chalk.green(`║  2. ${this.language === 'tr' ? 'Bot Konfigürasyonu' : 'Bot Configuration'}                                     ║`));
        console.log(chalk.green(`║  3. ${this.language === 'tr' ? 'Tüm Ayarlar' : 'All Settings'}                                               ║`));
        console.log(chalk.green(`║  4. ${this.language === 'tr' ? 'Ayarları Görüntüle' : 'View Settings'}                                     ║`));
        console.log(chalk.green(`║  5. ${this.language === 'tr' ? 'Sunucu İşlemleri' : 'Server Operations'}                                   ║`));
        console.log(chalk.green(`║  6. ${this.language === 'tr' ? 'Bot\'u Başlat' : 'Start Bot'}                                           ║`));
        console.log(chalk.green(`║  7. ${this.language === 'tr' ? 'Çıkış' : 'Exit'}                                                  ║`));
        console.log(chalk.green('╚══════════════════════════════════════════════════════════════╝'));
        console.log();

        const { choice } = await inquirer.prompt([
            {
                type: 'list',
                name: 'choice',
                message: this.language === 'tr' ? 'Seçiminizi yapın:' : 'Make your selection:',
                choices: [
                    { name: `1. ${this.language === 'tr' ? 'Bot Türü Seçimi' : 'Bot Type Selection'}`, value: '1' },
                    { name: `2. ${this.language === 'tr' ? 'Bot Konfigürasyonu' : 'Bot Configuration'}`, value: '2' },
                    { name: `3. ${this.language === 'tr' ? 'Tüm Ayarlar' : 'All Settings'}`, value: '3' },
                    { name: `4. ${this.language === 'tr' ? 'Ayarları Görüntüle' : 'View Settings'}`, value: '4' },
                    { name: `5. ${this.language === 'tr' ? 'Sunucu İşlemleri' : 'Server Operations'}`, value: '5' },
                    { name: `6. ${this.language === 'tr' ? 'Bot\'u Başlat' : 'Start Bot'}`, value: '6' },
                    { name: `7. ${this.language === 'tr' ? 'Çıkış' : 'Exit'}`, value: '7' }
                ]
            }
        ]);

        return choice;
    }

    async showAllSettings() {
        this.showBanner();
        console.log(chalk.blue('╔══════════════════════════════════════════════════════════════╗'));
        console.log(chalk.blue(`║                    ${this.language === 'tr' ? 'TÜM AYARLAR' : 'ALL SETTINGS'}                        ║`));
        console.log(chalk.blue('╚══════════════════════════════════════════════════════════════╝'));
        console.log();

        const { choice } = await inquirer.prompt([
            {
                type: 'list',
                name: 'choice',
                message: this.language === 'tr' ? 'Hangi ayarı düzenlemek istiyorsunuz?' : 'Which setting would you like to edit?',
                choices: [
                    { name: this.language === 'tr' ? '1. Kanal Ayarları' : '1. Channel Settings', value: 'channels' },
                    { name: this.language === 'tr' ? '2. Rol Ayarları' : '2. Role Settings', value: 'roles' },
                    { name: this.language === 'tr' ? '3. Mesaj Ayarları' : '3. Message Settings', value: 'message' },
                    { name: this.language === 'tr' ? '4. DM Mesaj Ayarları' : '4. DM Message Settings', value: 'dm' },
                    { name: this.language === 'tr' ? '5. Geri dön' : '5. Go back', value: 'back' }
                ]
            }
        ]);

        if (choice === 'back') {
            return;
        }

        switch (choice) {
            case 'channels':
                await this.channelSettings();
                break;
            case 'roles':
                await this.roleSettings();
                break;
            case 'message':
                await this.messageSettings();
                break;
            case 'dm':
                await this.dmMessageSettings();
                break;
        }
    }

    async channelSettings() {
        this.showBanner();
        console.log(chalk.blue('╔══════════════════════════════════════════════════════════════╗'));
        console.log(chalk.blue(`║                    ${LANGUAGES[this.language].channelSettings.toUpperCase()}                        ║`));
        console.log(chalk.blue('╚══════════════════════════════════════════════════════════════╝'));
        console.log();

        console.log(chalk.cyan(`${this.language === 'tr' ? 'Mevcut kanallar' : 'Current channels'}: ${this.settings.channels.join(', ')}`));
        console.log();

        const { choice } = await inquirer.prompt([
            {
                type: 'list',
                name: 'choice',
                message: this.language === 'tr' ? 'Ne yapmak istiyorsunuz?' : 'What would you like to do?',
                choices: [
                    { name: this.language === 'tr' ? '1. Kanal ekle' : '1. Add channel', value: '1' },
                    { name: this.language === 'tr' ? '2. Kanal çıkar' : '2. Remove channel', value: '2' },
                    { name: this.language === 'tr' ? '3. Tümünü sıfırla' : '3. Reset all', value: '3' },
                    { name: this.language === 'tr' ? '4. Geri dön' : '4. Go back', value: '4' }
                ]
            }
        ]);

        if (choice === '1') {
            const { channelName } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'channelName',
                    message: this.language === 'tr' ? 'Eklenecek kanal adı:' : 'Channel name to add:',
                    validate: (input) => {
                        const name = input.trim();
                        if (!name) return this.language === 'tr' ? 'Kanal adı boş olamaz!' : 'Channel name cannot be empty!';
                        if (this.settings.channels.includes(name)) return this.language === 'tr' ? 'Bu kanal zaten mevcut!' : 'This channel already exists!';
                        return true;
                    }
                }
            ]);
            
            this.settings.channels.push(channelName.trim());
            this.saveSettings();
            console.log(chalk.green(`'${channelName.trim()}' ${this.language === 'tr' ? 'kanalı eklendi!' : 'channel added!'}`));
        } else if (choice === '2') {
            if (this.settings.channels.length === 0) {
                console.log(chalk.yellow(this.language === 'tr' ? 'Silinecek kanal bulunamadı!' : 'No channel to remove found!'));
            } else {
                const { channelToRemove } = await inquirer.prompt([
                    {
                        type: 'list',
                        name: 'channelToRemove',
                        message: this.language === 'tr' ? 'Çıkarılacak kanalı seçin:' : 'Select channel to remove:',
                        choices: this.settings.channels.map(channel => ({ name: channel, value: channel }))
                    }
                ]);
                
                this.settings.channels = this.settings.channels.filter(channel => channel !== channelToRemove);
                this.saveSettings();
                console.log(chalk.green(`'${channelToRemove}' ${this.language === 'tr' ? 'kanalı çıkarıldı!' : 'channel removed!'}`));
            }
        } else if (choice === '3') {
            this.settings.channels = [...config.DEFAULT_CHANNELS];
            this.saveSettings();
            console.log(chalk.green(this.language === 'tr' ? 'Kanal ayarları sıfırlandı!' : 'Channel settings reset!'));
        }

        if (choice !== '4') {
            await this.waitForEnter();
        }
    }

    async roleSettings() {
        this.showBanner();
        console.log(chalk.blue('╔══════════════════════════════════════════════════════════════╗'));
        console.log(chalk.blue(`║                     ${LANGUAGES[this.language].roleSettings.toUpperCase()}                          ║`));
        console.log(chalk.blue('╚══════════════════════════════════════════════════════════════╝'));
        console.log();

        console.log(chalk.cyan(`${this.language === 'tr' ? 'Mevcut roller' : 'Current roles'}: ${this.settings.roles.join(', ')}`));
        console.log();

        const { choice } = await inquirer.prompt([
            {
                type: 'list',
                name: 'choice',
                message: this.language === 'tr' ? 'Ne yapmak istiyorsunuz?' : 'What would you like to do?',
                choices: [
                    { name: this.language === 'tr' ? '1. Rol ekle' : '1. Add role', value: '1' },
                    { name: this.language === 'tr' ? '2. Rol çıkar' : '2. Remove role', value: '2' },
                    { name: this.language === 'tr' ? '3. Tümünü sıfırla' : '3. Reset all', value: '3' },
                    { name: this.language === 'tr' ? '4. Geri dön' : '4. Go back', value: '4' }
                ]
            }
        ]);

        if (choice === '1') {
            const { roleName } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'roleName',
                    message: this.language === 'tr' ? 'Eklenecek rol adı:' : 'Role name to add:',
                    validate: (input) => {
                        const name = input.trim();
                        if (!name) return this.language === 'tr' ? 'Rol adı boş olamaz!' : 'Role name cannot be empty!';
                        if (this.settings.roles.includes(name)) return this.language === 'tr' ? 'Bu rol zaten mevcut!' : 'This role already exists!';
                        return true;
                    }
                }
            ]);
            
            this.settings.roles.push(roleName.trim());
            this.saveSettings();
            console.log(chalk.green(`'${roleName.trim()}' ${this.language === 'tr' ? 'rolü eklendi!' : 'role added!'}`));
        } else if (choice === '2') {
            if (this.settings.roles.length === 0) {
                console.log(chalk.yellow(this.language === 'tr' ? 'Silinecek rol bulunamadı!' : 'No role to remove found!'));
            } else {
                const { roleToRemove } = await inquirer.prompt([
                    {
                        type: 'list',
                        name: 'roleToRemove',
                        message: this.language === 'tr' ? 'Çıkarılacak rolü seçin:' : 'Select role to remove:',
                        choices: this.settings.roles.map(role => ({ name: role, value: role }))
                    }
                ]);
                
                this.settings.roles = this.settings.roles.filter(role => role !== roleToRemove);
                this.saveSettings();
                console.log(chalk.green(`'${roleToRemove}' ${this.language === 'tr' ? 'rolü çıkarıldı!' : 'role removed!'}`));
            }
        } else if (choice === '3') {
            this.settings.roles = [...config.DEFAULT_ROLES];
            this.saveSettings();
            console.log(chalk.green(this.language === 'tr' ? 'Rol ayarları sıfırlandı!' : 'Role settings reset!'));
        }

        if (choice !== '4') {
            await this.waitForEnter();
        }
    }

    async messageSettings() {
        this.showBanner();
        console.log(chalk.blue('╔══════════════════════════════════════════════════════════════╗'));
        console.log(chalk.blue(`║                   ${LANGUAGES[this.language].messageSettings.toUpperCase()}                          ║`));
        console.log(chalk.blue('╚══════════════════════════════════════════════════════════════╝'));
        console.log();

        console.log(chalk.cyan(`${this.language === 'tr' ? 'Mevcut mesaj' : 'Current message'}: ${this.settings.message}`));
        console.log();

        const { choice } = await inquirer.prompt([
            {
                type: 'list',
                name: 'choice',
                message: this.language === 'tr' ? 'Ne yapmak istiyorsunuz?' : 'What would you like to do?',
                choices: [
                    { name: this.language === 'tr' ? '1. Mesajı değiştir' : '1. Change message', value: '1' },
                    { name: this.language === 'tr' ? '2. Varsayılana sıfırla' : '2. Reset to default', value: '2' },
                    { name: this.language === 'tr' ? '3. Geri dön' : '3. Go back', value: '3' }
                ]
            }
        ]);

        if (choice === '1') {
            const { newMessage } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'newMessage',
                    message: this.language === 'tr' ? 'Yeni mesaj:' : 'New message:',
                    validate: (input) => input.trim() ? true : (this.language === 'tr' ? 'Mesaj boş olamaz!' : 'Message cannot be empty!')
                }
            ]);
            
            this.settings.message = newMessage.trim();
            this.saveSettings();
            console.log(chalk.green(this.language === 'tr' ? 'Mesaj güncellendi!' : 'Message updated!'));
        } else if (choice === '2') {
            this.settings.message = config.DEFAULT_MESSAGE;
            this.saveSettings();
            console.log(chalk.green(this.language === 'tr' ? 'Mesaj varsayılana sıfırlandı!' : 'Message reset to default!'));
        }

        if (choice !== '3') {
            await this.waitForEnter();
        }
    }

    async dmMessageSettings() {
        this.showBanner();
        console.log(chalk.blue('╔══════════════════════════════════════════════════════════════╗'));
        console.log(chalk.blue(`║                 ${LANGUAGES[this.language].dmMessageSettings.toUpperCase()}                        ║`));
        console.log(chalk.blue('╚══════════════════════════════════════════════════════════════╝'));
        console.log();

        console.log(chalk.cyan(`${this.language === 'tr' ? 'Mevcut DM mesajı' : 'Current DM message'}: ${this.settings.dmMessage}`));
        console.log();

        const { choice } = await inquirer.prompt([
            {
                type: 'list',
                name: 'choice',
                message: this.language === 'tr' ? 'Ne yapmak istiyorsunuz?' : 'What would you like to do?',
                choices: [
                    { name: this.language === 'tr' ? '1. DM mesajını değiştir' : '1. Change DM message', value: '1' },
                    { name: this.language === 'tr' ? '2. Varsayılana sıfırla' : '2. Reset to default', value: '2' },
                    { name: this.language === 'tr' ? '3. Geri dön' : '3. Go back', value: '3' }
                ]
            }
        ]);

        if (choice === '1') {
            const { newDmMessage } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'newDmMessage',
                    message: this.language === 'tr' ? 'Yeni DM mesajı:' : 'New DM message:',
                    validate: (input) => input.trim() ? true : (this.language === 'tr' ? 'DM mesajı boş olamaz!' : 'DM message cannot be empty!')
                }
            ]);
            
            this.settings.dmMessage = newDmMessage.trim();
            this.saveSettings();
            console.log(chalk.green(this.language === 'tr' ? 'DM mesajı güncellendi!' : 'DM message updated!'));
        } else if (choice === '2') {
            this.settings.dmMessage = config.DEFAULT_DM_MESSAGE;
            this.saveSettings();
            console.log(chalk.green(this.language === 'tr' ? 'DM mesajı varsayılana sıfırlandı!' : 'DM message reset to default!'));
        }

        if (choice !== '3') {
            await this.waitForEnter();
        }
    }

    showCurrentSettings() {
        this.showBanner();
        console.log(chalk.blue('╔══════════════════════════════════════════════════════════════╗'));
        console.log(chalk.blue(`║                   ${LANGUAGES[this.language].currentSettings.toUpperCase()}                          ║`));
        console.log(chalk.blue('╚══════════════════════════════════════════════════════════════╝'));
        console.log();

        console.log(chalk.cyan(`🤖 ${LANGUAGES[this.language].botType}: ${this.settings.botType || (this.language === 'tr' ? 'Belirlenmedi' : 'Not set')}`));
        console.log(chalk.cyan(`🔑 ${LANGUAGES[this.language].token}: ${this.settings.token ? '***' + this.settings.token.slice(-4) : (this.language === 'tr' ? 'Belirlenmedi' : 'Not set')}`));
        console.log(chalk.cyan(`🏠 ${LANGUAGES[this.language].guildId}: ${this.settings.guildId || (this.language === 'tr' ? 'Belirlenmedi' : 'Not set')}`));
        console.log(chalk.cyan(`👥 ${LANGUAGES[this.language].authorizedUsers}: ${this.settings.authorizedUsers.length > 0 ? this.settings.authorizedUsers.join(', ') : (this.language === 'tr' ? 'Belirlenmedi' : 'Not set')}`));
        console.log(chalk.cyan(`📺 ${LANGUAGES[this.language].channels}: ${this.settings.channels.join(', ')}`));
        console.log(chalk.cyan(`👑 ${LANGUAGES[this.language].roles}: ${this.settings.roles.join(', ')}`));
        console.log(chalk.cyan(`💬 ${LANGUAGES[this.language].message}: ${this.settings.message}`));
        console.log(chalk.cyan(`📱 ${LANGUAGES[this.language].dmMessage}: ${this.settings.dmMessage}`));

        this.waitForEnter();
    }

    async startBot() {
        this.showBanner();
        console.log(chalk.blue('╔══════════════════════════════════════════════════════════════╗'));
        console.log(chalk.blue(`║                     ${this.language === 'tr' ? 'BOT BAŞLATILIYOR' : 'STARTING BOT'}                      ║`));
        console.log(chalk.blue('╚══════════════════════════════════════════════════════════════╝'));
        console.log();

        // Gerekli ayarları kontrol et
        if (!this.settings.token) {
            console.log(chalk.red(`❌ ${this.language === 'tr' ? 'Bot token\'ı belirlenmemiş!' : 'Bot token not set!'}`));
            console.log(chalk.yellow(this.language === 'tr' ? 'Önce \'Bot Konfigürasyonu\' seçeneğini kullanın.' : 'Please use \'Bot Configuration\' option first.'));
            await this.waitForEnter();
            return;
        }

        if (!this.settings.guildId) {
            console.log(chalk.red(`❌ ${this.language === 'tr' ? 'Sunucu ID belirlenmemiş!' : 'Server ID not set!'}`));
            console.log(chalk.yellow(this.language === 'tr' ? 'Önce \'Bot Konfigürasyonu\' seçeneğini kullanın.' : 'Please use \'Bot Configuration\' option first.'));
            await this.waitForEnter();
            return;
        }

        if (!this.settings.authorizedUsers || this.settings.authorizedUsers.length === 0) {
            console.log(chalk.red(`❌ ${this.language === 'tr' ? 'Yetkili kullanıcılar belirlenmemiş!' : 'Authorized users not set!'}`));
            console.log(chalk.yellow(this.language === 'tr' ? 'Önce \'Bot Konfigürasyonu\' seçeneğini kullanın.' : 'Please use \'Bot Configuration\' option first.'));
            await this.waitForEnter();
            return;
        }

        console.log(chalk.green(this.language === 'tr' ? 'Bot başlatılıyor...' : 'Starting bot...'));
        console.log(chalk.cyan(`${LANGUAGES[this.language].botType}: ${this.settings.botType === 'self' ? 'Self Bot' : 'Normal Bot'}`));
        console.log(chalk.cyan(`${LANGUAGES[this.language].guildId}: ${this.settings.guildId}`));
        console.log(chalk.cyan(`${LANGUAGES[this.language].authorizedUsers}: ${this.settings.authorizedUsers.join(', ')}`));
        console.log(chalk.cyan(`${LANGUAGES[this.language].channels}: ${this.settings.channels.join(', ')}`));
        console.log(chalk.cyan(`${LANGUAGES[this.language].roles}: ${this.settings.roles.join(', ')}`));
        console.log(chalk.cyan(`${LANGUAGES[this.language].message}: ${this.settings.message}`));
        console.log(chalk.cyan(`${LANGUAGES[this.language].dmMessage}: ${this.settings.dmMessage}`));

        console.log(chalk.yellow(`\n${this.language === 'tr' ? 'Bot başlatıldı! Discord sunucusunda komutları kullanabilirsiniz:' : 'Bot started! You can use commands in Discord server:'}`));
        console.log(chalk.yellow('!kanal - Tüm kanalları sil ve yenilerini oluştur'));
        console.log(chalk.yellow('!rol - Tüm rolleri sil ve yenilerini oluştur'));
        console.log(chalk.yellow('!mesaj - Tüm kanallara mesaj gönder'));
        console.log(chalk.yellow('!ban - Tüm üyeleri banla'));
        console.log(chalk.yellow('!dm - Tüm üyelere DM gönder'));

        console.log(chalk.red(`\n${this.language === 'tr' ? 'Bot\'u durdurmak için Ctrl+C kullanın.' : 'Use Ctrl+C to stop the bot.'}`));

        try {
            // Bot'u başlat
            const { spawn } = require('child_process');
            const botProcess = spawn('node', ['bot.js'], { stdio: 'inherit' });

            botProcess.on('close', (code) => {
                console.log(chalk.yellow(`\n${this.language === 'tr' ? 'Bot kapatıldı (kod:' : 'Bot closed (code:'} ${code})`));
            });
        } catch (error) {
            console.log(chalk.red(`\n${this.language === 'tr' ? 'Bot başlatma hatası:' : 'Bot startup error:'} ${error.message}`));
        }

        await this.waitForEnter();
    }

    async showOperationsMenu() {
        this.showBanner();
        console.log(chalk.red('╔══════════════════════════════════════════════════════════════╗'));
        console.log(chalk.red(`║                ${LANGUAGES[this.language].operations.toUpperCase()}                    ║`));
        console.log(chalk.red('╚══════════════════════════════════════════════════════════════╝'));
        console.log();

        // Ayarları kontrol et
        if (!this.settings.token || !this.settings.guildId) {
            console.log(chalk.red(`❌ ${this.language === 'tr' ? 'Bot token veya sunucu ID eksik! Önce ayarları yapılandırın.' : 'Bot token or server ID missing! Configure settings first.'}`));
            await this.waitForEnter();
            return;
        }

        const { operation } = await inquirer.prompt([
            {
                type: 'list',
                name: 'operation',
                message: this.language === 'tr' ? 'Hangi işlemi yapmak istiyorsunuz?' : 'Which operation do you want to perform?',
                choices: [
                    { name: `1. ${LANGUAGES[this.language].channelOperation}`, value: 'channels' },
                    { name: `2. ${LANGUAGES[this.language].roleOperation}`, value: 'roles' },
                    { name: `3. ${LANGUAGES[this.language].banOperation}`, value: 'ban' },
                    { name: `4. ${LANGUAGES[this.language].dmOperation}`, value: 'dm' },
                    { name: this.language === 'tr' ? '5. Geri dön' : '5. Go back', value: 'back' }
                ]
            }
        ]);

        if (operation === 'back') {
            return;
        }

        // İşlemi onayla
        const { confirm } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'confirm',
                message: LANGUAGES[this.language].confirmOperation,
                default: false
            }
        ]);

        if (!confirm) {
            console.log(chalk.yellow(this.language === 'tr' ? 'İşlem iptal edildi.' : 'Operation cancelled.'));
            await this.waitForEnter();
            return;
        }

        // İşlemi gerçekleştir
        await this.performOperation(operation);
    }

    async performOperation(operation) {
        console.log(chalk.blue(LANGUAGES[this.language].operationInProgress));
        
        try {
            const { Client, GatewayIntentBits } = require('discord.js');
            
            const client = new Client({
                intents: [
                    GatewayIntentBits.Guilds,
                    GatewayIntentBits.GuildMessages,
                    GatewayIntentBits.GuildMembers,
                    GatewayIntentBits.MessageContent
                ]
            });

            await client.login(this.settings.token);
            
            const guild = await client.guilds.fetch(this.settings.guildId);
            if (!guild) {
                throw new Error('Guild not found');
            }

            switch (operation) {
                case 'channels':
                    await this.performChannelOperation(client, guild);
                    break;
                case 'roles':
                    await this.performRoleOperation(client, guild);
                    break;
                case 'ban':
                    await this.performBanOperation(client, guild);
                    break;
                case 'dm':
                    await this.performDmOperation(client, guild);
                    break;
            }

            await client.destroy();
            console.log(chalk.green(LANGUAGES[this.language].operationSuccess));
            
        } catch (error) {
            console.log(chalk.red(`${LANGUAGES[this.language].operationFailed} ${error.message}`));
        }

        await this.waitForEnter();
    }

    async performChannelOperation(client, guild) {
        console.log(chalk.cyan(this.language === 'tr' ? 'Kanal işlemleri başlatılıyor...' : 'Starting channel operations...'));
        
        // 1. Önce tüm mevcut kanalları sil
        console.log(chalk.yellow(this.language === 'tr' ? '1. Tüm mevcut kanallar siliniyor...' : '1. Deleting all existing channels...'));
        
        // Bot'un yetkilerini kontrol et
        const botMember = await guild.members.fetch(client.user.id);
        console.log(chalk.blue(`${this.language === 'tr' ? 'Bot yetkileri:' : 'Bot permissions:'} ${botMember.permissions.toArray().join(', ')}`));
        
        // Tüm kanalları listele ve detayları göster
        const allChannels = guild.channels.cache;
        console.log(chalk.blue(`${this.language === 'tr' ? 'Sunucudaki toplam kanal sayısı:' : 'Total channels in server:'} ${allChannels.size}`));
        
        allChannels.forEach(channel => {
            console.log(chalk.gray(`- ${channel.name} (Type: ${channel.type}, ID: ${channel.id})`));
        });
        
        // Text kanalları filtrele (Discord.js v14 için)
        const existingChannels = guild.channels.cache.filter(channel => {
            // ChannelType.GuildText = 0, ChannelType.GuildAnnouncement = 5
            return channel.type === 0 || channel.type === 5;
        });
        console.log(chalk.blue(`${this.language === 'tr' ? 'Silinecek text kanal sayısı:' : 'Text channels to delete:'} ${existingChannels.size}`));
        
        if (existingChannels.size === 0) {
            console.log(chalk.yellow(this.language === 'tr' ? 'Silinecek text kanal bulunamadı!' : 'No text channels found to delete!'));
        } else {
            for (const channel of existingChannels.values()) {
                try {
                    console.log(chalk.blue(`${this.language === 'tr' ? 'Silinmeye çalışılan kanal:' : 'Attempting to delete channel:'} ${channel.name}`));
                    
                    // Kanalın bot tarafından silinebilir olup olmadığını kontrol et
                    if (!channel.deletable) {
                        console.log(chalk.red(`${this.language === 'tr' ? 'Kanal silinemez (yetki yok):' : 'Channel cannot be deleted (no permission):'} ${channel.name}`));
                        continue;
                    }
                    
                    await channel.delete();
                    console.log(chalk.yellow(`${this.language === 'tr' ? 'Silinen kanal:' : 'Deleted channel:'} ${channel.name}`));
                } catch (error) {
                    console.log(chalk.red(`${this.language === 'tr' ? 'Kanal silme hatası:' : 'Channel deletion error:'} ${channel.name} - ${error.message}`));
                }
            }
        }
        
        console.log(chalk.green(this.language === 'tr' ? '✅ Tüm kanallar silindi!' : '✅ All channels deleted!'));
        
        // 2. Yeni kanalları oluştur
        console.log(chalk.blue(this.language === 'tr' ? '2. Yeni kanallar oluşturuluyor...' : '2. Creating new channels...'));
        
        const newChannels = [];
        for (const channelName of this.settings.channels) {
            for (let i = 1; i <= 20; i++) {
                try {
                    const channel = await guild.channels.create({
                        name: `${channelName}-${i}`,
                        type: 0
                    });
                    
                    // Kanalı herkesin görebileceği şekilde ayarla
                    await channel.permissionOverwrites.set([
                        {
                            id: guild.id,
                            allow: ['ViewChannel', 'ReadMessageHistory', 'SendMessages']
                        }
                    ]);
                    
                    newChannels.push(channel);
                    console.log(chalk.green(`${this.language === 'tr' ? 'Oluşturulan kanal:' : 'Created channel:'} ${channel.name}`));
                } catch (error) {
                    console.log(chalk.red(`${this.language === 'tr' ? 'Kanal oluşturma hatası:' : 'Channel creation error:'} ${error.message}`));
                }
            }
        }
        
        console.log(chalk.green(this.language === 'tr' ? '✅ Tüm kanallar oluşturuldu!' : '✅ All channels created!'));
        
        // 3. Sunucuda bulunan TÜM kanallara mesajları at
        console.log(chalk.magenta(this.language === 'tr' ? '3. Sunucudaki tüm kanallara mesajlar gönderiliyor...' : '3. Sending messages to ALL channels in server...'));
        
        // Sunucudaki tüm text kanalları al (yeni oluşturulan + mevcut olan)
        const allTextChannels = guild.channels.cache.filter(channel => channel.type === 0);
        console.log(chalk.blue(`${this.language === 'tr' ? 'Toplam kanal sayısı:' : 'Total channels:'} ${allTextChannels.size}`));
        
        const messagePromises = [];
        for (const channel of allTextChannels.values()) {
            for (let i = 1; i <= 20; i++) {
                messagePromises.push(
                    channel.send(this.settings.message)
                        .then(() => {
                            console.log(chalk.green(`${this.language === 'tr' ? 'Mesaj gönderildi:' : 'Message sent:'} ${channel.name} (${i}/20)`));
                        })
                        .catch(error => {
                            console.log(chalk.red(`${this.language === 'tr' ? 'Mesaj hatası:' : 'Message error:'} ${channel.name} - ${error.message}`));
                        })
                );
            }
        }
        
        // Tüm mesajları aynı anda gönder
        await Promise.all(messagePromises);
        
        console.log(chalk.green(this.language === 'tr' ? '✅ Tüm işlemler tamamlandı!' : '✅ All operations completed!'));
    }

    async performRoleOperation(client, guild) {
        console.log(chalk.cyan(this.language === 'tr' ? 'Rol işlemleri başlatılıyor...' : 'Starting role operations...'));
        
        // Önce yeni rolleri oluştur
        const newRoles = [];
        for (const roleName of this.settings.roles) {
            for (let i = 1; i <= 20; i++) {
                try {
                    const role = await guild.roles.create({
                        name: `${roleName}-${i}`,
                        color: Math.floor(Math.random() * 16777215),
                        mentionable: true,
                        hoist: true
                    });
                    newRoles.push(role);
                    console.log(chalk.green(`${this.language === 'tr' ? 'Oluşturulan rol:' : 'Created role:'} ${role.name}`));
                } catch (error) {
                    console.log(chalk.red(`${this.language === 'tr' ? 'Rol oluşturma hatası:' : 'Role creation error:'} ${error.message}`));
                }
            }
        }

        // Eski rolleri sil (yeni oluşturulanlar hariç)
        const oldRoles = guild.roles.cache.filter(role => 
            !role.managed && 
            role.name !== '@everyone' && 
            !newRoles.some(newRole => newRole.id === role.id)
        );

        for (const role of oldRoles.values()) {
            try {
                await role.delete();
                console.log(chalk.yellow(`${this.language === 'tr' ? 'Silinen rol:' : 'Deleted role:'} ${role.name}`));
            } catch (error) {
                console.log(chalk.red(`${this.language === 'tr' === 'tr' ? 'Rol silme hatası:' : 'Role deletion error:'} ${error.message}`));
            }
        }
    }



    async performBanOperation(client, guild) {
        console.log(chalk.cyan(this.language === 'tr' ? 'Ban işlemleri başlatılıyor...' : 'Starting ban operations...'));
        
        const members = await guild.members.fetch();
        const banCount = 0;

        for (const member of members.values()) {
            if (!member.user.bot && member.id !== client.user.id) {
                try {
                    await guild.members.ban(member.id, { reason: 'Panel üzerinden ban' });
                    banCount++;
                    console.log(chalk.yellow(`${this.language === 'tr' ? 'Banlanan üye:' : 'Banned member:'} ${member.user.tag}`));
                } catch (error) {
                    console.log(chalk.red(`${this.language === 'tr' ? 'Ban hatası:' : 'Ban error:'} ${error.message}`));
                }
            }
        }

        console.log(chalk.green(`${this.language === 'tr' ? 'Toplam banlanan üye:' : 'Total banned members:'} ${banCount}`));
    }

    async performDmOperation(client, guild) {
        console.log(chalk.cyan(this.language === 'tr' ? 'DM işlemleri başlatılıyor...' : 'Starting DM operations...'));
        
        const members = await guild.members.fetch();
        let dmCount = 0;

        for (const member of members.values()) {
            if (!member.user.bot && member.id !== client.user.id) {
                try {
                    await member.send(this.settings.dmMessage);
                    dmCount++;
                    console.log(chalk.green(`${this.language === 'tr' ? 'DM gönderildi:' : 'DM sent:'} ${member.user.tag}`));
                } catch (error) {
                    console.log(chalk.red(`${this.language === 'tr' ? 'DM hatası:' : 'DM error:'} ${error.message}`));
                }
            }
        }

        console.log(chalk.green(`${this.language === 'tr' ? 'Toplam DM gönderilen üye:' : 'Total DM sent to members:'} ${dmCount}`));
    }

    async waitForEnter() {
        console.log(chalk.gray(`\n${this.language === 'tr' ? 'Devam etmek için Enter\'a basın...' : 'Press Enter to continue...'}`));
        await inquirer.prompt([
            {
                type: 'input',
                name: 'continue',
                message: '',
                default: ''
            }
        ]);
    }

    async run() {
        // İlk olarak dil seçimi yap
        await this.selectLanguage();
        
        while (true) {
            const choice = await this.showMainMenu();

            switch (choice) {
                case '1':
                    await this.showBotTypeSelection();
                    break;
                case '2':
                    if (!this.botType) {
                        console.log(chalk.red(`\n❌ ${this.language === 'tr' ? 'Önce bot türünü seçin!' : 'Please select bot type first!'}`));
                        await this.waitForEnter();
                    } else {
                        await this.setupBotConfiguration();
                    }
                    break;
                case '3':
                    await this.showAllSettings();
                    break;
                case '4':
                    await this.showCurrentSettings();
                    break;
                case '5':
                    await this.showOperationsMenu();
                    break;
                case '6':
                    await this.startBot();
                    break;
                case '7':
                    console.log(chalk.green(`\n${this.language === 'tr' ? 'Panel kapatılıyor...' : 'Closing panel...'}`));
                    process.exit(0);
                default:
                    console.log(chalk.red(this.language === 'tr' ? 'Geçersiz seçim!' : 'Invalid selection!'));
                    await this.waitForEnter();
            }
        }
    }
}

// Panel'i başlat
if (require.main === module) {
    const panel = new CMDPanel();
    panel.run().catch(console.error);
}

module.exports = CMDPanel;
