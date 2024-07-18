var sqlutil = require('../banco/sqlutil.js');
var query = require('../tools/query');
const moment = require('moment');

module.exports = {

/*
 * pedidos_dia - Listar quantidade de pedidos dos últimos 30 dias
 */
	pedidos_hora: async function(ctx, bot, enviaImagem, enviaDocumento, id_marca)  {
	
		var sql_query = query.queryPedidosHora(id_marca);

		
	sqlutil.executar_sql_o44prdg(sql_query, ctx, bot, this, enviaImagem, enviaDocumento);
},


fetchRowsFromRS: function (connection, resultSet, numRows, ctx, bot, enviaImagem, enviaDocumento) {
	var chatId = ctx.chat.id;
	var nome = ctx.from.first_name;
	var corpoDocumento = "";

	  resultSet.getRows(
	    numRows,  // get this many rows
	    function (err, rows) {
	      if (err) {
	        console.error(err);
	        doClose(connection, resultSet);   // always close the ResultSet
	      } else if (rows.length > 0) {
	        console.log("fetchRowsFromRS(): Got " + rows.length + " rows");
			
	        var eixoX = [];
	        var eixoY = [];
			
			var controle_marca = rows[0].ID_MARCA 

			if (controle_marca == 1){
				controle_marca = 'Natura'
			}else{
				controle_marca = 'Avon'
			}

			var header="HORA" + "\;" + "QTD PEDIDOS HORA" + "\;" + "MARCA" + "\n"
	        
			for (var i = 0; i < rows.length; i++) {

				eixoX[i] = moment(rows[i].HORA).format('h:mm a');
				eixoY[i] = rows[i].PEDIDOS;
				corpoDocumento += moment(rows[i].HORA).format('h:mm a') + '\;' 
				+ rows[i].PEDIDOS + '\;' + rows[i].MARCA +  '\n';
			}

			var fs = require("fs");

			//DOCUMENTO
			if (enviaDocumento){
				var fs = require("fs");
				var file = 'qtd_pedidos_hora.csv';
				var data = header+corpoDocumento;
				const encoding = 'utf8';
				const callback = (err) => {if (err) throw err}
				fs.writeFileSync(file, data, encoding, callback)
				bot.sendDocument(chatId, file);
			}
			
			if (enviaImagem) {
				//GRÁFICO
			    var plotly = require('plotly')("cidalhi", "Omi3mOW713dypAiQnbsp");
			    var trace1 = {
			      x: eixoX,
			      y: eixoY,
			      type: "bar",
			      mode:'lines+markers'
			    };
			    
			    let layout = {  // Chart Layout
			            title: nome + ': Pedidos ' + controle_marca + ' por Hora de hoje',   // Chart Title
			            xaxis: {
			                title: 'Hora'    // X axis title
			            },
			            yaxis: {
			              title: 'Pedidos'  // Y axis title
			            }
			        };
	
			    var figure = { 'data': [trace1], layout: layout  };
	
			    var imgOpts = {
			        format: 'png',
			        width: 1000,
			        height: 500
			    };
			    
			    var fileName = 'hora' + chatId + '.png';
	
			    plotly.getImage(figure, imgOpts, function (error, imageStream) {
			        if (error) return;
			        
			        var fileStream = fs.createWriteStream(fileName);
				        
				        fileStream.on('finish', async () => {
					     	  await bot.sendMediaGroup(chatId, [
					     	        {
					     	          type: 'photo',
					     	          //media: layout
					     	          media: fileName,
					     	        },
					     	      ], {
					     	        disable_notification: true,
					     	      });
				        	});
				        imageStream.pipe(fileStream);   
			    });
			};

			if (rows.length === numRows)      // might be more rows
	          fetchRowsFromRS(connection, resultSet, numRows);
	        else
	        	doClose(connection, resultSet); // always close the ResultSet
	      } else { // no rows
	    	  doClose(connection, resultSet);   // always close the ResultSet
	      }
	    });
	}

};

//Note: connections should always be released when not needed
function doRelease(connection) {
  connection.close(
    function(err) {
      if (err) {
        console.error(err.message);
      }
    });
}

function doClose(connection, resultSet) {
	  resultSet.close(
	    function(err) {
	      if (err) { console.error(err.message); }
	      doRelease(connection);
	    });
	}

