var enviarMensagens = require('../tools/enviarMensagens');
var funcoes = require('../tools/funcoes');
const acesso = require('../tokenAcesso/acesso');
var bot = require('../tokenAcesso/serverTelegramBot');
var PessoasAutorizadas = acesso.pessoasAutorizadas;
var enviarMensagens = require('../tools/enviarMensagens');

bot.onText(/\/help/, (ctx, match) => {
    var validacaoTexto = ctx.text.split(" ");
    const chatId = ctx.chat.id;
    var autorizado = funcoes.autorizacao(PessoasAutorizadas, chatId);

    if (validacaoTexto[0] === '/help') {
         if(autorizado){
            enviarMensagens.help(ctx);
        }else{
            funcoes.autorizacaoNegada(ctx);
        }
    };
});
