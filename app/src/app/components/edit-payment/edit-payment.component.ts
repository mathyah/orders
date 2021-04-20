import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentsService } from 'src/app/services/payments.service';

@Component({
  selector: 'app-edit-payment',
  templateUrl: './edit-payment.component.html',
  styleUrls: ['./edit-payment.component.css']
})
export class EditPaymentComponent implements OnInit {

  payment_id: any = this.route.snapshot.paramMap.get('payment_id');
  invoice_id: any = this.route.snapshot.paramMap.get('invoice_id');
  order_id: any = this.route.snapshot.paramMap.get('order_id');

  paymentForm = new FormGroup({
    amount: new FormControl(''),
    date: new FormControl(''),
  });

  constructor(private paymentsService: PaymentsService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.getPayment();
  }

  getPayment(): void {
    let data = {
      id : this.payment_id
    }

    this.paymentsService.getPayment(data)
      .subscribe((payment : any) => this.paymentForm.patchValue({ amount: payment.data.AMOUNT, date: payment.data.DATE ? payment.data.DATE.substr(0, 10): ''}));
  }

  updatePayment(): void {
    let data = {
      id : this.payment_id,
      amount: this.paymentForm.get('amount').value,
      date: this.paymentForm.get('date').value
    }

    this.paymentsService.updatePayment(data)
      .subscribe((payment : any) => this.router.navigate(['/listpayments', this.invoice_id, this.order_id]) );
  }

}
