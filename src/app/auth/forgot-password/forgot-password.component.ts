import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  resetting: boolean;

  constructor(private fb: FormBuilder, private title: Title) { 
    this.title.setTitle('Buba - Account Reset Password');
  }

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
