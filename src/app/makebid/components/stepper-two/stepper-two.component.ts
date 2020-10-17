import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-stepper-two',
  templateUrl: './stepper-two.component.html',
  styleUrls: ['./stepper-two.component.scss']
})
export class StepperTwoComponent implements OnInit {
  hide = true;
  @Output() loginEmitter = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }


  login() {
    this.loginEmitter.emit('done');
  }

}
