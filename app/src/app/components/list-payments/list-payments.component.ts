import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaymentsService } from 'src/app/services/payments.service';

@Component({
  selector: 'app-list-payments',
  templateUrl: './list-payments.component.html',
  styleUrls: ['./list-payments.component.css']
})
export class ListPaymentsComponent implements OnInit {

  order_id: any = this.route.snapshot.paramMap.get('order_id');
  invoice_id: any = this.route.snapshot.paramMap.get('invoice_id');

  payments: any[] = [];

  constructor(private route: ActivatedRoute, private paymentsService: PaymentsService) { }

  ngOnInit(): void {
    this.getPayments();
  }

  getPayments():void {
    let data = {
      invoice_id : this.invoice_id
    };

    this.paymentsService.getPayments(data)
      .subscribe((payments : any) => this.payments = payments.data);
  }

  deletePayment(event: any, payment_id:any):void {
    event.preventDefault();
    let data = {
      id : payment_id
    };

    this.paymentsService.deletePayment(data)
      .subscribe((payment : any) => this.getPayments());
  }

}
