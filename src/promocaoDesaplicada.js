var oracledb = require('oracledb');
var dbConfig = require('../banco/dbconfig.js');
var sqlutil = require('../banco/sqlutil.js');
var query = require('../tools/query');
const moment = require('moment');

module.exports = {


  desaplica_promocao: function (ctx, bot, param) {

    var sql_query = query.queryDesaplicaPromocao(param);

    sqlutil.executar_sql_o44prdg(sql_query, ctx, bot, this);

  },

  fetchRowsFromRS: function (connection, resultSet, numRows, ctx, bot) {
    resultSet.getRows(
      numRows,  // get this many rows


      function (err, rows) {
        var retorno                     = "";
        var retornoPedido               = "";
        var retornoConsultora           = "";
        var retornoPromoDesaplicada     = "";


        if (err) {
          console.error(err);
          doClose(connection, resultSet);   // always close the ResultSet
        } else if (rows.length <= 0){
          console.log("fetchRowsFromRS(): Got " + rows.length + " rows");
          
          retorno += "O pedido está cancelado ou não existe no nosso banco de dados"
          bot.sendMessage(ctx.chat.id, "" + retorno);
        } 
        else if (rows.length > 0) {
          console.log("fetchRowsFromRS(): Got " + rows.length + " rows");

          retornoPedido += rows[0].NM_PEDIDO;
          retornoConsultora += rows[0].CD_CONSULTORA;

          for (var i = 0; i < rows.length; i++) {
            
            retornoPromoDesaplicada += rows[i].PROMOCAO_DESAPLICADA + '\n\n';
          }

          console.log('Numero do Pedido: ' + retorno);
          bot.sendMessage(ctx.chat.id, "Pedido: " + "<b>" + retornoPedido + "</b>"
                                     + "\n\nCódigo da consultora: " + "<b>" + retornoConsultora + "</b>"
                                     + "\n\nPromoções não aceitas pela CN: \n\n" + "<b>" + retornoPromoDesaplicada + "</b>"
                                     , { parse_mode: "HTML" });

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
    function (err) {
      if (err) {
        console.error(err.message);
      }
    });
}

function doClose(connection, resultSet) {
  resultSet.close(
    function (err) {
      if (err) { console.error(err.message); }
      doRelease(connection);
    });
}