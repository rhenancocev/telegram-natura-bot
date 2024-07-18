var request = require('request');

module.exports = {
    apiCupom: function (ctx,bot,key,cn) {
        var chatid = ctx.chat.id;
        var url = 'http://auxapi.rede.natura.net/rest/model/natura/api/PainelCndActor/getCoupons?cpf='+key;
        request.post({url}, function(err,httpResponse,body){ 
            //console.log(JSON.parse(body));
            if(err){
                bot.sendMessage(chatid,"erro tecnico de conexão");
            }else{
                try {
                    var arquivoJson = JSON.parse(body);
                    var arquivo = "";
                    var count = "------- CUPOM ";
        
                    for(var i=0; i < arquivoJson["coupons"].length;i++){
        
                        if(arquivoJson["coupons"][i]["description"] === "Ganhe R$20 para compras acima de R$69 no Espaço CND." || arquivoJson["coupons"][i]["description"] === "Ganhe R$10 para compras acima de R$49 no Espaço CND."){
                            arquivo += //count+(i+1) + " -------\n\n" 
                            "Consultora: " + cn
                            + "\n\n" + "Data inicio: " + arquivoJson["coupons"][i]["startDate"]
                            + "\n\n" + "Descrição do cupom: " + arquivoJson["coupons"][i]["description"] 
                            + "\n\n" + "Código do cupom: " + arquivoJson["coupons"][i]["couponCode"] 
                            + "\n\n" + "Use até : " + arquivoJson["coupons"][i]["useLimit"] + "x"
                            + "\n\n" + "Cupom expira em : " + arquivoJson["coupons"][i]["endDate"]
                            + "\n\n" + "---------------------------------------------------\n\n\n" 
                        } else{
                           console.log("")
                        }
  
                    }
                        bot.sendMessage(chatid,"<b>Cupons da consultora de nº "+ cn + ": </b>\n\n" + arquivo,{parse_mode: "HTML" });
                } catch (error) {
                    bot.sendMessage(chatid, "A consultora consultora de nº "+ cn + "não tem CUPONS disponíveis, Favor abrir chamado para o time da SysMap");
                    //console.log(error);
                    
                }

           }
        })
    }
}