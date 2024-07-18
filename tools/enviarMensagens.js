const bot = require('../tokenAcesso/serverTelegramBot')
const acesso = require('../tokenAcesso/acesso');
var PessoasAutorizadas = acesso.pessoasAutorizadas;
var funcoes = require('../tools/funcoes');

module.exports = {
    enviarBoasVindas: function(ctx){
        const chatId = ctx.chat.id;
        var autorizado = funcoes.autorizacao(PessoasAutorizadas, chatId);
    if(autorizado){
        const nome = ctx.from.first_name + ' ' + ctx.from.last_name;
    
        // send a message to the chat acknowledging receipt of their message
        bot.sendMessage(chatId, 'ChatId: ' + '<code>' + chatId + '</code>' +'\n\n' + 'Olá ' + nome + ', seja Bem-Vindo.' 
        + '\n\n' + 'Caso seja seu primeiro contato comigo, sugiro que clique aqui -> /help para conhecer os comandos disponiveis.'
          , {parse_mode: "HTML"});
    }else {
        funcoes.autorizacaoNegada(ctx);
    }
    },

        help: function(ctx){
            const chatId = ctx.chat.id;

            var autorizado = funcoes.autorizacao(PessoasAutorizadas, chatId);
            if(autorizado){
                const nome = ctx.from.first_name;
            bot.sendMessage(chatId, 'ChatId: ' + '<code>' + chatId + '</code>' +'\n\n'+ nome + ', os comandos disponíveis são:'
            + '\n\n' + 'Se deseja saber a data de cancelamento de um pedido boleto à vista, utilize o comando:'
            + '\n' + '-> ' + "/boleto <code>numero do pedido</code>" + '\n Exemplo: /boleto <code>123456789</code>'
            + '\n\n' + 'Se deseja saber o motivo do cancelamento de um pedido feito pelo cartão de crédito, utilize o comando:'
            + '\n' + '-> ' + "/cartao <code>numero do pedido</code>" + '\n Exemplo: /cartao <code>123456789</code>'
            + '\n\n' + 'Se deseja saber o status de um pedido, utilize o comando:'
            + '\n' + '-> ' + "/status <code>numero do pedido</code>" + '\n Exemplo: /status <code>123456789</code>'
            + '\n\n' + 'Se deseja saber a % de lucratividade de um pedido finalizado, utilize o comando:'
            + '\n' + '-> ' + "/lucra <code>numero do pedido</code>" + '\n Exemplo: /lucra <code>123456789</code>'
            + '\n\n' + 'Se deseja saber a pontuação disponivel para CN captar um pedido, utilize o comando:'
            + '\n' + '-> ' + "/pts <code>código da consultora</code>" + '\n Exemplo: /pts <code>123456789</code>'
            + '\n\n' + 'Se deseja saber o meio de pagamento que o pedido foi finalizado, utilize o comando:'
            + '\n' + '-> ' + "/pagamento <code>numero do pedido</code>" + '\n Exemplo: /pagamento <code>123456789</code>'
            + '\n\n' + 'Se deseja saber se uma determinada consultora está no grupo segmento para parcelamento de boleto, utilize o comando:'
            + '\n' + '-> ' + "/segmento <code>código da consultora</code>" + '\n Exemplo: /segmento <code>123456789</code>'
            + '\n\n' + 'Se deseja saber se uma determinada empresária está no grupo segmento para lucratividade, utilize o comando:'
            + '\n' + '-> ' + "/segEmp <code>código da consultora</code>" + "\n Exemplo: /segEmp <code>123456789</code>"
            + '\n\n' + 'Se deseja saber quais promoções foram desaplicadas ( não aceitas pela CN), utilize o comando:'
            + '\n' + '-> ' + "/desaplica <code>numero do pedido</code>" + '\n Exemplo: /desaplica <code>123456789</code>'
            + '\n\n' + 'Se deseja saber quais cupons a CND (Consultora digital) tem disponível, utilize o comando:'
            + '\n' + '-> ' + "/cupom <code>código da consultora</code>" + '\n Exemplo: /cupom <code>123456789</code>'
            + '\n\n' + 'Se deseja saber a composição de um KIT, utilize o comando:'
            + '\n' + '-> ' + "/kit <code>código de venda</code>" + '\n Exemplo: /kit <code>123456789</code>'
            + '\n\n' + 'Se deseja saber a quantidade de VP disponível para uma consultora, utilize o comando:'
            + '\n' + '-> ' + "/cosultavp <code>código de consultora</code>" + '\n Exemplo: /cosultavp <code>123456789</code>'


            + '\n\n\n' + "Comandos para extração de gráficos: "
            + '\n\n' + '-> ' + '/pedidos_dia - Pedidos finalizados por dia'
            + '\n\n' + '-> ' + '/pedidos_minuto - Pedidos finalizados por minuto'
            + '\n\n' + '-> ' + '/pedidos_hora - Pedidos finalizados por hora'

            + '\n\n\n' + "Comandos para extração de relatórios: "
            + '\n\n' + '-> ' + '/robo - Extrair quais GDNs faltam para aprovar o conecta', {parse_mode: "HTML"});
        
            }else{
                funcoes.autorizacaoNegada(ctx);
            }

            },

        enviarRespostaCasoVazia: function(ctx, x, y){
        const chatId = ctx.chat.id;
        const nome = ctx.from.first_name;
        bot.sendMessage(chatId, nome + ", digite o comando " + x + " <code>" + y + "</code>." 
                                     + "\n Exemplo: " + x + " 123456789", { parse_mode: "HTML" })
        },

        enviarRespostaIfNotNumber: function(ctx, x, y){
        const chatId = ctx.chat.id;
        const nome = ctx.from.first_name;  
        bot.sendMessage(chatId, nome + ", o texto digitado: " + "<b>" + x + "</b>" 
                                     + ", não é um " + y + " válido!", { parse_mode: "HTML" } )

        },
        enviarMensagemDeEspera: function(ctx){
            const chatId = ctx.chat.id;
            const nome = ctx.from.first_name
            bot.sendMessage(chatId, 'Aguarde ' + nome + ', estamos gerando seu gráfico...');
        },
        enviarMensagemDeEsperaRelatorio: function(ctx){
            const chatId = ctx.chat.id;
            const nome = ctx.from.first_name
            bot.sendMessage(chatId, 'Aguarde ' + nome + ', estamos gerando seu relatório...');
        }

}