import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { LoadingBarService } from '@ngx-loading-bar/core';

@Component({
  selector: 'app-stepper-five',
  templateUrl: './stepper-five.component.html',
  styleUrls: ['./stepper-five.component.scss']
})
export class StepperFiveComponent implements OnInit, OnDestroy {
  @Input() animation: any;
  @Input() successObj: any;
  constructor(private loadingbar: LoadingBarService) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    
  }
}
