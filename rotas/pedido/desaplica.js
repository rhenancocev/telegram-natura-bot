var enviarMensagens = require('../../tools/enviarMensagens');
var funcoes = require('../../tools/funcoes');
const acesso = require('../../tokenAcesso/acesso');
var bot = require('../../tokenAcesso/serverTelegramBot');
var PessoasAutorizadas = acesso.pessoasAutorizadas;
var promocaoDesaplicada = require('../../src/promocaoDesaplicada')

// / desaplica -  mostra as promoções que foram desaplicadas
bot.onText(/\/desaplica/, (ctx, match) => {
    const chatId = ctx.chat.id;
    const texto = ctx.text;
    var autorizado = funcoes.autorizacao(PessoasAutorizadas, chatId);
    var desaplicapedido = texto.substring(10);
    var validacaoTexto = ctx.text.split(" ");
    const x = "/desaplica";
    const y = "numero do pedido";

    if (validacaoTexto[0] === '/desaplica') {
        if (desaplicapedido === '') {
            enviarMensagens.enviarRespostaCasoVazia(ctx, x, y);
        } else {
            if (!funcoes.isNumber(desaplicapedido)) {
                enviarMensagens.enviarRespostaIfNotNumber(ctx, desaplicapedido, y);
            } else if (autorizado) {
                promocaoDesaplicada.desaplica_promocao(ctx, bot, desaplicapedido);
            } else {
                funcoes.autorizacaoNegada(ctx);
            }
        }
    }

});
