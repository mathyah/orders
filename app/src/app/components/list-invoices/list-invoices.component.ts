import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InvoicesService } from 'src/app/services/invoices.service';


@Component({
  selector: 'app-list-invoices',
  templateUrl: './list-invoices.component.html',
  styleUrls: ['./list-invoices.component.css']
})
export class ListInvoicesComponent implements OnInit {

  order_id: any = this.route.snapshot.paramMap.get('order_id');

  invoices: any[] = [];

  constructor(private route: ActivatedRoute, private invoicesService: InvoicesService) { }

  ngOnInit(): void {
    this.getInvoices();
  }

  getInvoices():void {
    let data = {
      order_id : this.order_id
    };

    this.invoicesService.getInvoices(data)
      .subscribe((invoices : any) => this.invoices = invoices.data);
  }

}
