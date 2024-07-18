var enviarMensagens = require('../../tools/enviarMensagens');
var funcoes = require('../../tools/funcoes');
const acesso = require('../../tokenAcesso/acesso');
var bot = require('../../tokenAcesso/serverTelegramBot');
var PessoasAutorizadas = acesso.pessoasAutorizadas;
var autorizacaoBraspag = require('../../src/autorizacaoBraspag');

// / cartao - mostra o status de aprovacao/reprovacao do cartao que foi feito o pedido
bot.onText(/\/cartao/, (ctx, match) => {
    const chatId = ctx.chat.id;
    const texto = ctx.text;
    var autorizado = funcoes.autorizacao(PessoasAutorizadas, chatId);
    var nm_pedido = texto.substring(7);
    var validacaoTexto = ctx.text.split(" ");
    const x = "/cartao";
    const y = "numero do pedido";
    if (validacaoTexto[0] === '/cartao') {
        if (nm_pedido === '') {
            enviarMensagens.enviarRespostaCasoVazia(ctx, x, y);
        } else {
            if (!funcoes.isNumber(nm_pedido)) {
                enviarMensagens.enviarRespostaIfNotNumber(ctx, nm_pedido, y);
            } else if (autorizado) {
                autorizacaoBraspag.braspag(ctx, bot, nm_pedido);
            } else {
                funcoes.autorizacaoNegada(ctx);
            }
        }
    }
});
