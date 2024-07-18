var enviarMensagens = require('../../tools/enviarMensagens');
var funcoes = require('../../tools/funcoes');
const acesso = require('../../tokenAcesso/acesso');
var bot = require('../../tokenAcesso/serverTelegramBot');
var PessoasAutorizadas = acesso.pessoasAutorizadas;
var statusPedido = require('../../src/statusPedido');

// /status - mostra o status atual de um determinado pedido
bot.onText(/\/status/, (ctx, match) => {
    const chatId = ctx.chat.id;
    const texto = ctx.text;
    var autorizado = funcoes.autorizacao(PessoasAutorizadas, chatId);
    var pedido = texto.substring(8);
    var validacaoTexto = ctx.text.split(" ");
    const x = "/status";
    const y = "numero do pedido";
    if (validacaoTexto[0] === '/status') {
        if (pedido === '') {
            enviarMensagens.enviarRespostaCasoVazia(ctx, x, y);
        } else {
            if (!funcoes.isNumber(pedido)) {
                enviarMensagens.enviarRespostaIfNotNumber(ctx, pedido, y);
            } else if (autorizado) {
                statusPedido.status_ped(ctx, bot, pedido);
            } else {
                funcoes.autorizacaoNegada(ctx);
            }
        }
    }
});
