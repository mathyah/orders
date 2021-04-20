import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-close-order',
  templateUrl: './close-order.component.html',
  styleUrls: ['./close-order.component.css']
})
export class CloseOrderComponent implements OnInit {

  order_id: any = this.route.snapshot.paramMap.get('order_id');

  invoiceForm = new FormGroup({
    amount_to_pay: new FormControl(''),
    order_id: new FormControl(this.order_id),
  });

  constructor(private ordersService: OrdersService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
  }

  closeOrder(): void {
    let data = {
      amount_to_pay : this.invoiceForm.get('amount_to_pay').value,
      order_id: this.order_id,
    }

    this.ordersService.closeOrder(data)
      .subscribe((order : any) => this.router.navigate(['/listorders']) );
  }

}
