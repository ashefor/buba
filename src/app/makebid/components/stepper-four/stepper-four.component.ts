import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-stepper-four',
  templateUrl: './stepper-four.component.html',
  styleUrls: ['./stepper-four.component.scss']
})
export class StepperFourComponent implements OnInit {
  @Output() makeBidEmitter = new EventEmitter();
  @Input() animation: any;
  itemAmount = 2500;

  constructor() { }

  ngOnInit(): void {
  }


  makeBid() {
    this.makeBidEmitter.emit('done');
  }
}
