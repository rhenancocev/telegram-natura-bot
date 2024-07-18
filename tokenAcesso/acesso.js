const env = require('../tokenAcesso/.env');
const TelegramBot = require('node-telegram-bot-api');
// replace the value below with the Telegram token you receive from @BotFather

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(env.token, { polling: false });

var pessoasAutorizadas = [6462936742,986734908,1127517553,965206264,1001063238,1058385769,981193445,1656522185,1130732037,963771377,113729009,1109948361,1132290868,998943740,746048496,1041570349,1147122360,800110808,1466923394,6421055669,1269553620,717829587,670468351,621550962,747336031,1118975423];

    module.exports = {

    pessoasAutorizadas
}