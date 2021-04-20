class Hvl {
    constructor() {}
	
	getAllDepa() {
		let sql = 'SELECT * FROM "CFG"."DEP" ORDER BY "DEP_COD"';
		let query = {
			text: sql
		};
		return postgres.query(query);
    }
	
	getDepaById(id) {
		let sql = 'SELECT * FROM "CFG"."REGI" WHERE "ID" = $1';
		let query = {
			text: sql,
			values: [id]
		};
		return postgres.query(query);
    }	
	
	getAllMun() {
		let sql = 'SELECT * FROM "CFG"."MUN" ORDER BY "ID"';
		let query = {
			text: sql
		};
		return postgres.query(query);
    }
	
	getMunById(id) {
		let sql = 'SELECT * FROM "CFG"."MUN" WHERE "DEP_ID" = $1';
		let query = {
			text: sql,
			values: [id]
		};
		return postgres.query(query);
    }
	
	getMunByDepaId(id) {
		let sql = 'SELECT "CFG"."MUN".* FROM "CFG"."MUN" INNER JOIN "CFG"."ASI_REGI_COM" ON "CFG"."COM"."ID" = "CFG"."ASI_REGI_COM"."COM_ID" WHERE "CFG"."ASI_REGI_COM"."REGI_ID" = $1 GROUP BY "CFG"."COM"."ID"';
		let query = {
			text: sql,
			values: [id]
		};
		return postgres.query(query);
    }	
    
    getAllZons() {
		let sql = 'SELECT * FROM "HVL"."ZON" ORDER BY "ID"';
		let query = {
			text: sql
		};
		return postgres.query(query);
    }

	getPersByIde(id) {
		let sql = 'SELECT * FROM "CFG"."PERS" WHERE "PERS_IDE" = $1';
		let query = {
			text: sql,
			values: [id]
		};
		return postgres.query(query);
    }	
    
	getTempByIde(id) {
        let sql = 'SELECT "CFG"."PERS".*, ' +
        '(SELECT "SCM"."ACT_TEMP"."ACT_TEMP_VAL" FROM "SCM"."ACT_TEMP" WHERE "SCM"."ACT_TEMP"."ACT_TEMP_PERS_IDE" = $1 AND "SCM"."ACT_TEMP"."FECHA" = CURRENT_DATE ORDER BY "SCM"."ACT_TEMP"."HORA" LIMIT 1) ' +
        'FROM "CFG"."PERS" WHERE "CFG"."PERS"."PERS_IDE" = $1';
		let query = {
			text: sql,
			values: [id]
		};
		return postgres.query(query);
    }	    
    
    insertEncuesta(values) {        
        let sql = 'SELECT "ENC"."FN_ENC__INSERTAR_PARTICULAR"(\'' + "ENC_COVID" + '\', \'' + JSON.stringify(values) + '\')';
        return postgres.query(sql);
    }

    insertTamizaje(values) {        
        let sql = 'SELECT "ENC"."FN_ENC__INSERTAR_PARTICULAR"(\'' + "ENC_TAM" + '\', \'' + JSON.stringify(values) + '\')';
        return postgres.query(sql);
    }

    insertOficina(values) {        
        let sql = 'SELECT "ENC"."FN_ENC__INSERTAR_PARTICULAR"(\'' + "ENC_OFI" + '\', \'' + JSON.stringify(values) + '\')';
        return postgres.query(sql);
    }    

	getAllEncs() {
        let sql = 'SELECT "CFG"."REGI"."REGI_NOMBRE" AS "REGIONAL", ' +
        '(CASE WHEN "ENC"."ACT_ENC"."ENC_ID" = \'1\' THEN \'CENSO\' ' +
        'WHEN "ENC"."ACT_ENC"."ENC_ID" = \'2\' THEN \'TELETRABAJO\' ELSE \'OFICINA\' END) AS "ENCUESTA", ' +
        'COUNT ( "ENC"."ACT_ENC"."ID" ) AS "TOTAL" ' +
        'FROM "CFG"."PERS" ' +
        'INNER JOIN "ENC"."ACT_ENC" ON "ENC"."ACT_ENC"."ACT_ENC_ENCO_PERS_ID" = "CFG"."PERS"."ID" ' +
        'INNER JOIN "CFG"."REGI" ON "CFG"."PERS"."REGI_ID" = "CFG"."REGI"."ID" ' +
        'GROUP BY 1,2 ORDER BY 2,3';
		let query = {
			text: sql
		};
		return postgres.query(query);
    }

	getEncsById(id, fechaIni, fechaFin) {
        let sql = '';
        if (id === '1') {
            sql = 'SELECT ENC."ID",	ENC."FECHA", ENC."HORA", ENC."ACT_ENC_ENCO_PERS_IDE" AS "IDE_ENCUESTADO", ' +
            'P1."PERS_NOMBRES" AS "NOM_ENCUESTADO", P1."PERS_PRI_APEL" AS "PRI_APE_ENCUESTADO", P1."PERS_SEG_APEL" AS "SEG_APE_ENCUESTADO", ' +
            'RE."REGI_NOMBRE" AS "REGIONAL", ENC."ACT_ENC_BASE" AS "BASE", ENC."ACT_ENC_CARGO" AS "CARGO", ' +
            'ENC."ACT_ENC_ENCO_EDAD" AS "EDAD", ENC."ACT_ENC_ENCO_CEL" AS "CELULAR", ' +
            'P2."PERS_NOMBRES" AS "NOM_ENCUESTADOR", P2."PERS_PRI_APEL" AS "PRI_APE_ENCUESTADOR", P2."PERS_SEG_APEL" AS "SEG_APE_ENCUESTADOR", ' +
            
            '(SELECT RES."PERS_RESP_ACT_COVID_RESP" ' +
            'FROM  "ENC"."PERS_RESP_ACT_COVID" AS RES ' +
            'WHERE RES."PREG_ID" = 1 AND RES."ACT_ENC_ID" = ENC."ID") AS "PREG1_RESPUESTA", ' +
            
            '(SELECT RES."PERS_RESP_ACT_COVID_DET" ' +
            'FROM  "ENC"."PERS_RESP_ACT_COVID" AS RES ' +
            'WHERE RES."PREG_ID" = 1 AND RES."ACT_ENC_ID" = ENC."ID") AS "PREG1_DETALLE", ' +
            
            '(SELECT RES."PERS_RESP_ACT_COVID_OBS" ' +
            'FROM  "ENC"."PERS_RESP_ACT_COVID" AS RES ' +
            'WHERE RES."PREG_ID" = 1 AND RES."ACT_ENC_ID" = ENC."ID") AS "PREG1_OBSERVACION", ' +
            
            '(SELECT RES."PERS_RESP_ACT_COVID_RESP" ' +
            'FROM  "ENC"."PERS_RESP_ACT_COVID" AS RES ' +
            'WHERE RES."PREG_ID" = 2 AND RES."ACT_ENC_ID" = ENC."ID") AS "PREG2_RESPUESTA", ' +
            
            '(SELECT RES."PERS_RESP_ACT_COVID_DET" ' +
            'FROM  "ENC"."PERS_RESP_ACT_COVID" AS RES ' +
            'WHERE RES."PREG_ID" = 2 AND RES."ACT_ENC_ID" = ENC."ID") AS "PREG2_DETALLE", ' +
            
            '(SELECT RES."PERS_RESP_ACT_COVID_OBS" ' +
            'FROM  "ENC"."PERS_RESP_ACT_COVID" AS RES ' +
            'WHERE RES."PREG_ID" = 2 AND RES."ACT_ENC_ID" = ENC."ID") AS "PREG2_OBSERVACION", ' +
            
            '(SELECT RES."PERS_RESP_ACT_COVID_RESP" ' +
            'FROM  "ENC"."PERS_RESP_ACT_COVID" AS RES ' +
            'WHERE RES."PREG_ID" = 3 AND RES."ACT_ENC_ID" = ENC."ID") AS "PREG3_RESPUESTA", ' +
            
            '(SELECT RES."PERS_RESP_ACT_COVID_DET" ' +
            'FROM  "ENC"."PERS_RESP_ACT_COVID" AS RES ' +
            'WHERE RES."PREG_ID" = 3 AND RES."ACT_ENC_ID" = ENC."ID") AS "PREG3_DETALLE", ' +
            
            '(SELECT RES."PERS_RESP_ACT_COVID_OBS" ' +
            'FROM  "ENC"."PERS_RESP_ACT_COVID" AS RES ' +
            'WHERE RES."PREG_ID" = 3 AND RES."ACT_ENC_ID" = ENC."ID") AS "PREG3_OBSERVACION", ' +
            
            '(SELECT RES."PERS_RESP_ACT_COVID_RESP" ' +
            'FROM  "ENC"."PERS_RESP_ACT_COVID" AS RES ' +
            'WHERE RES."PREG_ID" = 4 AND RES."ACT_ENC_ID" = ENC."ID") AS "PREG4_RESPUESTA", ' +
            
            '(SELECT RES."PERS_RESP_ACT_COVID_DET" ' +
            'FROM  "ENC"."PERS_RESP_ACT_COVID" AS RES ' +
            'WHERE RES."PREG_ID" = 4 AND RES."ACT_ENC_ID" = ENC."ID") AS "PREG4_DETALLE", ' +
            
            '(SELECT RES."PERS_RESP_ACT_COVID_OBS" ' +
            'FROM  "ENC"."PERS_RESP_ACT_COVID" AS RES ' +
            'WHERE RES."PREG_ID" = 4 AND RES."ACT_ENC_ID" = ENC."ID") AS "PREG4_OBSERVACION", ' +
        
            '(SELECT RES."PERS_RESP_ACT_COVID_RESP" ' +
            'FROM  "ENC"."PERS_RESP_ACT_COVID" AS RES ' +
            'WHERE RES."PREG_ID" = 5 AND RES."ACT_ENC_ID" = ENC."ID") AS "PREG5_RESPUESTA", ' +
            
            '(SELECT RES."PERS_RESP_ACT_COVID_DET" ' +
            'FROM  "ENC"."PERS_RESP_ACT_COVID" AS RES ' +
            'WHERE RES."PREG_ID" = 5 AND RES."ACT_ENC_ID" = ENC."ID") AS "PREG5_DETALLE", ' +
            
            '(SELECT RES."PERS_RESP_ACT_COVID_OBS" ' +
            'FROM  "ENC"."PERS_RESP_ACT_COVID" AS RES ' +
            'WHERE RES."PREG_ID" = 5 AND RES."ACT_ENC_ID" = ENC."ID") AS "PREG5_OBSERVACION" ' +
       
            'FROM "ENC"."ACT_ENC" ENC ' +
                'INNER JOIN "CFG"."PERS" P1 ON P1."ID" = ENC."ACT_ENC_ENCO_PERS_ID" ' +
                'INNER JOIN "CFG"."PERS" P2 ON P2."ID" = ENC."ACT_ENC_ENCR_PERS_ID" ' +
                'INNER JOIN "CFG"."REGI" RE ON RE."ID" = P1."REGI_ID" ' +
            'WHERE ENC."ENC_ID" = $1 AND ENC."FECHA" BETWEEN $2 AND $3 ' +
            'ORDER BY 8,2,3,4';
        }

        if (id === '2') {
            sql = 'SELECT ENC."ID",	ENC."FECHA", ENC."HORA", ENC."ACT_ENC_ENCO_PERS_IDE" AS "IDE_ENCUESTADO", ' +
            'P1."PERS_NOMBRES" AS "NOM_ENCUESTADO", P1."PERS_PRI_APEL" AS "PRI_APE_ENCUESTADO", P1."PERS_SEG_APEL" AS "SEG_APE_ENCUESTADO", ' +
            'RE."REGI_NOMBRE" AS "REGIONAL", ' +
            
            '(SELECT RES."PERS_RESP_ACT_COVID_RESP" ' +
            'FROM  "ENC"."PERS_RESP_ACT_COVID" AS RES ' +
            'WHERE RES."PREG_ID" = 6 AND RES."ACT_ENC_ID" = ENC."ID") AS "PREG1_RESPUESTA", ' +
                     
            '(SELECT RES."PERS_RESP_ACT_COVID_DET" ' +
            'FROM  "ENC"."PERS_RESP_ACT_COVID" AS RES ' +
            'WHERE RES."PREG_ID" = 6 AND RES."ACT_ENC_ID" = ENC."ID") AS "PREG1_DETALLE", ' +
            
            '(SELECT RES."PERS_RESP_ACT_COVID_OBS" ' +
            'FROM  "ENC"."PERS_RESP_ACT_COVID" AS RES ' +
            'WHERE RES."PREG_ID" = 6 AND RES."ACT_ENC_ID" = ENC."ID") AS "PREG1_OBSERVACION", ' +
            
            '(SELECT RES."PERS_RESP_ACT_COVID_RESP" ' +
            'FROM  "ENC"."PERS_RESP_ACT_COVID" AS RES ' +
            'WHERE RES."PREG_ID" = 7 AND RES."ACT_ENC_ID" = ENC."ID") AS "PREG2_RESPUESTA", ' +
            
            '(SELECT RES."PERS_RESP_ACT_COVID_DET" ' +
            'FROM  "ENC"."PERS_RESP_ACT_COVID" AS RES ' +
            'WHERE RES."PREG_ID" = 7 AND RES."ACT_ENC_ID" = ENC."ID") AS "PREG2_DETALLE", ' +
            
            '(SELECT RES."PERS_RESP_ACT_COVID_OBS" ' +
            'FROM  "ENC"."PERS_RESP_ACT_COVID" AS RES ' +
            'WHERE RES."PREG_ID" = 7 AND RES."ACT_ENC_ID" = ENC."ID") AS "PREG2_OBSERVACION", ' +
            
            '(SELECT RES."PERS_RESP_ACT_COVID_RESP" ' +
            'FROM  "ENC"."PERS_RESP_ACT_COVID" AS RES ' +
            'WHERE RES."PREG_ID" = 8 AND RES."ACT_ENC_ID" = ENC."ID") AS "PREG3_RESPUESTA", ' +
            
            '(SELECT RES."PERS_RESP_ACT_COVID_DET" ' +
            'FROM  "ENC"."PERS_RESP_ACT_COVID" AS RES ' +
            'WHERE RES."PREG_ID" = 8 AND RES."ACT_ENC_ID" = ENC."ID") AS "PREG3_DETALLE", ' +
            
            '(SELECT RES."PERS_RESP_ACT_COVID_OBS" ' +
            'FROM  "ENC"."PERS_RESP_ACT_COVID" AS RES ' +
            'WHERE RES."PREG_ID" = 8 AND RES."ACT_ENC_ID" = ENC."ID") AS "PREG3_OBSERVACION" ' +
                 
            'FROM "ENC"."ACT_ENC" ENC ' +
                'INNER JOIN "CFG"."PERS" P1 ON P1."ID" = ENC."ACT_ENC_ENCO_PERS_ID" ' +
                'INNER JOIN "CFG"."PERS" P2 ON P2."ID" = ENC."ACT_ENC_ENCR_PERS_ID" ' +
                'INNER JOIN "CFG"."REGI" RE ON RE."ID" = P1."REGI_ID" ' +
            'WHERE ENC."ENC_ID" = $1 AND ENC."FECHA" BETWEEN $2 AND $3 ' +
            'ORDER BY 8,2,3,4';
        }

        if (id === '3') {
            sql = 'SELECT ENC."ID",	ENC."FECHA", ENC."HORA", ENC."ACT_ENC_ENCO_PERS_IDE" AS "IDE_ENCUESTADO", ' +
            'P1."PERS_NOMBRES" AS "NOM_ENCUESTADO", P1."PERS_PRI_APEL" AS "PRI_APE_ENCUESTADO", P1."PERS_SEG_APEL" AS "SEG_APE_ENCUESTADO", ' +
            'RE."REGI_NOMBRE" AS "REGIONAL", ' +
            
            '(SELECT (CASE WHEN RES."PERS_RESP_ACT_COVID_RESP" = \'TRUE\' THEN \'SI\' ELSE \'NO\' END) ' +
            'FROM  "ENC"."PERS_RESP_ACT_COVID" AS RES ' +
            'WHERE RES."PREG_ID" = 9 AND RES."ACT_ENC_ID" = ENC."ID") AS "PREG1_RESPUESTA", ' +
                     
            '(SELECT RES."PERS_RESP_ACT_COVID_DET" ' +
            'FROM  "ENC"."PERS_RESP_ACT_COVID" AS RES ' +
            'WHERE RES."PREG_ID" = 9 AND RES."ACT_ENC_ID" = ENC."ID") AS "PREG1_DETALLE", ' +
            
            '(SELECT RES."PERS_RESP_ACT_COVID_OBS" ' +
            'FROM  "ENC"."PERS_RESP_ACT_COVID" AS RES ' +
            'WHERE RES."PREG_ID" = 9 AND RES."ACT_ENC_ID" = ENC."ID") AS "PREG1_OBSERVACION", ' +
            
            '(SELECT (CASE WHEN RES."PERS_RESP_ACT_COVID_RESP" = \'TRUE\' THEN \'SI\' ELSE \'NO\' END) ' +
            'FROM  "ENC"."PERS_RESP_ACT_COVID" AS RES ' +
            'WHERE RES."PREG_ID" = 10 AND RES."ACT_ENC_ID" = ENC."ID") AS "PREG2_RESPUESTA", ' +
            
            '(SELECT RES."PERS_RESP_ACT_COVID_DET" ' +
            'FROM  "ENC"."PERS_RESP_ACT_COVID" AS RES ' +
            'WHERE RES."PREG_ID" = 10 AND RES."ACT_ENC_ID" = ENC."ID") AS "PREG2_DETALLE", ' +
            
            '(SELECT RES."PERS_RESP_ACT_COVID_OBS" ' +
            'FROM  "ENC"."PERS_RESP_ACT_COVID" AS RES ' +
            'WHERE RES."PREG_ID" = 10 AND RES."ACT_ENC_ID" = ENC."ID") AS "PREG2_OBSERVACION", ' +
            
            '(SELECT (CASE WHEN RES."PERS_RESP_ACT_COVID_RESP" = \'TRUE\' THEN \'SI\' ELSE \'NO\' END) ' +
            'FROM  "ENC"."PERS_RESP_ACT_COVID" AS RES ' +
            'WHERE RES."PREG_ID" = 11 AND RES."ACT_ENC_ID" = ENC."ID") AS "PREG3_RESPUESTA", ' +
            
            '(SELECT RES."PERS_RESP_ACT_COVID_DET" ' +
            'FROM  "ENC"."PERS_RESP_ACT_COVID" AS RES ' +
            'WHERE RES."PREG_ID" = 11 AND RES."ACT_ENC_ID" = ENC."ID") AS "PREG3_DETALLE", ' +
            
            '(SELECT RES."PERS_RESP_ACT_COVID_OBS" ' +
            'FROM  "ENC"."PERS_RESP_ACT_COVID" AS RES ' +
            'WHERE RES."PREG_ID" = 11 AND RES."ACT_ENC_ID" = ENC."ID") AS "PREG3_OBSERVACION", ' +


            
            '(SELECT (CASE WHEN RES."PERS_RESP_ACT_COVID_RESP" = \'TRUE\' THEN \'SI\' ELSE \'NO\' END) ' +
            'FROM  "ENC"."PERS_RESP_ACT_COVID" AS RES ' +
            'WHERE RES."PREG_ID" = 12 AND RES."ACT_ENC_ID" = ENC."ID") AS "PREG4_RESPUESTA", ' +   
            
            '(SELECT (CASE WHEN RES."PERS_RESP_ACT_COVID_RESP" = \'TRUE\' THEN \'SI\' ELSE \'NO\' END) ' +
            'FROM  "ENC"."PERS_RESP_ACT_COVID" AS RES ' +
            'WHERE RES."PREG_ID" = 13 AND RES."ACT_ENC_ID" = ENC."ID") AS "PREG5_RESPUESTA", ' + 
            
            '(SELECT (CASE WHEN RES."PERS_RESP_ACT_COVID_RESP" = \'TRUE\' THEN \'SI\' ELSE \'NO\' END) ' +
            'FROM  "ENC"."PERS_RESP_ACT_COVID" AS RES ' +
            'WHERE RES."PREG_ID" = 14 AND RES."ACT_ENC_ID" = ENC."ID") AS "PREG6_RESPUESTA", ' + 
            
            '(SELECT (CASE WHEN RES."PERS_RESP_ACT_COVID_RESP" = \'TRUE\' THEN \'SI\' ELSE \'NO\' END) ' +
            'FROM  "ENC"."PERS_RESP_ACT_COVID" AS RES ' +
            'WHERE RES."PREG_ID" = 15 AND RES."ACT_ENC_ID" = ENC."ID") AS "PREG7_RESPUESTA", ' +  

            '(SELECT (CASE WHEN RES."PERS_RESP_ACT_COVID_RESP" = \'TRUE\' THEN \'SI\' ELSE \'NO\' END) ' +
            'FROM  "ENC"."PERS_RESP_ACT_COVID" AS RES ' +
            'WHERE RES."PREG_ID" = 16 AND RES."ACT_ENC_ID" = ENC."ID") AS "PREG8_RESPUESTA", ' +  
            
            '(SELECT (CASE WHEN RES."PERS_RESP_ACT_COVID_RESP" = \'TRUE\' THEN \'SI\' ELSE \'NO\' END) ' +
            'FROM  "ENC"."PERS_RESP_ACT_COVID" AS RES ' +
            'WHERE RES."PREG_ID" = 17 AND RES."ACT_ENC_ID" = ENC."ID") AS "PREG9_RESPUESTA", ' +            
            
            '(\'data:image/png;base64,\' || ENCODE("FIRMA", \'base64\')) AS "FIRMA"' +

            'FROM "ENC"."ACT_ENC" ENC ' +
                'INNER JOIN "CFG"."PERS" P1 ON P1."ID" = ENC."ACT_ENC_ENCO_PERS_ID" ' +
                'INNER JOIN "CFG"."PERS" P2 ON P2."ID" = ENC."ACT_ENC_ENCR_PERS_ID" ' +
                'INNER JOIN "CFG"."REGI" RE ON RE."ID" = P1."REGI_ID" ' +
            'WHERE ENC."ENC_ID" = $1 AND ENC."FECHA" BETWEEN $2 AND $3 ' +
            'ORDER BY 8,2,3,4';
        }

		let query = {
            text: sql,
            values: [id, fechaIni, fechaFin]
		};
		return postgres.query(query);
    }	

    newUser(values) {
        let sql = 'INSERT INTO "ADMI"."USER"("USER_USER", "USER_PASS", "PROF_ID", "USER_NAME", ' +
            '"USER_LAST1", "USER_LAST2", "IDEN_TYPE_CODE", "USER_IDEN", "USER_MAIL", "USER_PHON_NUMB", ' +
            '"USER_CELP_NUMB", "USER_PHOT", "CREATED", "CREATED_BY") ' +
            'VALUES($1, $2, $3, $4 ,$5, $6 ,$7, $8, $9, $10, $11, $12, $13, $14) RETURNING *';
        let query = {
            text: sql,
            values: values
        };
        return postgres.query(query);
    }

    getUserById(id) {
        let sql = 'SELECT * FROM "ADMI"."USER" WHERE "ID" = $1';
        let query = {
            text: sql,
            values: [id]
        };
        return postgres.query(query);
    }

    getUserByUsername(username) {
        let sql = 'SELECT * FROM "ADMI"."USER" WHERE "USER_USER" = $1';
        let query = {
            text: sql,
            values: [username]
        };
        return postgres.query(query);
    }

    getUserByUsernameOrEmail(username, email) {
        let sql = 'SELECT * FROM "ADMI"."USER" WHERE "USER_USER" = $1 OR "USER_MAIL" = $2';
        let query = {
            text: sql,
            values: [username, email]
        };
        return postgres.query(query);
    }

    async saveSession(data_session) {
        let sql = 'INSERT INTO "ADMI"."SESS"("USER_ID", "TOKE", "DATE", "DUE_DATE") ' +
            'VALUES ($1, $2, $3, $4) RETURNING *';
        let query = {
            text: sql,
            values: data_session
        };
        return postgres.query(query);
    }

    async updateSession(data_session) {
        let sql = 'UPDATE "ADMI"."SESS" SET "USER_ID" = $1, "TOKE" = $2, "DATE" = $3, "DUE_DATE" = $4 ' +
            'WHERE "ID" = $5 RETURNING *';
        let query = {
            text: sql,
            values: data_session
        };
        return postgres.query(query);
    }

    getSession(session_id) {
        let sql = 'SELECT * FROM "ADMI"."SESS" WHERE "TOKE" = $1';
        let query = {
            text: sql,
            values: [session_id]
        };
        return postgres.query(query);
    }

    getAllUsers() {
        let sql = 'SELECT * FROM "ADMI"."USER"';
        return postgres.query(sql);
    }
}

module.exports = new Hvl();