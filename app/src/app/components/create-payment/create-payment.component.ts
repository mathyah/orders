import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentsService } from 'src/app/services/payments.service';

@Component({
  selector: 'app-create-payment',
  templateUrl: './create-payment.component.html',
  styleUrls: ['./create-payment.component.css']
})
export class CreatePaymentComponent implements OnInit {

  invoice_id: any = this.route.snapshot.paramMap.get('invoice_id');
  order_id: any = this.route.snapshot.paramMap.get('order_id');

  paymentForm = new FormGroup({
    amount: new FormControl(''),
    date: new FormControl(''),
  });

  constructor(private paymentsService: PaymentsService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
  }

  savePayment(): void {
    let data = {
      invoice_id : this.invoice_id,
      amount: this.paymentForm.get('amount').value,
      date: this.paymentForm.get('date').value
    }

    this.paymentsService.createPayment(data)
      .subscribe((payment : any) => this.router.navigate(['/listpayments', this.invoice_id, this.order_id]) );
  }
}
