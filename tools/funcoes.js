const env = require('../tokenAcesso/.env');
const TelegramBot = require('node-telegram-bot-api');
// replace the value below with the Telegram token you receive from @BotFather

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(env.token, { polling: false });

module.exports = {
    isNumber: function (n){
        return !isNaN(parseFloat(n)) && isFinite(n);
    },

    autorizacao: function (PessoasAutorizadas, chatId){
        var autorizado = false
        for (i=0; i<PessoasAutorizadas.length;i++){
            if (chatId == PessoasAutorizadas[i]){
                autorizado = true;
            }
        }
        return autorizado;
    },

    sleep: function (ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    autorizacaoNegada: function (ctx){
        const chatId = ctx.chat.id;
        const nome = ctx.from.first_name;
        bot.sendMessage(chatId, nome + ", eu não sou autorizado a te responder." 
        + "\nQualquer dúvida, acionar a <b>sustentação da Sysmap</b>, informando o seu ChatId: " 
        + '<code>' + chatId + '</code>', { parse_mode: "HTML" });
    },
    manutencao: function (ctx){
        const chatId = ctx.chat.id;
        const nome = ctx.from.first_name;
        bot.sendMessage(chatId, nome + ", este comando está em manutenção." 
        + "\nQualquer dúvida, acionar a <b>sustentação da Sysmap</b>.", { parse_mode: "HTML" });
    }
}
