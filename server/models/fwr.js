class User {
    constructor() {}

    insertFunction(schema_name, table_name, values, debug) {        
        let sql = 'SELECT "'+ schema_name +'"."FN_' + schema_name + '_INSERT"(\'' + schema_name + '\', \'' + table_name + '\', '  + values + ')';
        if(debug) logger.debug('The sql in insertFunction: ' + sql);
        return postgres.query(sql);
    }

    selectFunction(schema_name, table_name, debug) {
        let sql = 'SELECT "'+ schema_name +'"."FN_' + schema_name + '_SELECT"(\'' + 'datos' + '\', \'' + table_name + '\')';
        if(debug) logger.debug('The sql in selectFunction: ' + sql);
        return postgres.queryCursor(sql)
    }

    updateFunction(schema_name, table_name, values, debug) {
        let sql = 'SELECT "'+ schema_name +'"."FN_' + schema_name + '_UPDATE"(\'' + schema_name + '\', \'' + table_name + '\', '  + values + ')';
        if(debug) logger.debug('The sql in updateFunction: ' + sql);
        return postgres.queryCursor(sql);
    }

    deleteFunction(schema_name, table_name, values, debug) {
        let sql = 'SELECT "'+ schema_name +'"."FN_' + schema_name + '_DELETE"(\'' + schema_name + '\', \'' + table_name + '\', '  + values + ')';
        if(debug) logger.debug('The sql in deleteFunction: ' + sql);
        return postgres.queryCursor(sql);
    }

    // Functions initialize functions

    getSchemas() {
        let sql = 'SELECT nspname FROM pg_catalog.pg_namespace WHERE nspname NOT IN (\'pg_toast\', \'pg_temp_1\','
            + '\'pg_toast_temp_1\', \'pg_catalog\',\'public\', \'information_schema\')';  
        return postgres.query(sql);       
    }

    getTables(schema_name) {
        let sql = 'SELECT table_name FROM information_schema.tables WHERE table_schema=\'' + schema_name + '\'';
        return postgres.query(sql);
    }
    
    getTablesReg(schema_name) {
        let sql = 'SELECT COUNT(*) FROM "FORM"."TAB" WHERE "ESQUEMA" = \'' + schema_name + '\'';
        return postgres.query(sql);
    }

    getCamps(schema_name, table_name) {
        let sql = 'SELECT column_name FROM information_schema.columns WHERE table_schema = \'' + schema_name + '\' AND table_name   = \'' + table_name + '\'';
        return postgres.query(sql);
    }

    getLabels() {
        let sql = 'SELECT "ID", "LABE_NAME" FROM "ADMI"."LABE"';
        return postgres.query(sql);
    }

    getTrans(id) {
        let sql = 'SELECT LANG_CODE, TRAN_TRAN FROM TRAN WHERE LABE_ID = ' + id;
    }

    // considerar poner los nombres a las varables igual que en la tabla pero en minuscula
    // pendiente
    insertInTab(tab_data) {
        let sql = 'INSERT INTO "FORM"."TAB" ("TAB_CODIGO", "TAB_NOMBRE", "ESQUEMA", "DIC_CODIGO") VALUES($1, $2, $3, $4) RETURNING *';
        let values = [tab_data.code, tab_data.tableName, tab_data.schemaName, tab_data.code];
        let query = {
            text: sql,
            values: values
        }
        return postgres.query(query);
    }
    // pendiente
    insertInCam(cam_data) {
        let sql = 'INSERT INTO "FORM"."CAM" ("CAM_CODIGO", "TAB_CODIGO", "CAM_NOMBRE", "COMPONENTE", "FILA", "COLUMNA", "CANTIDAD_COLUMNA_NUEVO", '
            + '"ES_LLAVE_PRIMARIA", "CANTIDAD_COLUMNA_EDITAR", "ORDEN_INSERCION") '
            + 'VALUES($1, $2, $3, $4) RETURNING *';
        let values = [cam_data.code, cam_data.tableName, cam_data.schemaName, cam_data.code];
        let query = {
            text: sql,
            values: values
        }
        return postgres.query(query);
    }

    insertLabel(labe_name, created_by) {
        let sql = 'INSERT INTO "ADMI"."LABE" ("LABE_NAME", "CREATED", "CREATED_BY") VALUES($1, $2, $3) RETURNING *';
        let values = [labe_name, Date.now(), created_by];
        let query = {
            text: sql,
            values: values
        }
        return postgres.query(query);
    }    

    insertTran(labe_id, lang_code, tran_tran, created_by) {
        let sql = 'INSERT INTO "ADMI"."TRAN" ("LABE_ID", "LANG_CODE", "TRAN_TRAN", "CREATED", "CREATED_BY") VALUES($1, $2, $3, $4, $5) RETURNING *';
        let values = [labe_id, lang_code, tran_tran, Date.now(), created_by];
        let query = {
            text: sql,
            values: values
        }
        return postgres.query(query);
    }

    insertDict(code, labe_id, created_by) {
        let sql = 'INSERT INTO "ADMI"."DICT" ("CODE", "LABE_ID", "CREATED", "CREATED_BY") VALUES($1, $2, $3, $4) RETURNING *';
        let values = [code, labe_id, Date.now(), created_by];
        let query = {
            text: sql,
            values: values
        }
        return postgres.query(query);
    }
}

module.exports = new User();