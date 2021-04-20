import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { ReactiveFormsModule } from '@angular/forms';

import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgSelectModule } from '@ng-select/ng-select';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';

import { LoginComponent } from './components/login/login.component';
import { ListOrdersComponent } from './components/list-orders/list-orders.component';
import { CreateOrderComponent } from './components/create-order/create-order.component';
import { EditOrderComponent } from './components/edit-order/edit-order.component';
import { CloseOrderComponent } from './components/close-order/close-order.component';
import { ListInvoicesComponent } from './components/list-invoices/list-invoices.component';
import { ListPaymentsComponent } from './components/list-payments/list-payments.component';
import { CreatePaymentComponent } from './components/create-payment/create-payment.component';
import { EditPaymentComponent } from './components/edit-payment/edit-payment.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ListOrdersComponent,
    CreateOrderComponent,
    EditOrderComponent,
    CloseOrderComponent,
    ListInvoicesComponent,
    ListPaymentsComponent,
    CreatePaymentComponent,
    EditPaymentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSelectModule,
    MatFormFieldModule,
    NgxMatSelectSearchModule,
    NgbModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgSelectModule,
    ReactiveFormsModule,
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
