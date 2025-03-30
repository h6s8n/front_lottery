const { Telegraf, Scenes, Markup } = require('telegraf');
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

// صفحه خانه با دکمه Web App
const showHomePage = async (ctx) => {
    const keyboard = Markup.keyboard([
        [Markup.button.webApp('🏠 بازگشت به صفحه خانه', 'https://your-domain.com')]
    ])
    .resize()
    .oneTime();

    await ctx.reply('برای مشاهده صفحه خانه، روی دکمه زیر کلیک کنید:', keyboard);
};

// دستور شروع
bot.start(async (ctx) => {
    const userId = ctx.from.id;
    const username = ctx.from.username || 'نامشخص';
    const firstName = ctx.from.first_name || 'نامشخص';
    const lastName = ctx.from.last_name || 'نامشخص';
    const referralCode = ctx.startPayload;

    // لاگ اطلاعات کاربر
    console.log('=== New User Info ===');
    console.log(`User ID: ${userId}`);
    console.log(`Username: @${username}`);
    console.log(`First Name: ${firstName}`);
    console.log(`Last Name: ${lastName}`);
    console.log(`Referral Code: ${referralCode}`);
    console.log(`Joined At: ${new Date().toISOString()}`);
    console.log('===================');

    // ذخیره اطلاعات اولیه کاربر
    userData[userId] = {
        telegramId: userId,
        username,
        firstName,
        lastName,
        joinedAt: new Date().toISOString(),
        referralCode: referralCode || null,
        step: 'firstName'
    };
    
    // پیام خوش‌آمدگویی
    const welcomeMessage = `
👋 به بات لاتاری خوش آمدید!

🆔 شناسه شما: ${userId}
👤 نام کاربری: @${username}
👤 نام: ${firstName} ${lastName}
${referralCode ? `🔗 کد رفرال: ${referralCode}` : ''}
    `;
    
    await ctx.reply(welcomeMessage);
    await showHomePage(ctx);
});

// دستور راهنما
bot.command('help', async (ctx) => {
    const helpMessage = `
📚 راهنمای دستورات:

/start - بازگشت به صفحه خانه
/help - نمایش این راهنما
    `;
    
    await ctx.reply(helpMessage);
});

// اجرای بات
bot.launch()
    .then(() => console.log('Bot is running with proxy...'))
    .catch(err => {
        console.error('Failed to start bot with proxy:', err);
    });

module.exports = bot;
