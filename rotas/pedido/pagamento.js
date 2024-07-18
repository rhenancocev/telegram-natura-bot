var enviarMensagens = require('../../tools/enviarMensagens');
var funcoes = require('../../tools/funcoes');
const acesso = require('../../tokenAcesso/acesso');
var bot = require('../../tokenAcesso/serverTelegramBot');
var PessoasAutorizadas = acesso.pessoasAutorizadas;
var meioPagamento = require('../../src/meioPagamento');

// / pagamento - verifica qual foi o meio de pagamento um determinado pedido foi finalizado
bot.onText(/\/pagamento/, (ctx, match) => {
    const chatId = ctx.chat.id;
    const texto = ctx.text;
    var autorizado = funcoes.autorizacao(PessoasAutorizadas, chatId);
    var meioPagamentoPedido = texto.substring(10);
    var validacaoTexto = ctx.text.split(" ");
    const x = "/pagamento";
    const y = "numero do pedido";

    if (validacaoTexto[0] === '/pagamento') {
        if (meioPagamentoPedido === '') {
            enviarMensagens.enviarRespostaCasoVazia(ctx, x, y);
        } else {
            if (!funcoes.isNumber(meioPagamentoPedido)) {
                enviarMensagens.enviarRespostaIfNotNumber(ctx, meioPagamentoPedido, y);
            } else if (autorizado) {
                meioPagamento.meio_pagamento(ctx, bot, meioPagamentoPedido);
            } else {
                funcoes.autorizacaoNegada(ctx);
            }
        }
    }

});
