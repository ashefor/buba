import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-stepper-three',
  templateUrl: './stepper-three.component.html',
  styleUrls: ['./stepper-three.component.scss']
})
export class StepperThreeComponent implements OnInit {
  @Output() authenticateEmitter = new EventEmitter();
  @Input() animation: any;
  constructor() { }

  ngOnInit(): void {
  }

  authenticate() {
    this.authenticateEmitter.emit('done');
  }
}
