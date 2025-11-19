require('dotenv').config();
const { Telegraf } = require('telegraf');
const { HttpsProxyAgent } = require('https-proxy-agent');
const axios = require('axios');
const net = require('net');

// تنظیمات پروکسی
const PROXY_HOST = '127.0.0.1';
const PROXY_PORT = 10809;
const PROXY_URL = `http://${PROXY_HOST}:${PROXY_PORT}`;

// تابع بررسی وضعیت پروکسی
const checkProxy = (host, port) => {
    return new Promise((resolve) => {
        const socket = new net.Socket();
        socket.setTimeout(1000); // 1 ثانیه تایم‌اوت
        socket.on('connect', () => {
            socket.destroy();
            resolve(true);
        });
        socket.on('timeout', () => {
            socket.destroy();
            resolve(false);
        });
        socket.on('error', () => {
            socket.destroy();
            resolve(false);
        });
        socket.connect(port, host);
    });
};

// توکن بات تلگرام
const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) {
    console.error('Error: BOT_TOKEN is not defined in .env file');
    process.exit(1);
}

// ذخیره‌سازی موقت اطلاعات کاربران
const userData = {};

async function main() {
    // بررسی اتصال پروکسی
    console.log(`Checking proxy at ${PROXY_HOST}:${PROXY_PORT}...`);
    const isProxyUp = await checkProxy(PROXY_HOST, PROXY_PORT);
    let agent = null;

    if (isProxyUp) {
        console.log(`Proxy is UP. Using agent: ${PROXY_URL}`);
        agent = new HttpsProxyAgent(PROXY_URL);
    } else {
        console.log('Proxy is DOWN or unreachable. Connecting directly to Telegram...');
    }

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
            const apiUrl = process.env.API_URL || 'https://www.monopolies.ir/api/auth/telegram';
            console.log('Sending request to:', apiUrl);

            const response = await axios.post(
                apiUrl,
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

    // Launch the bot to start listening for messages
    bot.launch();
    console.log('Bot is running...');

    // Enable graceful stop
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
}

main();
