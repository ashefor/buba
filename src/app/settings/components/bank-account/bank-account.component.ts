import { Component, OnInit } from '@angular/core';
import { banks } from 'src/app/banks';

@Component({
  selector: 'app-bank-account',
  templateUrl: './bank-account.component.html',
  styleUrls: ['./bank-account.component.scss']
})
export class BankAccountComponent implements OnInit {
  banks: any[] = banks.sort((a, b) => a.name.localeCompare(b.name));
  bank_name: any = null;
  constructor() { }

  ngOnInit(): void {
  }

}
