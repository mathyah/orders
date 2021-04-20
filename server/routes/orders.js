var orderDao = require('../models/order');

class Orders {
    constructor() {}

    async create_order(req, res) {
        let data = req.body;
        let order = (await orderDao.createOrder(data))[0] || {};
        return res.status(200).json({
            success: true,
            data: order
        });
    }

    async get_orders(req, res) {
        let user_id = req.query.user_id || req.body.user_id;
        let orders = (await orderDao.getOrders(user_id)) || [];
        return res.status(200).json({
            success: true,
            data: orders
        });
    }

    async get_order_by_id(req, res) {
        let id = req.query.id || req.body.id;
        let order = (await orderDao.getOrderById(id))[0] || {};
        return res.status(200).json({
            success: true,
            data: order
        });
    }

    async update_order(req, res) {
        let data = req.body;
        let order = (await orderDao.updateOrder(data))[0] || {};
        return res.status(200).json({
            success: true,
            data: order
        });
    }

    async delete_order(req, res) {
        let order_id = req.query.id || req.body.id;
        let order = (await orderDao.deleteOrder(order_id))[0] || {};
        return res.status(200).json({
            success: true,
            data: order
        });
    }

    async close_order(req, res) {
        let data = req.body;
        let order = (await orderDao.closeOrder(data))[0] || {};
        return res.status(200).json({
            success: true,
            data: order
        });
    }

    async get_invoices(req, res) {
        let order_id = req.query.order_id || req.body.order_id;
        let orders = (await orderDao.getInvoices(order_id)) || [];
        return res.status(200).json({
            success: true,
            data: orders
        });
    }

    async get_invoice_by_id(req, res) {
        let id = req.query.id || req.body.id;
        let invoice = (await orderDao.getInvoiceById(id))[0] || {};
        return res.status(200).json({
            success: true,
            data: invoice
        });
    }

    async get_payments(req, res) {
        let invoice_id = req.query.invoice_id || req.body.invoice_id;
        let orders = (await orderDao.getPayments(invoice_id)) || [];
        return res.status(200).json({
            success: true,
            data: orders
        });
    }

    async get_payment_by_id(req, res) {
        let id = req.query.id || req.body.id;
        let payment = (await orderDao.getPaymentById(id))[0] || {};
        return res.status(200).json({
            success: true,
            data: payment
        });
    }

    async update_payment(req, res) {
        let data = req.body;
        let payment = (await orderDao.updatePayment(data))[0] || {};
        return res.status(200).json({
            success: true,
            data: payment
        });
    }

    async create_payment(req, res) {
        let data = req.body;
        let order = (await orderDao.createPayment(data))[0] || {};
        return res.status(200).json({
            success: true,
            data: order
        });
    }

    // TO DOWNLOAD JSON FORMATS

    async get_orders_complete(req, res) {
        let user_id = req.query.user_id || req.body.user_id;
        let orders = (await orderDao.getOrdersComplete(user_id)) || [];
        return res.status(200).json({
            success: true,
            data: orders
        });
    }

    async get_order_by_id_complete(req, res) {
        let id = req.query.id || req.body.id;
        let orders = (await orderDao.getOrdersByIdComplete(id)) || [];
        return res.status(200).json({
            success: true,
            data: orders
        });
    }
}

module.exports = new Orders();