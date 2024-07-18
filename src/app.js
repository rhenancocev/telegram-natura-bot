//fix do problema ode-telegram-bot-api deprecated Automatic enabling of cancellation of promises is deprecated.
process.env.NTBA_FIX_319 = 1;
//import das rotas
const segEmp = require('../rotas/empresaria/segEmp')
const lucra = require('../rotas/pedido/lucra')
const cupom = require('../rotas/consultora/cupom')
const desaplica = require('../rotas/pedido/desaplica')
const pagamento = require('../rotas/pedido/pagamento')
const status = require('../rotas/pedido/statusPedido')
const cartao = require('../rotas/pedido/cartao')
const pts = require('../rotas/consultora/pontosConsultora')
const segmento = require('../rotas/consultora/segCN')
const boleto = require('../rotas/pedido/vencimentoBoleto')
const pedido_dia = require('../rotas/pedido/pedidosDia')
const pedido_hora = require('../rotas/pedido/pedidosHora')
const pedido_minuto = require('../rotas/pedido/pedidosMinuto')
const consulta_vale_ponto = require('../rotas/consultora/consultaValePontoRouter')
const robo = require('../rotas/pedido/roboConecta')
const kit = require('../rotas/pedido/kit')
const help = require('../rotas/defaut');
//fix do problema GMT node-telegram-bot-api deprecated In the future, content-type of files you send will default to "application/octet-stream"
process.env["NTBA_FIX_350"] = 1;


// Create a bot that uses 'polling' to fetch new updates
const bot = require ('../tokenAcesso/serverTelegramBot');

//outros imports 
var enviarMensagens = require('../tools/enviarMensagens');

bot.on('text', (ctx) => {

    //console.log('ctx', ctx);

    espaco = ctx.text.split(" ");
    var comando = espaco[0];

    switch (comando) {
        case '/start': enviarMensagens.enviarBoasVindas(ctx);
            break;
        case '/help': help;
            break;
        case '/boleto': boleto;
            break;
        case '/cartao': cartao;
            break;
        case '/robo': robo;
            break;
        case '/consultavp' : consulta_vale_ponto;
            break;
        case '/cupom': cupom;
            break;
        case '/status': status;
            break;
        case '/lucra': lucra;
            break;
        case '/kit': kit;
            break;
        case '/pts': pts;
            break;
        case '/segEmp': segEmp;
            break;
        case '/segmento': segmento;
            break;
        case '/pagamento': pagamento;
            break;
        case '/desaplica': desaplica;
            break;
        case '/pedidos_dia': pedido_dia;
            break;
        case '/pedidos_hora': pedido_hora;
            break;
        case '/pedidos_minuto': pedido_minuto;
            break;
        default: enviarMensagens.help(ctx);;
            //console.log(comando)
    }

});
