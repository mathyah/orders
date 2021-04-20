class User {
    constructor() {}

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

    insertUser() {
        'INSERT INTO "ADMI"."USER"("USER_USER", "USER_PASS", "PROF_ID", "USER_NAME", "USER_LAST1", "USER_LAST2", "IDEN_TYPE_CODE", "USER_IDEN", "USER_MAIL", "USER_PHON_NUMB","USER_CELP_NUMB", "USER_PHOT", "CREATED", "CREATED_BY")'
    }
}

module.exports = new User();