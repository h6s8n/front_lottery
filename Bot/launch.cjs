const bot = require('./bot.cjs');

bot.launch()
    .then(() => console.log('Bot is running with proxy...'))
    .catch(err => {
        console.error('Failed to start bot with proxy:', err);
    }); 