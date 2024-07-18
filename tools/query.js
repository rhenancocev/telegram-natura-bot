const env = require('../tokenAcesso/.env');
const TelegramBot = require('node-telegram-bot-api');
// replace the value below with the Telegram token you receive from @BotFather

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(env.token, { polling: false });

module.exports = {

	queryBuscarToken: function(param){
		var BuscarToken = `SELECT PK_PAGSEGURO as PAGSEGURO
							FROM (SELECT AUT.PK_PAGSEGURO
									FROM SISMPGTO.T_CADASTRO_MPOS CAD,                         
		  				 				 SISMPGTO.T_NOTIFICACAO   NOTI,
		  				 				 SISMPGTO.T_AUTORIZACAO   AUT
									WHERE CAD.CD_CADASTRO_MPOS = NOTI.CD_CADASTRO_MPOS
				  						  AND AUT.CD_NOTIFICACAO = NOTI.CD_NOTIFICACAO
				  						  AND CAD.CD_CONSULTORA = ${param}
							ORDER BY CAD.DT_CRIACAO DESC)
							WHERE ROWNUM=1`;
		return BuscarToken;
	},

	queryPedidosDia: function(param){
		var PedidosDia = `select TRUNC(DT_FINALIZACAO_PEDIDO, 'DD') as DIA, 
		count(NM_PEDIDO) as PEDIDOS, 
		p.fl_pedido_natura as ID_MARCA,
		DECODE(p.fl_pedido_natura, 1 ,'NATURA', 0 ,'AVON') as MARCA
		from SISCPT.PEDIDO p
		where trunc(p.DT_FINALIZACAO_PEDIDO) > (sysdate - 10)
		and trunc(p.DT_FINALIZACAO_PEDIDO) < trunc(sysdate + 1)
		and p.ID_SITUACAO_PEDIDO in (3, 17)
		and p.fl_pedido_natura in (${param})
		and p.nm_ciclo_pedido in (select co.nm_ciclo_operacional 
									from siscpt.t_ciclo_operacional co
									where co.cd_tipo_estrutura_comercial = 0 
										  and trunc(sysdate) between trunc(co.dt_inicio_ciclo) 
										  and trunc (co.dt_termino_ciclo)
										  and co.nm_ciclo_operacional = p.nm_ciclo_pedido)
		and p.cd_canal_captacao IN (1, 8, 11)
		group by TRUNC(p.DT_FINALIZACAO_PEDIDO, 'DD'), p.fl_pedido_natura
		order by 1 asc`;
	return PedidosDia;
	},

	queryPedidosHora: function(param){
		var PedidosHora = `select TRUNC(p.DT_FINALIZACAO_PEDIDO, 'HH24') as HORA, 
		count(p.NM_PEDIDO) as PEDIDOS,
		p.fl_pedido_natura as ID_MARCA,
		DECODE(p.fl_pedido_natura, 1 ,'NATURA', 0 ,'AVON') as MARCA
		from SISCPT.PEDIDO p
		where trunc(p.DT_FINALIZACAO_PEDIDO) = trunc(sysdate)
			and p.ID_SITUACAO_PEDIDO in (3, 17)
			and p.fl_pedido_natura in (${param})
			and p.nm_ciclo_pedido in (select co.nm_ciclo_operacional 
											from siscpt.t_ciclo_operacional co
											where co.cd_tipo_estrutura_comercial = 0 
												and trunc(sysdate) between trunc(co.dt_inicio_ciclo) 
												and trunc (co.dt_termino_ciclo)
												and co.nm_ciclo_operacional = p.nm_ciclo_pedido)
			and p.cd_canal_captacao IN (1, 8, 11)
			group by TRUNC(p.DT_FINALIZACAO_PEDIDO, 'HH24'), p.fl_pedido_natura
			order by 1 asc`;
	return PedidosHora;
	},

	queryPedidosMinuto: function(param){
		var PedidosMinuto = `select TRUNC(p.DT_FINALIZACAO_PEDIDO, 'MI') as MINUTO, 
			count(p.NM_PEDIDO) as PEDIDOS,
			p.fl_pedido_natura as ID_MARCA,
			DECODE(p.fl_pedido_natura, 1 ,'NATURA', 0 ,'AVON') as MARCA 
			from SISCPT.PEDIDO p
			where p.DT_FINALIZACAO_PEDIDO >= (sysdate -1/24)
				and p.DT_FINALIZACAO_PEDIDO <= (sysdate +1/24)
				and p.ID_SITUACAO_PEDIDO in (3, 17)
				and p.fl_pedido_natura in (${param})
				and p.nm_ciclo_pedido in (select co.nm_ciclo_operacional 
												from siscpt.t_ciclo_operacional co
												where co.cd_tipo_estrutura_comercial = 0 
													and trunc(sysdate) between trunc(co.dt_inicio_ciclo) 
													and trunc (co.dt_termino_ciclo)
													and co.nm_ciclo_operacional = p.nm_ciclo_pedido)
				and p.cd_canal_captacao IN (1, 8, 11)
				group by TRUNC(p.DT_FINALIZACAO_PEDIDO, 'MI'), p.fl_pedido_natura
				order by 1 asc`;
		return PedidosMinuto;
	},

	queryAutorizacaoBraspag: function(param){
		var AutorizacaoBraspag = `select p.id_order as NM_PEDIDO, 
										ts.dt_transacao as DATA_TRANSACAO,
										p.vr_pagamento as VALOR_PAGAMENTO,
										ts.ds_mensagem_adquirente as MOTIVO_CANCELAMENTO
								  from sispgt.pagamentos p, 
			 						   sispgt.transacao_status ts
								  where p.id_trans_payload = ts.id_trans_payload
			  							and p.id_order = ${param}`;

		return AutorizacaoBraspag;
	},

	queryLucratividade: function(param){
		var lucratividade = `select replace (round ((sum(ip.vl_unitario_tabela) - sum(ip.vl_unitario_sem_lucratividade))/sum(ip.vl_unitario_tabela),2)*100,'.','')||'%' as LUCRATIVIDADE,
										ip.nm_pedido as PEDIDO,
										nc.no_nivel as NIVEL_PEDIDO_FINALIZADO,
										p.qt_ponto_pedido as PONTUACAO_PEDIDO,
										ip.nm_ciclo_pedido as CICLO
									from siscpt.item_pedido ip,
	   									siscpt.pedido_niveis_cn nc,
	   									siscpt.pedido p 
									where ip.nm_pedido = ${param}
										and p.nm_pedido = ip.nm_pedido
										and p.nm_ciclo_pedido = ip.nm_ciclo_pedido
										and ip.id_origem_item_pedido = 1
										and ip.nm_pedido = nc.nm_pedido
										and ip.nm_ciclo_pedido = nc.nm_ciclo_pedido
										and (ip.vl_unitario_tabela - ip.vl_unitario_sem_lucratividade)/ip.vl_unitario_tabela > 0
										group by ip.nm_pedido, NC.NO_NIVEL, ip.nm_ciclo_pedido,p.qt_ponto_pedido`;
		return lucratividade;
	},

	queryPontuacao: function(param){
		var pontuacao = `SELECT CC.CD_PESSOA as CD_PESSOA, 
								TPF.NO_COMPLETO as NO_COMPLETO, 
								(CC.QT_PONTO_CREDITO_TOTAL - CC.QT_PONTO_CREDITO_COMPROMETIDO) AS QT_PONTO_DISPONIVEL,
								CN.NO_NIVEL_ATUAL AS NIVEL,
								CC.PC_CREDITO_EXCEDENTE || '%' AS PC_CREDITO_EXCEDENTE,
								CC.PC_CREDITO_ADICIONAL || '%' AS PC_CREDITO_ADICIONAL,
								CC.QT_PONTO_CREDITO_COMPROMETIDO AS CREDITO_COMPROMETIDO,
								round((CC.QT_PONTO_CREDITO_TOTAL * CC.PC_CREDITO_EXCEDENTE/100)+ CC.QT_PONTO_CREDITO_TOTAL,0) - CC.QT_PONTO_CREDITO_COMPROMETIDO as CREDITO_TOTAL_EXCEDENTE,
								round((CC.QT_PONTO_CREDITO_TOTAL * CC.PC_CREDITO_ADICIONAL/100)+ CC.QT_PONTO_CREDITO_TOTAL,0) - CC.QT_PONTO_CREDITO_COMPROMETIDO as CREDITO_TOTAL_ADICIONAL,  
								round((CC.QT_PONTO_CREDITO_TOTAL * (CC.PC_CREDITO_EXCEDENTE + CC.PC_CREDITO_ADICIONAL)/100)+ CC.QT_PONTO_CREDITO_TOTAL,0) - CC.QT_PONTO_CREDITO_COMPROMETIDO as CREDITO_TOTAL_ADI_EXCE
  						FROM SISCPT.CONSULTORA_CAPTACAO CC,
	   						 SISCAD.T_PESSOA_FISICA TPF,
	   						 SISCPT.CONSULTORA_NIVEIS CN
  						WHERE CC.CD_PESSOA = TPF.CD_PESSOA
							  AND CC.CD_PESSOA = CN.CD_PESSOA
							  AND DT_TERMINO_NIVEL_ATUAL IS NULL
							  AND CC.CD_PESSOA = ${param}`;
		return pontuacao;
	},

	queryStatusPedido: function(param){
		var statusPedido = `select nm_pedido as PEDIDO,
								   	decode (id_situacao_pedido, 
								   			1, 'Em Andamento',
								   			2, 'Captação Cancelada',
								   			3, 'Captado OK',
											4, 'Pendente Débito Atrasado',
											5, 'Pendente Limite Crédito',
											6, 'Pendente Estoque',
											7, 'Pendente de confirmação de pagamento',
											8, 'Pendente Débito Lim.Crédi',
											9, 'Pendente Débito Estoque',
											10, 'Pendente Crédito Estoque',
											11, 'Pend Déb Crédito Estoque',
											12, 'Cancelado por Débito',
											13, 'Cancelado por Crédito',
											14, 'Cancelado por CN',
											15, 'Cancelado "SAP"',
											16, 'Cancelado por pt.mínimos',
											17, 'Enviado para Faturamento',
											18, 'Em Análise de Crédito',
											19, 'Passível de Recuperação',
											20, 'Passível de Remoção',
											24, 'Cancelado por não aprovação' ) as STATUS_PEDIDO, 
									nm_ciclo_pedido as CICLO_PEDIDO,
									decode (cd_sistema_origem,
											1, 'CONECTA',
											4, 'CAPTA WEB',
											5, 'APP NATURA',
											NULL, 'CAPTA CAN') as SISTEMA_ORIGEM
									from siscpt.pedido 
									where nm_pedido = ${param}
										  and cd_canal_captacao <> 16`;
		return statusPedido;
	},

	queryVencBoleto: function(param){
		var vencBoleto = `select trunc(dt_cancelamento_pedido) as DATA, 
								 nm_pedido as PEDIDO,
								 dt_vencimento_boleto as DATA_BOLETO
							from siscpt.pedido_dados_pagamento 
							where nm_pedido = ${param}
								  and cd_forma_pagamento = 'ZVIS'`;
		return vencBoleto;
	},

	queryMeioPagamento: function(param){
		var meioPagamento = `SELECT PDP.NM_PEDIDO AS NM_PEDIDO,
									PDP.CD_FORMA_PAGAMENTO_ORIGINAL AS CD_FORMA_PAGAMENTO_ORIGINAL, 
									FPC.DC_FORMA_PAGAMENTO as DC_FORMA_PAGAMENTO_ORIGINAL,
			   						DECODE (PDP.ID_TROCA_BOLETO, 1, 'TROCA BOLETO ATIVO', 0, 'TROCA BOLETO DESATIVADO') AS ID_TROCA_BOLETO,
									PDP.CD_FORMA_PAGAMENTO AS CD_FORMA_PAGAMENTO, 
									(SELECT PC.DC_FORMA_PAGAMENTO 
											FROM SISCPT.FORMA_PAGAMENTO_CAPTACAO PC 
					 						WHERE PC.CD_FORMA_PAGAMENTO = PDP.CD_FORMA_PAGAMENTO) AS DC_FORMA_PAGAMENTO
		
 							FROM SISCPT.PEDIDO_DADOS_PAGAMENTO PDP,
	 							 SISCPT.FORMA_PAGAMENTO_CAPTACAO FPC
							WHERE FPC.CD_FORMA_PAGAMENTO = PDP.CD_FORMA_PAGAMENTO_ORIGINAL
								   AND PDP.NM_PEDIDO = ${param}`;
		return meioPagamento;
	},

	querySegmentacaoParcelamentoBoleto: function(param){
		var grupoSegmentoBoletoParc = `select pkey_src_pessoa as CD_PESSOA,
		decode (CD_GRUPO_SEGMENTACAO, 200223001, '200223001 - Parcelamento Boleto/Cartão PERFUMARIA', 
						  200265001, '200265001 - Parcelamento Boleto/Cartão',
						  200417001, '200417001 - Box Capta 5% de desconto') AS GRUPO_SEGMENTO,
		DT_INICIO_PARTICIPACAO AS DT_INICIO_PARTICIPACAO,
		DT_FIM_PARTICIPACAO AS DT_FIM_PARTICIPACAO,
		DT_ULTIMA_ATUALIZ_SRC AS DT_ATUALIZACAO,
		decode (CD_GRUPO_SEGMENTACAO, 200223001, 'Segmento - 200223001', 200265001, 'Segmento - 200265001', 200417001, 'Segmento - 200417001' ) AS SEGMENTO
	  from sisprm.c_l_segmentacao_ps 
	  where pkey_src_pessoa = ${param}
	and cd_grupo_segmentacao in (200223001,200265001,200417001)`
		return grupoSegmentoBoletoParc
	},

	querySegmentacaoLucratividadeEmpresarias: function(param){
		var grupoSegmentoLucraEmpre = `with seg as
										(select max(cd_grupo_segmentacao) 
												cd_grupo_segmentacao, 
												pkey_src_pessoa
		   									from sisprm.c_l_segmentacao_ps ps
		  									where cd_grupo_segmentacao like '200258%'
												and pkey_src_pessoa = ${param}
		  									group by pkey_src_pessoa)
	   									select seg.pkey_src_pessoa AS CD_PESSOA,
			  									seg.cd_grupo_segmentacao AS GRUPO_SEGMENTO,
			  									gs.no_grupo_segmentacao AS NOME_GRUPO_SEGMENTO,
			  									gs.dc_grupo_segmentacao AS DESCRICAO_GRUPO_SEGMENTO,
			  									sp.dt_inicio_participacao AS DT_INICIO_PARTICIPACAO,
			  									sp.dt_fim_participacao AS DT_FIM_PARTICIPACAO,
			  									sp.dt_ultima_atualiz_src AS DT_ATUALIZACAO
										 from sisprm.c_l_r_grupo_segmentacao gs, 
										 		sisprm.c_l_segmentacao_ps sp, seg
										 where gs.cd_segmentacao = '200258'
		  										and gs.cd_grupo_segmentacao = seg.cd_grupo_segmentacao
		  										and sp.pkey_src_pessoa = seg.pkey_src_pessoa
		 										and sp.cd_grupo_segmentacao = seg.cd_grupo_segmentacao`
		return grupoSegmentoLucraEmpre;
	},


	queryDesaplicaPromocao: function(param){
		var desaplicaPromocao =  `select promo.nm_pedido as NM_PEDIDO,
										promo.cd_consultora as CD_CONSULTORA,
										p.cd_promocao || ' - ' || p.no_promocao AS PROMOCAO_DESAPLICADA
 									from siscpt.historico_prom_desaplicad promo,
	  									sisprm.promocao p
 									where promo.nm_pedido = ${param}
 										and promo.cd_promocao = p.cd_promocao
										 and promo.nm_versao_promocao = p.nm_versao_promocao`;
		return desaplicaPromocao;
	},

	queryViradaRobo: function(){
		var robo = `SELECT EVENTO.DC_EVENTO AS EVENTO,
		PROCESSO.DC_PROCESSO AS PROCESSO,
		'('||PERIODO.CD_ESTRUTURA_COMERCIAL||') '||ESTRUTURA_GV.NO_ESTRUTURA_COMERCIAL AS GV,
		'('||SETOR.CD_ESTRUTURA_COMERCIAL||') '||ESTRUTURA_SETOR.NO_ESTRUTURA_COMERCIAL AS SETOR,                     
		( SELECT TEC_AUX.CD_RESP_ESTRUTURA_COMERCIAL 
		  FROM SISCAD.T_ESTRUTURA_COMERCIAL TEC_AUX
		  WHERE TEC_AUX.CD_TIPO_ESTRUTURA_COMERCIAL = 4
		  AND TEC_AUX.CD_ESTRUTURA_COMERCIAL = SETOR.CD_ESTRUTURA_COMERCIAL
		  AND ROWNUM = 1) AS COD_GDN,
		SETOR.ID_SITUACAO_ANALISE AS SEMAFORO,
		DECODE (SETOR.ID_SITUACAO_ANALISE, 0, 'Não foi iniciado', 1, 'Em andamento', 2, 'Autorizado', 4, 'Processado') AS SITUACAO_SETOR,
		PERIODO.DT_EXECUCAO_ROBO AS DATA_EFETIVACAO,
		NVL (PRE_PEDIDOS.TOTAL_PRE_PEDIDOS, 0) AS QT_PRE_PEDIDO,
		PERIODO.DT_TERMINO_ALTERACAO AS DATA_LIMITE_AJUSTE
	   FROM SISCAD.M_ESTRUTURA_COMERCIAL_CAD ESTRUTURA_GV,
		SISCAD.M_ESTRUTURA_COMERCIAL_CAD ESTRUTURA_SETOR ,
		SISCNT.PRE_EVENTO EVENTO                         ,
		SISCNT.PRE_PERIODO_PROCESSO_GV PERIODO           ,
		SISCNT.PRE_PROCESSO PROCESSO                     ,
		SISCNT.PRE_LISTA_SETOR SETOR                     ,
		(SELECT PRE_PED.CD_LISTA_SETOR                   ,
			COUNT (DISTINCT PRE_PED.NM_PRE_PEDIDO) TOTAL_PRE_PEDIDOS
		   FROM SISCNT.PRE_PEDIDO PRE_PED
		  WHERE PRE_PED.NM_CICLO_PEDIDO        >= 202001
			AND PRE_PED.ID_SITUACAO_PRE_PEDIDO in (3)
			AND PRE_PED.ID_VERSAO_PRE_PEDIDO   =
			(SELECT MAX (AUX_PRE_PED.ID_VERSAO_PRE_PEDIDO)
			   FROM SISCNT.PRE_PEDIDO AUX_PRE_PED
			  WHERE PRE_PED.NM_PRE_PEDIDO   = AUX_PRE_PED.NM_PRE_PEDIDO
				AND PRE_PED.NM_CICLO_PEDIDO = AUX_PRE_PED.NM_CICLO_PEDIDO
			)
			AND PRE_PED.CD_PESSOA NOT BETWEEN 87 AND 127
	   GROUP BY PRE_PED.CD_LISTA_SETOR
		) PRE_PEDIDOS
	  WHERE EVENTO.CD_EVENTO                     = PROCESSO.CD_EVENTO
		AND PROCESSO.CD_EVENTO_PROCESSO          = PERIODO.CD_EVENTO_PROCESSO
		AND PERIODO.CD_PERIODO                   = SETOR.CD_PERIODO
		AND TRUNC(PERIODO.DT_TERMINO_ALTERACAO) = TRUNC(SYSDATE)
		AND (PERIODO.CD_TIPO_ESTRUTURA_COMERCIAL = ESTRUTURA_GV.CD_TIPO_ESTRUTURA_COMERCIAL)
		AND (PERIODO.CD_ESTRUTURA_COMERCIAL      = ESTRUTURA_GV.CD_ESTRUTURA_COMERCIAL)
		AND (SETOR.CD_TIPO_ESTRUTURA_COMERCIAL   = ESTRUTURA_SETOR.CD_TIPO_ESTRUTURA_COMERCIAL)
		AND (SETOR.CD_ESTRUTURA_COMERCIAL        = ESTRUTURA_SETOR.CD_ESTRUTURA_COMERCIAL)
		AND EVENTO.NM_CICLO_EVENTO               > 202001
		AND PRE_PEDIDOS.CD_LISTA_SETOR(+)        = SETOR.CD_LISTA_SETOR
	   AND PERIODO.CD_ESTRUTURA_COMERCIAL not IN (00)
	   and EVENTO.DC_EVENTO like '%Estratégia%'
	   and SETOR.ID_SITUACAO_ANALISE not in (2,4)
	   and PRE_PEDIDOS.TOTAL_PRE_PEDIDOS > 0
	ORDER BY EVENTO.CD_EVENTO         ,
		PROCESSO.CD_EVENTO_PROCESSO   ,
		PERIODO.CD_ESTRUTURA_COMERCIAL,
		SETOR.CD_ESTRUTURA_COMERCIAL`;
		return robo;
	},

	queryValidaCupom: function(param){
		var validaCupom = `SELECT DISTINCT p.NM_PEDIDO,
		p.CD_CONSULTORA AS CN,
		p.DT_FINALIZACAO_PEDIDO,
		ip.CD_VENDA_KIT,
		p.NM_CICLO_PEDIDO,
		dp.nm_documento_pessoa AS CPF,  
		CASE 
		  WHEN ip.CD_VENDA_KIT = 90366 
			THEN 'SIM' 
			  ELSE 'NAO' 
		END AS kit_destaque 
		FROM siscpt.PEDIDO p,
		SISCPT.ITEM_PEDIDO IP,
		SISCAD.T_DOCUMENTO_PESSOA DP 
		WHERE p.NM_PEDIDO = ip.NM_PEDIDO 
		AND ip.NM_CICLO_PEDIDO = p.NM_CICLO_PEDIDO 
		AND p.DT_FINALIZACAO_PEDIDO IS NOT NULL 
		AND ip.CD_VENDA_KIT IN (90366,90457,89584,89585,00245,00246,07713,07725,105122)
		AND p.CD_CONSULTORA in (${param})
		AND p.ID_SITUACAO_PEDIDO = 17 
		AND dp.cd_pessoa = CD_CONSULTORA 
		AND dp.cd_tipo_documento = 1`
		return validaCupom;
	},

	queryListaEstrategia: function (param) {
		var extracao = `SELECT
		bloq.dt_inicio_vigencia AS DT_INICIO_BLOQUEIO,
		bloq.dt_termino_vigencia AS DT_TERMINO_BLOQUEIO,
		bloq.cd_canal_captacao AS CANAL,
		bloq.dt_parametro AS DT_ABERTURA,
		ev.dc_evento as EVENTO,
		bloq.dc_motivo_parametro AS MOTIVO,
		tpf.no_completo USUARIO,
		bloq.dt_ultima_atualizacao DT_ATUALIZACAO,
		gm.no_estrutura_comercial AS DC_GM,
		gm.cd_estrutura_comercial AS CD_GM,
		re.no_estrutura_comercial AS DC_RE,
		re.cd_estrutura_comercial AS CD_RE,
		gv.no_estrutura_comercial AS DC_GV,
		gv.cd_estrutura_comercial AS CD_GV,
		st.no_estrutura_comercial AS DC_ST,
		st.cd_estrutura_comercial AS CD_ST
   FROM SISCPT.t_bloqueio_estrategia bloq,
		SISCPT.t_evento_estrategia ev,
		SISCAD.t_pessoa_fisica tpf,
		(select filhos.*
		   from SISCAD.t_estrutura_comercial ec,
				SISCAD.t_estrutura_comercial filhos
		  where ec.cd_tipo_estrutura_comercial = 0--i_cd_tp_estrutura_comercial
			and ec.cd_estrutura_comercial = 1--i_cd_estrutura_comercial
			and ((filhos.cd_estrutura_comercial = ec.cd_estrutura_comercial
				  and ec.cd_tipo_estrutura_comercial = 5)
				 or (filhos.cd_setor = ec.cd_estrutura_comercial
					 and ec.cd_tipo_estrutura_comercial = 4)
				 or (filhos.cd_gerencia_venda = ec.cd_estrutura_comercial
					 and ec.cd_tipo_estrutura_comercial = 3)
				 or (filhos.cd_regiao_estrategica = ec.cd_estrutura_comercial
					 and ec.cd_tipo_estrutura_comercial = 2)
				 or (filhos.cd_gerencia_mercado = ec.cd_estrutura_comercial
					 and ec.cd_tipo_estrutura_comercial = 1)
				 or (ec.cd_tipo_estrutura_comercial = 0))
					 and filhos.id_estrutura_ativa = 1) ec,
		SISCAD.t_estrutura_comercial gm,
		SISCAD.t_estrutura_comercial re,
		SISCAD.t_estrutura_comercial gv,
		SISCAD.t_estrutura_comercial st
  WHERE bloq.cd_usuario_atualizacao = tpf.cd_pessoa(+)
	AND bloq.cd_evento_estrategia = ev.cd_evento
	AND BLOQ.CD_EVENTO_ESTRATEGIA = ${param}
	AND bloq.cd_tipo_estrutura_comercial = ec.cd_tipo_estrutura_comercial
	AND bloq.cd_estrutura_comercial = ec.cd_estrutura_comercial
	AND 1 = gm.cd_tipo_estrutura_comercial (+)
	AND ec.cd_gerencia_mercado = gm.cd_estrutura_comercial (+)
	AND 2 = re.cd_tipo_estrutura_comercial (+)
	AND ec.cd_regiao_estrategica = re.cd_estrutura_comercial (+)
	AND 3 = gv.cd_tipo_estrutura_comercial (+)
	AND ec.cd_gerencia_venda = gv.cd_estrutura_comercial (+)
	AND 4 = st.cd_tipo_estrutura_comercial (+)
	AND ec.cd_setor = st.cd_estrutura_comercial (+)
  GROUP BY bloq.nm_sequencia_param_captacao,
		   bloq.cd_tipo_parametro_captacao,
		   bloq.cd_tipo_estrutura_comercial,
		   bloq.cd_estrutura_comercial,
		   bloq.dt_inicio_vigencia,
		   bloq.dt_termino_vigencia,
		   bloq.cd_nivel,
		   bloq.cd_centro,
		   bloq.cd_canal_captacao,
		   bloq.dt_parametro,
		   bloq.cd_evento_estrategia,
		   ev.dc_evento,
		   bloq.dc_motivo_parametro,
		   tpf.no_completo,
		   bloq.dt_ultima_atualizacao,
		   ec.cd_estrutura_comercial,
		   ec.no_estrutura_comercial,
		   gm.no_estrutura_comercial,
		   gm.cd_estrutura_comercial,
		   re.no_estrutura_comercial,
		   re.cd_estrutura_comercial,
		   gv.no_estrutura_comercial,
		   gv.cd_estrutura_comercial,
		   st.no_estrutura_comercial,
		   st.cd_estrutura_comercial
  ORDER BY bloq.nm_sequencia_param_captacao`
  return extracao;
	},

	queryAcesso: function(param){
		var acesso = `select chatid as CHATID from acessoYoda where chatid in(${param})`
		return acesso;
	},

	queryComposicaoKit: function(param){
		var composicaoKit = `SELECT 
		DADOS.COD_VENDA_PAI AS COD_VENDA_PAI,
		DADOS.PONTUCAO_KIT AS PONTUCAO_KIT,
		DADOS.PRECO_KIT AS PRECO_KIT,
		DADOS.DESCRICAO_PAI AS DC_PRODUTO_PAI, 
		DADOS.COD_VENDA_FILHO AS COD_VENDA_FILHO, 
		DADOS.DESCRICAO_FILHO AS DC_PRODUTO_FILHO, 
		DADOS.QUANTIDADE_FILHO AS QT_KIT
		FROM 
		(SELECT 
			 DISTINCT(PROD.CD_PRODUTO) AS PRODUTO,
			 PROD.CD_VENDA_PRODUTO COD_VENDA_PAI,
			 P.QT_PONTOS_KIT AS PONTUCAO_KIT,
			 P.VL_PRECO_LISTA_KIT AS PRECO_KIT,
			 PROD.CD_PRODUTO,
			 PROD.DC_PRODUTO AS DESCRICAO_PAI,
			 PROD1.CD_VENDA_PRODUTO AS COD_VENDA_FILHO , 
			 PROD1.CD_PRODUTO, 
			 PROD1.DC_PRODUTO AS DESCRICAO_FILHO,
			 KIT.QT_ITEM_KIT AS QUANTIDADE_FILHO
		   FROM SISEF.T_PRODUTO PROD, 
		   SISEF.T_KIT_PRODUTOS KIT,  
		   SISEF.T_PRODUTO PROD1, 
		   SISGCP.T_RELACAO_VENDA_MATERIAL RL,
		   SISGCP.T_PI_PRECO_CN_KIT P
		WHERE PROD.CD_PRODUTO = KIT.CD_PRODUTO
		AND PROD1.CD_PRODUTO = KIT.CD_ITEM_KIT
		AND PROD.CD_PRODUTO = RL.CD_PRODUTO
		AND prod.CD_VENDA_PRODUTO = P.CD_VENDA_PRODUTO 
		AND PROD.CD_VENDA_PRODUTO = ${param}
		AND RL.NM_PRIORIDADE = 1
		)dados`
		return composicaoKit;
	},

	queryExtracaoBloqueioEvento: function(){
		var relatorio = `SELECT a.nm_adiantamento AS ID,
		b.nm_capa_lote AS CAPA_LOTE,
		CAST(a.dt_solicitacao AS DATE) AS DATA_SOLICITACAO,
		a.nm_matricula_colaborador AS MATRICULA,
		a.vl_adiantamento AS VALOR,
		a.dc_finalidade AS FINALIDADE,
		a.cd_setor_colaborador AS SETOR,
		a.cd_centro_custo AS CENTRO_DE_CUSTO,
		DECODE(a.id_adiantamento, '1', 'Por Mes', 'Por Evento') AS TIPO,
		DECODE(a.nm_ciclo, '0', 'Evento', a.nm_ciclo) AS CICLO,
		a.id_situacao AS SIT,
		CASE a.id_situacao
		  WHEN 0 THEN
		   CAST(a.dt_solicitacao AS DATE)
		  WHEN 1 THEN
		   CAST(a.dt_solicitacao AS DATE)
		  WHEN 2 THEN
		   CAST(greatest(a.dt_ultima_atualizacao,
						 NVL(a.dt_aprovacao, a.dt_ultima_atualizacao)) AS DATE)
		  WHEN 3 THEN
		   CAST(greatest(a.dt_ultima_atualizacao,
						 NVL(a.dt_integracao_sap, a.dt_ultima_atualizacao)) AS DATE)
		  WHEN 4 THEN
		   CASE NVL(b.id_situacao, -1)
			 WHEN 0 THEN
			  CAST(b.dt_cadastramento AS DATE)
			 WHEN 6 THEN
			  CAST(b.dt_ultima_atualizacao AS DATE)
			 ELSE
			  CAST(greatest(a.dt_ultima_atualizacao,
							NVL(a.dt_credito, a.dt_ultima_atualizacao)) AS DATE)
		   END
		  WHEN 5 THEN
		   CAST(a.dt_ultima_atualizacao AS DATE)
		  WHEN 6 THEN
		   CASE NVL(b.id_situacao, -1)
			 WHEN 7 THEN
			  CAST(greatest(b.dt_ultima_atualizacao,
							NVL(b.dt_integracao_sap, b.dt_ultima_atualizacao)) AS DATE)
			 ELSE
			  CAST(b.dt_ultima_atualizacao AS DATE)
		   END
		  WHEN 7 THEN
		   CAST(greatest(a.dt_integracao_sap,
						 NVL(a.dt_aprovacao, a.dt_ultima_atualizacao)) AS DATE)
		  WHEN 8 THEN
		   CAST(a.dt_ultima_atualizacao AS DATE)
		END AS DATA_REFERENCIA,
		CASE a.id_situacao
		  WHEN 0 THEN
		   'Novo'
		  WHEN 1 THEN
		   'Aguardando APROVACAO'
		  WHEN 2 THEN
		   'Adiantamento aprovado (a Enviar ao SAP)'
		  WHEN 3 THEN
		   'Enviado para o SAP (aguardar Efetuar CREDITO)'
		  WHEN 4 THEN
		   'CREDITO efetuado'
		  WHEN 5 THEN
		   'Cancelado'
		  WHEN 6 THEN
		   'Credito efetuado, PRESTACAO em analise'
		  WHEN 7 THEN
		   'Processado pelo SAP'
		  WHEN 8 THEN
		   'Com Pendencia (regra de bloqueio - pendencia de prestacao de conta anterior)'
		  WHEN 9 THEN
		   'Erro do SAP'
		END AS SITUACAO_ADIANTAMENTO,
		b.id_situacao AS SIT2,
		CASE NVL(b.id_situacao, -1)
		  WHEN -1 THEN
		   'Prestacao de contas pendente'
		  WHEN 0 THEN
		   'Prestacao de contas em digitacao.'
		  WHEN 1 THEN
		   'Digitacao concluida (cria Tarefa de Recebimento de Malote no BPM)'
		  WHEN 2 THEN
		   'Malote recebido (cria Tarefa de Conferencia de Documentos)'
		  WHEN 3 THEN
		   'Prestacao de contas em analise'
		  WHEN 4 THEN
		   'Prestacao de contas Aprovada'
		  WHEN 5 THEN
		   'Enviado para o SAP.'
		  WHEN 6 THEN
		   'Prestacao de contas Reprovada'
		  WHEN 7 THEN
		   'Processado pelo SAP (status final)'
		  WHEN 8 THEN
		   'Irregularidade na Prestacao de Contas'
		END AS SITUACAO_CAPA_LOTE,
		CASE a.id_situacao
		  WHEN 0 THEN
		   'Novo'
		  WHEN 1 THEN
		   'Pendente aprovacao do adiantamento'
		  WHEN 2 THEN
		   'Pendente envio do adiantamento para o SAP'
		  WHEN 3 THEN
		   'Pendente confirmacao do adiantamento pelo SAP (efetuar credito)'
		  WHEN 4 THEN
		   CASE NVL(b.id_situacao, -1)
			 WHEN -1 THEN
			  'Pendente GR iniciar prestacao de contas'
			 WHEN 0 THEN
			  'Pendente GR finalizar prestacao de contas'
			 WHEN 6 THEN
			  'Pendente GR refazer prestacao de contas'
			 ELSE
			  'Status inesperado: capa lote em status ' || b.id_situacao ||
			  ' para adiantamento no status 4 (credito efetuado)'
		   END
		  WHEN 5 THEN
		   'Adiantamento rejeitado'
		  WHEN 6 THEN
		   CASE NVL(b.id_situacao, -1)
			 WHEN -1 THEN
			  'Status inesperado: Capa Lote inexistente para adiantamento no status 6 (Prestacao em Analise pelo CSC)'
			 WHEN 1 THEN
			  'Pendente recebimento do malote pelo CSC'
			 WHEN 2 THEN
			  'Pendente analise/conferencia pelo CSC'
			 WHEN 3 THEN
			  'Pendente analise/conferencia pelo CSC'
			 WHEN 4 THEN
			  'Pendente envio da contabilizacao para o SAP'
			 WHEN 5 THEN
			  'Pendente confirmacao de finalizacao da contabilizacao pelo SAP'
			 WHEN 6 THEN
			  'Pendente GR refazer prestacao de contas'
			 WHEN 7 THEN
			  'Processo finalizado'
			 ELSE
			  'Status inesperado: capa lote em status ' || b.id_situacao ||
			  ' para adiantamento no status 6 (Prestacao em Analise pelo CSC)'
		   END
		  WHEN 7 THEN
		   CASE
			 WHEN b.nm_capa_lote IS NULL THEN
			  'Status indevido. Verificar com CSC/Alessandra se credito foi executado no SAP. Caso positivo, atualizar adiantamento.id_situacao para 4'
			 ELSE
			  'Status inesperado: capa lote em status ' || b.id_situacao ||
			  ' para adiantamento no status 7 (Processado pelo SAP)'
		   END
		  WHEN 8 THEN
		   'Pendente prestar contas anteriores (Regra de Bloqueio)'
		END AS SITUACAO_DO_PROCESSO,
		TRUNC(sysdate -
			  (CASE a.id_situacao
				WHEN 0 THEN
				 CAST(a.dt_solicitacao AS DATE)
				WHEN 1 THEN
				 CAST(a.dt_solicitacao AS DATE)
				WHEN 2 THEN
				 CAST(greatest(a.dt_ultima_atualizacao,
							   NVL(a.dt_aprovacao, a.dt_ultima_atualizacao)) AS DATE)
				WHEN 3 THEN
				 CAST(greatest(a.dt_ultima_atualizacao,
							   NVL(a.dt_integracao_sap,
								   a.dt_ultima_atualizacao)) AS DATE)
				WHEN 4 THEN
				 CASE NVL(b.id_situacao, -1)
				   WHEN 0 THEN
					CAST(b.dt_cadastramento AS DATE)
				   WHEN 6 THEN
					CAST(b.dt_ultima_atualizacao AS DATE)
				   ELSE
					CAST(greatest(a.dt_ultima_atualizacao,
								  NVL(a.dt_credito, a.dt_ultima_atualizacao)) AS DATE)
				 END
				WHEN 5 THEN
				 CAST(a.dt_ultima_atualizacao AS DATE)
				WHEN 6 THEN
				 CASE NVL(b.id_situacao, -1)
				   WHEN 7 THEN
					CAST(greatest(b.dt_ultima_atualizacao,
								  NVL(b.dt_integracao_sap,
									  b.dt_ultima_atualizacao)) AS DATE)
				   ELSE
					CAST(b.dt_ultima_atualizacao AS DATE)
				 END
				WHEN 7 THEN
				 CAST(greatest(a.dt_integracao_sap,
							   NVL(a.dt_aprovacao, a.dt_ultima_atualizacao)) AS DATE)
				WHEN 8 THEN
				 CAST(a.dt_ultima_atualizacao AS DATE)
			  END),
			  2) AS AGING
   FROM sisapc.adiantamento a, sisapc.capa_lote b
  WHERE b.nm_adiantamento(+) = a.nm_adiantamento
  AND 
  id_adiantamento = 2
  and a.id_situacao = 8
  ORDER BY A.dt_solicitacao DESC`
  return relatorio;
	},

	queryConsultaValePonto: function(param){
		var vp = `SELECT 
		PE.CD_CONSULTORA AS CD_CONSULTORA,
		P.CD_PROMOCAO AS CD_PROMOCAO,
		P.NO_PROMOCAO AS NO_PROMOCAO,
		GR.VL_QUANTIDADE_REQUISITO AS VL_QUANTIDADE_REQUISITO,
		SP.QT_LIMITE_USO_STEP AS QT_LIMITE_USO_STEP,
		SUM(VPP.QT_VALE_PONTO) AS QT_VALE_PONTO,
		SP.QT_LIMITE_USO_STEP - (SUM(VPP.QT_VALE_PONTO)) as LIMITE_CICLO,
		vpp.nm_ciclo_processamento as CICLO
		FROM SISCPT.VALE_PONTO_PROCESSADO VPP, 
			 SISPRM.GRUPO_REQUISITO GR,
			 SISPRM.PROMOCAO P,
			 SISPRM.STEP_PROMOCAO SP,
			 SISCPT.PEDIDO PE
		WHERE GR.CD_PROMOCAO = P.CD_PROMOCAO
		AND GR.NM_VERSAO_PROMOCAO = P.NM_VERSAO_PROMOCAO
		AND GR.CD_PROMOCAO = SP.CD_PROMOCAO
		AND GR.NM_VERSAO_PROMOCAO = SP.NM_VERSAO_PROMOCAO
		AND GR.NM_STEP = SP.NM_STEP
		AND VPP.CD_PROMOCAO_GERADOR = P.CD_PROMOCAO
		AND VPP.NM_VERSAO_PROMOCAO_GERADOR = P.NM_VERSAO_PROMOCAO
		AND SP.NM_STEP = VPP.NM_STEP_GERADOR
		AND SP.NM_SEQ_FILHA = VPP.NM_SEQ_FILHA_GERADOR
		AND PE.NM_PEDIDO = VPP.NM_PEDIDO_CONQUISTA
		AND PE.NM_CICLO_PEDIDO = VPP.NM_CICLO_PEDIDO_CONQUISTA
		AND PE.CD_CANAL_CAPTACAO IN (1,8,11)
		AND PE.ID_SITUACAO_PEDIDO IN (1,3,4,5,7,8,17)
		AND PE.NM_CICLO_PEDIDO >= (SELECT MIN(B.NM_CICLO_OPERACIONAL) FROM SISCAD.T_CICLO_OPERACIONAL B 
		WHERE  B.CD_ESTRUTURA_COMERCIAL = 1
		AND B.CD_TIPO_ESTRUTURA_COMERCIAL = 0 AND B.NM_SEQUENCIA_CICLO IN(
		SELECT MIN(A.NM_SEQUENCIA_CICLO)  FROM SISCAD.T_CICLO_OPERACIONAL A 
		WHERE SYSDATE BETWEEN A.DT_INICIO_CICLO AND A.DT_TERMINO_CICLO 
		AND A.CD_ESTRUTURA_COMERCIAL = 1
		AND A.CD_TIPO_ESTRUTURA_COMERCIAL = 0))
		AND GR.CD_GRUPO = 107
		AND PE.CD_CONSULTORA = ${param}
		GROUP BY
		PE.CD_CONSULTORA,
		P.CD_PROMOCAO,
		P.NO_PROMOCAO,
		GR.VL_QUANTIDADE_REQUISITO,
		SP.QT_LIMITE_USO_STEP,
		vpp.nm_ciclo_processamento`
		return vp;
	}

    
}
