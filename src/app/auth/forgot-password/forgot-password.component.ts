import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  resetting: boolean;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.formInit()
  }

  formInit() {
    this.forgotPasswordForm = this.fb.group({
      email: [null, [Validators.email, Validators.required]],
    });
  }

  get formControls() {
    return this.forgotPasswordForm.controls;
  }

  reset(formvalue) {

  }
}
