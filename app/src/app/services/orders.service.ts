import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private http: HttpClient) {}

  getOrders(data: any) {
    let token = window.localStorage.accessToken;
    let headers = new HttpHeaders();
    headers = headers.append('x-access-token', token);
    return this.http.post('/api/orders/get_orders', data, {headers : headers});
  }

  createOrder(data: any) {
    let token = window.localStorage.accessToken;
    let headers = new HttpHeaders();
    headers = headers.append('x-access-token', token);
    return this.http.post('/api/orders/create_order', data, {headers : headers});
  }

  deleteOrder(data:any) {
    let token = window.localStorage.accessToken;
    let headers = new HttpHeaders();
    headers = headers.append('x-access-token', token);
    return this.http.post('/api/orders/delete_order', data, {headers : headers});
  }

  updateOrder(data:any) {
    let token = window.localStorage.accessToken;
    let headers = new HttpHeaders();
    headers = headers.append('x-access-token', token);
    return this.http.post('/api/orders/update_order', data, {headers : headers});
  }

  getOrder(data:any) {
    let token = window.localStorage.accessToken;
    let headers = new HttpHeaders();
    headers = headers.append('x-access-token', token);
    return this.http.post('/api/orders/get_order_by_id', data, {headers : headers});
  }

  closeOrder(data: any) {
    let token = window.localStorage.accessToken;
    let headers = new HttpHeaders();
    headers = headers.append('x-access-token', token);
    return this.http.post('/api/orders/close_order', data, {headers : headers});
  }

  // JSON download services

  getOrdersJson(data: any) {
    let token = window.localStorage.accessToken;
    let headers = new HttpHeaders();
    headers = headers.append('x-access-token', token);
    return this.http.post('/api/orders/get_orders_complete', data, {headers : headers});
  }

  getOrderByIdJson(data: any) {
    let token = window.localStorage.accessToken;
    let headers = new HttpHeaders();
    headers = headers.append('x-access-token', token);
    return this.http.post('/api/orders/get_order_by_id_complete', data, {headers : headers});
  }

}
