var enviarMensagens = require('../../tools/enviarMensagens');
var funcoes = require('../../tools/funcoes');
const acesso = require('../../tokenAcesso/acesso');
var bot = require('../../tokenAcesso/serverTelegramBot');
var PessoasAutorizadas = acesso.pessoasAutorizadas;
var consultaValePonto = require('../../src/consultaValePonto');


//verificar cupom
bot.onText(/\/consultavp/, (ctx, match) => {
    const chatId = ctx.chat.id;
    const texto = ctx.text;
    var autorizado = funcoes.autorizacao(PessoasAutorizadas, chatId);
    var consultora = texto.substring(12);
    var validacaoTexto = ctx.text.split(" ");
    const x = "/consultavp";
    const y = "cód da consultora";

    if (validacaoTexto[0] === '/consultavp') {
        if (consultora === '') {
            enviarMensagens.enviarRespostaCasoVazia(ctx, x, y);
        } else {
            if (!funcoes.isNumber(consultora)) {
                enviarMensagens.enviarRespostaIfNotNumber(ctx, consultora, y);
            } else if (autorizado) {
                consultaValePonto.consulta_vale_ponto(ctx,bot,consultora)
            } else {
                funcoes.autorizacaoNegada(ctx);
            }
        }
    }

});