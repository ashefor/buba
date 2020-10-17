import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-stepper-three',
  templateUrl: './stepper-three.component.html',
  styleUrls: ['./stepper-three.component.scss']
})
export class StepperThreeComponent implements OnInit {
  @Output() authenticateEmitter = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  authenticate() {
    this.authenticateEmitter.emit('done');
  }
}
