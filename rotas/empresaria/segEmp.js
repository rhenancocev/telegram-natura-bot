var segmentoLucraEmpresaria = require('../../src/segmentacao_Lucratividade_Empresaria');
var enviarMensagens = require('../../tools/enviarMensagens');
var funcoes = require('../../tools/funcoes');
const acesso = require('../../tokenAcesso/acesso');
var bot = require('../../tokenAcesso/serverTelegramBot');
var PessoasAutorizadas = acesso.pessoasAutorizadas;

// /segEmp - verificar segmentação de lucratividade de empresarias
bot.onText(/\/segEmp/, (ctx, match) => {
    const chatId = ctx.chat.id;
    const texto = ctx.text;
    var autorizado = funcoes.autorizacao(PessoasAutorizadas, chatId);
    var lucraEmpresarias = texto.substring(7);
    var validacaoTexto = ctx.text.split(" ");
    const x = "/segEmp";
    const y = "código da consultora";

    if (validacaoTexto[0] === '/segEmp') {
        if (lucraEmpresarias === '') {
            enviarMensagens.enviarRespostaCasoVazia(ctx, x, y);
        } else {
            if (!funcoes.isNumber(lucraEmpresarias)) {
                enviarMensagens.enviarRespostaIfNotNumber(ctx, lucraEmpresarias, y);
            } else if (autorizado) {
                segmentoLucraEmpresaria.segmento_Lucratividade_Empresarias(ctx, bot, lucraEmpresarias);
            } else {
                funcoes.autorizacaoNegada(ctx);
            }
        }
    }
});