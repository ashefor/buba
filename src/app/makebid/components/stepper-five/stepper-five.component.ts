import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-stepper-five',
  templateUrl: './stepper-five.component.html',
  styleUrls: ['./stepper-five.component.scss']
})
export class StepperFiveComponent implements OnInit {
  @Input() animation: any;
  constructor() { }

  ngOnInit(): void {
  }

}
