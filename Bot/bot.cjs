const { Telegraf } = require('telegraf');
const { HttpsProxyAgent } = require('https-proxy-agent');

// تنظیمات پروکسی
const proxyUrl = 'http://127.0.0.1:10809';
const agent = new HttpsProxyAgent(proxyUrl);

// توکن بات تلگرام
const BOT_TOKEN = '7364233381:AAEqB8PKK4QwkkWZmc9lXICo-MeKGm9z9VI';
if (!BOT_TOKEN) {
    console.error('Error: Bot token is missing.');
    process.exit(1);
}

// ذخیره‌سازی موقت اطلاعات کاربران
const userData = {};

// ساخت بات و تنظیمات پروکسی
const bot = new Telegraf(BOT_TOKEN, {
    telegram: { agent }
});

// دستور شروع
bot.start(async (ctx) => {
    const userId = ctx.from.id;
    const username = ctx.from.username || 'نامشخص';
    const firstName = ctx.from.first_name || 'نامشخص';
    const lastName = ctx.from.last_name || 'نامشخص';

    // لاگ اطلاعات کاربر
    console.log('=== New User Info ===');
    console.log(`User ID: ${userId}`);
    console.log(`Username: @${username}`);
    console.log(`First Name: ${firstName}`);
    console.log(`Last Name: ${lastName}`);
    console.log(`Joined At: ${new Date().toISOString()}`);
    console.log('===================');

    // ذخیره اطلاعات اولیه کاربر
    userData[userId] = {
        telegramId: userId,
        username,
        firstName,
        lastName,
        joinedAt: new Date().toISOString(),
        step: 'firstName'
    };

    // لینک وب اپ شما
    const webAppLink = 'https://t.me/LotteryAbolBot/AbolBot'; // لینک وب اپ شما

    // ارسال پیام خوش‌آمدگویی همراه با لینک وب اپ
    await ctx.reply(`برای شروع، به صفحه خانه وب اپ بروید: ${webAppLink}`);
});

// پردازش کلیک روی لینک رفرال
bot.on('text', async (ctx) => {
    const referralLink = ctx.message.text;
    // اگر لینک رفرال ارسال شد، به وب اپ هدایت می‌کنیم
    if (referralLink.includes('t.me/LotteryAbolBot?start=')) {
        const webAppLink = 'https://t.me/LotteryAbolBot/AbolBot'; // لینک وب اپ شما
        // در اینجا لینک به وب اپ به طور مستقیم فرستاده میشه
        await ctx.reply(`به وب اپ هدایت شدید: ${webAppLink}`);
    }
});

// اجرای بات
bot.launch()
    .then(() => console.log('Bot is running with proxy...'))
    .catch(err => {
        console.error('Failed to start bot with proxy:', err);
    });

module.exports = bot;
