import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CloseOrderComponent } from './components/close-order/close-order.component';
import { CreateOrderComponent } from './components/create-order/create-order.component';
import { CreatePaymentComponent } from './components/create-payment/create-payment.component';
import { EditOrderComponent } from './components/edit-order/edit-order.component';
import { EditPaymentComponent } from './components/edit-payment/edit-payment.component';
import { ListInvoicesComponent } from './components/list-invoices/list-invoices.component';
import { ListOrdersComponent } from './components/list-orders/list-orders.component';
import { ListPaymentsComponent } from './components/list-payments/list-payments.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'listorders', component: ListOrdersComponent },
  { path: 'createorder', component: CreateOrderComponent },
  { path: 'closeorder/:order_id', component: CloseOrderComponent },
  { path: 'createpayment/:invoice_id/:order_id', component: CreatePaymentComponent },
  { path: 'editorder/:order_id', component: EditOrderComponent },
  { path: 'editpayment/:payment_id/:invoice_id/:order_id', component: EditPaymentComponent },
  { path: 'listinvoices/:order_id', component: ListInvoicesComponent },
  { path: 'listpayments/:invoice_id/:order_id', component: ListPaymentsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
