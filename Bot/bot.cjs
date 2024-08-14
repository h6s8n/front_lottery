const { Telegraf } = require('telegraf');

// Replace 'YOUR_TELEGRAM_BOT_TOKEN' with your actual bot token
const BOT_TOKEN = '7364233381:AAEqB8PKK4QwkkWZmc9lXICo-MeKGm9z9VI';
if (!BOT_TOKEN) {
    console.error('Error: Bot token is missing. Please replace YOUR_TELEGRAM_BOT_TOKEN with your actual bot token.');
    process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
    const referralId = ctx.startPayload; // Get the referral ID from the start payload
    const userId = ctx.from.id; // Get the user ID

    console.log(`User ID: ${userId}`);
    console.log(`Referral ID: ${referralId}`);

    // Send a message to the user with their user ID and referral ID
    ctx.reply(`Welcome! Your user ID is ${userId} and you joined through referral ID: ${referralId}`);
});

// Start the bot
bot.launch()
    .then(() => console.log('Bot is running...'))
    .catch(err => {
        console.error('Failed to start bot:', err);
    });

module.exports = bot;
