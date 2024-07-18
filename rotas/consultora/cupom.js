var enviarMensagens = require('../../tools/enviarMensagens');
var funcoes = require('../../tools/funcoes');
const acesso = require('../../tokenAcesso/acesso');
var bot = require('../../tokenAcesso/serverTelegramBot');
var PessoasAutorizadas = acesso.pessoasAutorizadas;
var apiCupom = require('../../src/validaUserCupom');


//verificar cupom
bot.onText(/\/cupom/, (ctx, match) => {
    const chatId = ctx.chat.id;
    const texto = ctx.text;
    var autorizado = funcoes.autorizacao(PessoasAutorizadas, chatId);
    var cupom = texto.substring(7);
    var validacaoTexto = ctx.text.split(" ");
    const x = "/cupom";
    const y = "cód da consultora";

    if (validacaoTexto[0] === '/cupom') {
        if (cupom === '') {
            enviarMensagens.enviarRespostaCasoVazia(ctx, x, y);
        } else {
            //if (!funcoes.isNumber(cupom)) {
            //    enviarMensagens.enviarRespostaIfNotNumber(ctx, cupom, y);
            //} else 
            if (autorizado) {
               // lucratividade.lucratividade_pedido(ctx, bot, cupom);
                apiCupom.cupom(ctx,bot,cupom);
            } else {
                funcoes.autorizacaoNegada(ctx);
            }
        }
    }

});