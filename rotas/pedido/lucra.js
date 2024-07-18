var enviarMensagens = require('../../tools/enviarMensagens');
var funcoes = require('../../tools/funcoes');
const acesso = require('../../tokenAcesso/acesso');
var bot = require('../../tokenAcesso/serverTelegramBot');
var PessoasAutorizadas = acesso.pessoasAutorizadas;
var lucratividade = require('../../src/lucratividade');

// / lucra -  mostra a lucratividade e nivel do pedido que foi finalizado
bot.onText(/\/lucra/, (ctx, match) => {
    const chatId = ctx.chat.id;
    const texto = ctx.text;
    var autorizado = funcoes.autorizacao(PessoasAutorizadas, chatId);
    var lucraPedido = texto.substring(6);
    var validacaoTexto = ctx.text.split(" ");
    const x = "/lucra";
    const y = "numero do pedido";

    if (validacaoTexto[0] === '/lucra') {
        if (lucraPedido === '') {
            enviarMensagens.enviarRespostaCasoVazia(ctx, x, y);
        } else {
            if (!funcoes.isNumber(lucraPedido)) {
                enviarMensagens.enviarRespostaIfNotNumber(ctx, lucraPedido, y);
            } else if (autorizado) {
                lucratividade.lucratividade_pedido(ctx, bot, lucraPedido);
            } else {
                funcoes.autorizacaoNegada(ctx);
            }
        }
    }

});
