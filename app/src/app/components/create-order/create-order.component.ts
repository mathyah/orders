import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css']
})
export class CreateOrderComponent implements OnInit {

  orderForm = new FormGroup({
    status: new FormControl('Open'),
    client: new FormControl(''),
  });

  constructor(private ordersService: OrdersService, private router: Router) { }

  ngOnInit(): void {
  }

  saveOrder(): void {
    let user = JSON.parse(window.localStorage.currentUser);
    let data = {
      user_id : user._id,
      status: this.orderForm.get('status').value,
      client: this.orderForm.get('client').value
    }

    this.ordersService.createOrder(data)
      .subscribe((order : any) => this.router.navigate(['/listorders']) );
  }

}
