import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InvoicesService {

  constructor(private http: HttpClient) { }

  getInvoices(data: any) {
    let token = window.localStorage.accessToken;
    let headers = new HttpHeaders();
    headers = headers.append('x-access-token', token);
    return this.http.post('/api/orders/get_invoices', data, {headers : headers});
  }
}
