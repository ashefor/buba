import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-luckyjaka-advert',
  templateUrl: './luckyjaka-advert.component.html',
  styleUrls: ['./luckyjaka-advert.component.scss']
})
export class LuckyjakaAdvertComponent implements OnInit {
  isSpinning = false;
  luckyJakaData: any;
  fetchrrors: any;
  loadingDetails: boolean;
  currentPage$: Observable<number>;
  bidDetails$: Observable<any>;
  animation = 'animate__slideInRight';
  accountDetails$: Observable<any>;
  gameType: string;
  constructor() { }

  ngOnInit(): void {
  }

}
