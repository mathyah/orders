class Order {
    constructor() {}

    createOrder(data) {
        let sql = 'SELECT "TST"."FN_TST__INSERTAR_PARTICULAR"(\'ORD\', NULL, ARRAY[$1, $2, $3], NULL)';
        let query = {
            text: sql,
            values: [data.status, data.client, data.user_id]
        };
        return postgres.query(query);
    }

    getOrders(user_id) {
        let sql = 'SELECT "ID", "STATUS", "CLIENT" FROM "TST"."ORD" LEFT JOIN "TST"."ASI_USER_ORD" ON "TST"."ASI_USER_ORD"."ORD_ID" = "TST"."ORD"."ID" WHERE "TST"."ASI_USER_ORD"."USER_ID" = $1';
        let query = {
            text: sql,
            values: [user_id]
        };
        return postgres.query(query);
    }

    getOrderById(order_id) {
        let sql = 'SELECT "ID", "STATUS", "CLIENT" FROM "TST"."ORD"  WHERE "TST"."ORD"."ID" = $1';
        let query = {
            text: sql,
            values: [order_id]
        };
        return postgres.query(query);
    }

    updateOrder(data) {
        let sql = 'UPDATE "TST"."ORD" SET "STATUS" = $1, "CLIENT" = $2 WHERE "ID" = $3';
        let query = {
            text: sql,
            values: [data.status, data.client, data.id]
        };
        return postgres.query(query);
    }

    deleteOrder(order_id) {
        let sql = 'SELECT "TST"."FN_TST__ELIMINAR_GEN"(\'ORD\', NULL, ARRAY[$1])';
        let query = {
            text: sql,
            values: [order_id]
        };
        return postgres.query(query);
    }

    closeOrder(data) {
        let sql = 'SELECT "TST"."FN_TST__INSERTAR_PARTICULAR"(\'INV\', NULL, ARRAY[$1, $2], NULL)';
        let query = {
            text: sql,
            values: [data.amount_to_pay, data.order_id]
        };
        return postgres.query(query);
    }

    getInvoices(order_id) {
        let sql = 'SELECT "TST"."INV"."ID", "TST"."INV"."AMOUNT_TO_PAY", SUM("TST"."PAY"."AMOUNT") AS "AMOUNT_PAID" FROM "TST"."INV" LEFT JOIN "TST"."ASI_ORD_INV" ON "TST"."ASI_ORD_INV"."INV_ID" = "TST"."INV"."ID" LEFT JOIN "TST"."ASI_INV_PAY" ON "TST"."ASI_INV_PAY"."INV_ID" = "TST"."INV"."ID" LEFT JOIN "TST"."PAY" ON "TST"."PAY"."ID" = "TST"."ASI_INV_PAY"."PAY_ID" WHERE "TST"."ASI_ORD_INV"."ORD_ID" = $1 GROUP BY "TST"."INV"."ID"';
        let query = {
            text: sql,
            values: [order_id]
        };
        return postgres.query(query);
    }

    getInvoiceById(invoice_id) {
        let sql = 'SELECT "ID", "AMOUNT_TO _PAY", "AMOUNT_PAID" FROM "TST"."INV" WHERE "TST"."INV"."ID" = $1';
        let query = {
            text: sql,
            values: [invoice_id]
        };
        return postgres.query(query);
    }

    createPayment(data) {
        let sql = 'SELECT "TST"."FN_TST__INSERTAR_PARTICULAR"(\'PAY\', NULL, ARRAY[$1, $2, $3], NULL)';
        let query = {
            text: sql,
            values: [data.amount, data.date, data.invoice_id]
        };
        return postgres.query(query);
    }

    getPayments(invoice_id) {
        let sql = 'SELECT "ID", "AMOUNT", "DATE" FROM "TST"."PAY" LEFT JOIN "TST"."ASI_INV_PAY" ON "TST"."ASI_INV_PAY"."PAY_ID" = "TST"."PAY"."ID" WHERE "TST"."ASI_INV_PAY"."INV_ID" = $1';
        let query = {
            text: sql,
            values: [invoice_id]
        };
        return postgres.query(query);
    }

    getPaymentById(payment_id) {
        let sql = 'SELECT "ID", "AMOUNT", "DATE" FROM "TST"."PAY" WHERE "TST"."PAY"."ID" = $1';
        let query = {
            text: sql,
            values: [payment_id]
        };
        return postgres.query(query);
    }

    updatePayment(data) {
        let sql = 'UPDATE "TST"."PAY" SET "AMOUNT" = $1, "DATE" = $2 WHERE "ID" = $3';
        let query = {
            text: sql,
            values: [data.amount, data.date, data.id]
        };
        return postgres.query(query);
    }

    deletePayment(payment_id) {
        let sql = 'SELECT "TST"."FN_TST__ELIMINAR_GEN"(\'PAY\', NULL, ARRAY[$1])';
        let query = {
            text: sql,
            values: [payment_id]
        };
        return postgres.query(query);
    }

    getOrdersComplete(user_id) {
        let sql = `SELECT 
                        "ORD"."ID" AS "ORDER_ID", 
                        "ORD"."STATUS", 
                        "ORD"."CLIENT",
                        "INV"."ID" AS "INVOICE_ID",
                        "INV"."AMOUNT_TO_PAY",
                        "PAY"."ID" AS "PAYMENT_ID",
                        "PAY"."AMOUNT",
                        "PAY"."DATE"	
                    FROM
                        "TST"."ASI_USER_ORD"
                    LEFT JOIN
                        "TST"."ASI_ORD_INV" ON "TST"."ASI_ORD_INV"."ORD_ID" = "TST"."ASI_USER_ORD"."ORD_ID"
                    LEFT JOIN
                        "TST"."ASI_INV_PAY" ON "TST"."ASI_INV_PAY"."INV_ID" = "TST"."ASI_ORD_INV"."INV_ID"
                    LEFT JOIN
                        "TST"."ORD" ON "TST"."ORD"."ID" = "TST"."ASI_USER_ORD"."ORD_ID"
                    LEFT JOIN
                        "TST"."INV" ON "TST"."INV"."ID" = "TST"."ASI_ORD_INV"."INV_ID"
                    LEFT JOIN
                        "TST"."PAY" ON "TST"."PAY"."ID" = "TST"."ASI_INV_PAY"."PAY_ID"
                    WHERE
                        "TST"."ASI_USER_ORD"."USER_ID" = $1
                    GROUP BY
                        "ORDER_ID",
                        "INVOICE_ID",
                        "PAYMENT_ID"
                    ORDER BY
                        "ORDER_ID",
                        "INVOICE_ID",
                        "PAYMENT_ID"`;
        let query = {
            text: sql,
            values: [user_id]
        };
        return postgres.query(query);
    }

    getOrdersByIdComplete(order_id) {
        let sql = `SELECT 
                        "ORD"."ID" AS "ORDER_ID", 
                        "ORD"."STATUS", 
                        "ORD"."CLIENT",
                        "INV"."ID" AS "INVOICE_ID",
                        "INV"."AMOUNT_TO_PAY",
                        "PAY"."ID" AS "PAYMENT_ID",
                        "PAY"."AMOUNT",
                        "PAY"."DATE"	
                    FROM
                        "TST"."ORD"
                    LEFT JOIN
                        "TST"."ASI_ORD_INV" ON "TST"."ASI_ORD_INV"."ORD_ID" = "TST"."ORD"."ID"
                    LEFT JOIN
                        "TST"."ASI_INV_PAY" ON "TST"."ASI_INV_PAY"."INV_ID" = "TST"."ASI_ORD_INV"."INV_ID"
                    LEFT JOIN
                        "TST"."INV" ON "TST"."INV"."ID" = "TST"."ASI_ORD_INV"."INV_ID"
                    LEFT JOIN
                        "TST"."PAY" ON "TST"."PAY"."ID" = "TST"."ASI_INV_PAY"."PAY_ID"
                    WHERE
                        "ORD"."ID" = $1
                    GROUP BY
                        "ORDER_ID",
                        "INVOICE_ID",
                        "PAYMENT_ID"
                    ORDER BY
                        "ORDER_ID",
                        "INVOICE_ID",
                        "PAYMENT_ID"`;
        let query = {
            text: sql,
            values: [order_id]
        };
        return postgres.query(query);
    }

}

module.exports = new Order();