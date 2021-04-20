import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-edit-order',
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.css']
})
export class EditOrderComponent implements OnInit {

  order_id: any = this.route.snapshot.paramMap.get('order_id');

  orderForm = new FormGroup({
    status: new FormControl(''),
    client: new FormControl(''),
  });

  constructor(private ordersService: OrdersService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.getOrder();
  }

  getOrder(): void {
    let data = {
      id : this.order_id
    }

    this.ordersService.getOrder(data)
      .subscribe((order : any) => this.orderForm.patchValue({ status: order.data.STATUS, client: order.data.CLIENT }));
  }

  updateOrder(): void {
    let user = JSON.parse(window.localStorage.currentUser);
    let data = {
      id : this.order_id,
      status: this.orderForm.get('status').value,
      client: this.orderForm.get('client').value
    }

    this.ordersService.updateOrder(data)
      .subscribe((order : any) => this.router.navigate(['/listorders']) );
  }

}
