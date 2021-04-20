import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {

  constructor(private http: HttpClient) { }

  getPayments(data: any) {
    let token = window.localStorage.accessToken;
    let headers = new HttpHeaders();
    headers = headers.append('x-access-token', token);
    return this.http.post('/api/orders/get_payments', data, {headers : headers});
  }

  deletePayment(data:any) {
    let token = window.localStorage.accessToken;
    let headers = new HttpHeaders();
    headers = headers.append('x-access-token', token);
    return this.http.post('/api/orders/delete_payment', data, {headers : headers});
  }

  createPayment(data:any) {
    let token = window.localStorage.accessToken;
    let headers = new HttpHeaders();
    headers = headers.append('x-access-token', token);
    return this.http.post('/api/orders/create_payment', data, {headers : headers});
  }

  updatePayment(data:any) {
    let token = window.localStorage.accessToken;
    let headers = new HttpHeaders();
    headers = headers.append('x-access-token', token);
    return this.http.post('/api/orders/update_payment', data, {headers : headers});
  }

  getPayment(data:any) {
    let token = window.localStorage.accessToken;
    let headers = new HttpHeaders();
    headers = headers.append('x-access-token', token);
    return this.http.post('/api/orders/get_payment_by_id', data, {headers : headers});
  }
}
