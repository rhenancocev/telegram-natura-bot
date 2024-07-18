var enviarMensagens = require('../../tools/enviarMensagens');
var funcoes = require('../../tools/funcoes');
const acesso = require('../../tokenAcesso/acesso');
var bot = require('../../tokenAcesso/serverTelegramBot');
var PessoasAutorizadas = acesso.pessoasAutorizadas;
var segmentoParcelamentoBoleto = require('../../src/segmentacao_Parcelamento_Boleto');


// / segmento - mostra se a CN está na segmentação de parcelamento de boleto
bot.onText(/\/segmento/, (ctx, match) => {
    const chatId = ctx.chat.id;
    const texto = ctx.text;
    var autorizado = funcoes.autorizacao(PessoasAutorizadas, chatId);
    var cd_pessoa = texto.substring(9);
    var validacaoTexto = ctx.text.split(" ");
    const x = "/segmento";
    const y = "Cód Pessoa";

    if (validacaoTexto[0] === '/segmento') {
        if (cd_pessoa === '') {
            enviarMensagens.enviarRespostaCasoVazia(ctx, x, y);
        } else {

            if (!funcoes.isNumber(cd_pessoa)) {
                enviarMensagens.enviarRespostaIfNotNumber(ctx, cd_pessoa, y);
            } else if (autorizado) {
                segmentoParcelamentoBoleto.segmento_Parcelamento_Boleto(ctx, bot, cd_pessoa);
            } else {
                funcoes.autorizacaoNegada(ctx);
            }
        }

    }

});
