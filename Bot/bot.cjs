const { Telegraf } = require('telegraf');
const { HttpsProxyAgent } = require('https-proxy-agent');
const axios = require('axios');

// تنظیمات پروکسی
const proxyUrl = 'http://127.0.0.1:10809';
const agent = new HttpsProxyAgent(proxyUrl);

// توکن بات تلگرام
const BOT_TOKEN = '7364233381:AAEqB8PKK4QwkkWZmc9lXICo-MeKGm9z9VI';
if (!BOT_TOKEN) {
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
    try {
        // استخراج کد رفرال از start payload (اگر وجود داشته باشد)
        let referralCode = null;
        if (ctx.startPayload) {
            referralCode = ctx.startPayload;
        } else if (ctx.message && ctx.message.text && ctx.message.text.startsWith('/start ')) {
            referralCode = ctx.message.text.split(' ')[1];
        }
        // درخواست به بک‌اند برای دریافت توکن (بدون پراکسی)
        const response = await axios.post(
            'http://localhost:8000/api/auth/telegram',
            {
                telegram_id: String(ctx.from.id),
                username: ctx.from.username,
                first_name: ctx.from.first_name,
                last_name: ctx.from.last_name,
                referral_code: referralCode
            },
            { proxy: false }
        );
        const token = response.data.token;
        const webAppUrl = `https://front-lottery.vercel.app/?token=${token}`;
        const localWebAppUrl = `http://localhost:3000/?token=${token}`;
        await ctx.reply(
            `برای ورود به وب‌اپ روی دکمه زیر کلیک کن:\n\nاگر می‌خواهی روی لوکال تست کنی، این لینک را کپی کن و در مرورگر باز کن:\n${localWebAppUrl}`,
            {
                reply_markup: {
                    keyboard: [
                        [
                            {
                                text: 'ورود به وب‌اپ',
                                web_app: { url: webAppUrl }
                            }
                        ]
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: true
                }
            }
        );
    } catch (error) {
        await ctx.reply('خطا در دریافت توکن از سرور! لطفاً بعداً تلاش کنید.');
        console.error(error);
    }
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

module.exports = bot;
