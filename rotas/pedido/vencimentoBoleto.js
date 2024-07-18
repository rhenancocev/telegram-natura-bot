var enviarMensagens = require('../../tools/enviarMensagens');
var funcoes = require('../../tools/funcoes');
const acesso = require('../../tokenAcesso/acesso');
var bot = require('../../tokenAcesso/serverTelegramBot');
var PessoasAutorizadas = acesso.pessoasAutorizadas;
var vencboleto = require('../../src/vencboleto');

// / boleto - mostra data de vencimento do boleto e cancelamento do pedido
bot.onText(/\/boleto/, (ctx, match) => {
    const chatId = ctx.chat.id;
    const texto = ctx.text;
    var autorizado = funcoes.autorizacao(PessoasAutorizadas, chatId);
    var num_pedido = texto.substring(7);
    var validacaoTexto = ctx.text.split(" ");
    const x = "/boleto";
    const y = "numero do pedido";

    if (validacaoTexto[0] === '/boleto') {
        if (num_pedido === '') {
            enviarMensagens.enviarRespostaCasoVazia(ctx, x, y);
        } else {

            if (!funcoes.isNumber(num_pedido)) {
                enviarMensagens.enviarRespostaIfNotNumber(ctx, num_pedido, y);
            } else if (autorizado) {
                vencboleto.venc_boleto(ctx, bot, num_pedido);
            } else {
                funcoes.autorizacaoNegada(ctx);
            }
        }
    }
});
