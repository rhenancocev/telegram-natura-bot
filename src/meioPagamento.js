var oracledb = require('oracledb');
var dbConfig = require('../banco/dbconfig.js');
var sqlutil = require('../banco/sqlutil.js');
var query = require('../tools/query');
const moment = require('moment');

module.exports = {


  meio_pagamento: function (ctx, bot, param) {

    var sql_query = query.queryMeioPagamento(param);

    sqlutil.executar_sql_o44prdg(sql_query, ctx, bot, this);

  },

  fetchRowsFromRS: function (connection, resultSet, numRows, ctx, bot) {
    resultSet.getRows(
      numRows,  // get this many rows


      function (err, rows) {
        var retorno                             = "";
        var retornoPedido                       = "";
        var retornoDCFormaPagamentoOriginal     = "";
        var retornoIDTrocaBoleto                = "";
        var retornoDCFormaPagamento             = "";

        if (err) {
          console.error(err);
          doClose(connection, resultSet);   // always close the ResultSet
        } else if (rows.length <= 0){
          console.log("fetchRowsFromRS(): Got " + rows.length + " rows");
          
          retorno += "O pedido está Em andamento ou não existe no nosso banco de dados"
          bot.sendMessage(ctx.chat.id, "" + retorno);
        } 
        else if (rows.length > 0) {
          console.log("fetchRowsFromRS(): Got " + rows.length + " rows");

          
          for (var i = 0; i < rows.length; i++) {
            retornoPedido                       += rows[i].NM_PEDIDO;
            retornoDCFormaPagamentoOriginal     += rows[i].DC_FORMA_PAGAMENTO_ORIGINAL;
            retornoIDTrocaBoleto                += rows[i].ID_TROCA_BOLETO;
            retornoDCFormaPagamento             += rows[i].DC_FORMA_PAGAMENTO;

          }

          console.log('Numero do Pedido: ' + retorno);
          bot.sendMessage(ctx.chat.id, "Pedido: " + "<b>" + retornoPedido + "</b>"
                                     + "\n\nForma de pagamento original: " + "<b>" + retornoDCFormaPagamentoOriginal + "</b>"
                                     + "\n\nFlag troca boleto: " + "<b>" + retornoIDTrocaBoleto + "</b>"
                                     + "\n\nForma de pagamento atual: " + "<b>" + retornoDCFormaPagamento + "</b>", { parse_mode: "HTML" });

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