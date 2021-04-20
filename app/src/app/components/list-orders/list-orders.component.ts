import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrdersService } from '../../services/orders.service';

@Component({
  selector: 'app-list-orders',
  templateUrl: './list-orders.component.html',
  styleUrls: ['./list-orders.component.css']
})
export class ListOrdersComponent implements OnInit {

  orders: any[] = [];

  constructor(private ordersService: OrdersService, private router: Router) { }

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders():void {
    let user = JSON.parse(window.localStorage.currentUser);
    let data = {
      user_id : user._id
    };

    this.ordersService.getOrders(data)
      .subscribe((orders : any) => this.orders = orders.data);
  }

  deleteOrder(event: any, order_id:any):void {
    event.preventDefault();
    let data = {
      id : order_id
    };

    this.ordersService.deleteOrder(data)
      .subscribe((order : any) => this.getOrders());
  }

  constructJson(orders: any) {
    var obj = {};
    let index = 0;
    let cur_ord_id = 0;
    let cur_inv_id = 0;
    let cur_pay_id = 0;
    let last_ord_id = 0;

    let paid = 0;
    while(index < orders.data.length) {
      last_ord_id = cur_ord_id;
      if(cur_ord_id != orders.data[index].ORDER_ID && orders.data[index].ORDER_ID != null) {
        cur_ord_id = orders.data[index].ORDER_ID;
        obj['Order' + cur_ord_id] = {
          status: orders.data[index].STATUS,
          client: orders.data[index].CLIENT
        }
      }
      if(cur_inv_id != orders.data[index].INVOICE_ID && orders.data[index].INVOICE_ID != null) {
        if(index != 0) {
          obj['Order' + last_ord_id]['Invoice' + cur_inv_id]['paid'] = paid;
          obj['Order' + last_ord_id]['Invoice' + cur_inv_id]['remain_amount'] = obj['Order' + last_ord_id]['Invoice' + cur_inv_id]['amount_to_pay'] - paid;
          paid = 0;
        }
        cur_inv_id = orders.data[index].INVOICE_ID;
        obj['Order' + cur_ord_id]['Invoice' + cur_inv_id] = {
          amount_to_pay: orders.data[index].AMOUNT_TO_PAY
        }
      }
      if(cur_pay_id != orders.data[index].PAYMENT_ID && orders.data[index].PAYMENT_ID != null) {
        cur_pay_id = orders.data[index].PAYMENT_ID;
        obj['Order' + cur_ord_id]['Invoice' + cur_inv_id]['Payment' + cur_pay_id] = {
          amount: orders.data[index].AMOUNT,
          date: orders.data[index].DATE
        }
        paid += orders.data[index].AMOUNT;
      }
      index++;        
    }
    obj['Order' + cur_ord_id]['Invoice' + cur_inv_id]['paid'] = paid;
    obj['Order' + cur_ord_id]['Invoice' + cur_inv_id]['remain_amount'] = obj['Order' + cur_ord_id]['Invoice' + cur_inv_id]['amount_to_pay'] - paid;
    return obj;
  }

  downloadObjectAsJson(exportObj, exportName){
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
  
  getOrdersJson(event: any):void {
    event.preventDefault();
    let user = JSON.parse(window.localStorage.currentUser);
    let data = {
      user_id : user._id
    };

    this.ordersService.getOrdersJson(data)
      .subscribe((orders : any) => {
        let obj = this.constructJson(orders);
        this.downloadObjectAsJson(obj, 'Orders')
      });
  }
  
  getOrderByIdJson(event: any, order_id:any):void {
    event.preventDefault();
    let data = {
      id : order_id
    };
    
    this.ordersService.getOrderByIdJson(data)
    .subscribe((orders : any) => {
        let obj = this.constructJson(orders);
        this.downloadObjectAsJson(obj, 'Order' + order_id)
    });
  }
  

}
