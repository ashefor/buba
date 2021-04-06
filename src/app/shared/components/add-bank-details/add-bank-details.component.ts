import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription, TimeoutError } from 'rxjs';
import { banks } from 'src/app/banks';
import { AuthService } from 'src/app/core/services/auth.service';
import { ProfileService } from 'src/app/settings/services/profile.service';

@Component({
  selector: 'app-add-bank-details',
  templateUrl: './add-bank-details.component.html',
  styleUrls: ['./add-bank-details.component.scss'],
})
export class AddBankDetailsComponent implements OnInit, OnDestroy {
  banks: any[] = banks.sort((a, b) => a.name.localeCompare(b.name));
  // tslint:disable-next-line: variable-name
  addBankAccountForm: FormGroup;
  @Input() loading: boolean;
  @Output() addBankEmitter = new EventEmitter();
  @Input() userDetails: any;

  constructor(private fb: FormBuilder, private loadingBar: LoadingBarService) {}

  ngOnInit(): void {
    this.formInit();
  }

  ngOnDestroy() {
    
  }

  formInit() {
    this.addBankAccountForm = this.fb.group({
      bank_code: [this.userDetails?.bank_code, Validators.required],
      account_number: [this.userDetails?.account_number, Validators.required],
    });
  }

  get formControls() {
    return this.addBankAccountForm.controls;
  }

  addBankAccountHandler(formvalue) {
    // tslint:disable-next-line: forin
    for (const i in this.addBankAccountForm.controls) {
      this.addBankAccountForm.controls[i].markAsDirty();
      this.addBankAccountForm.controls[i].updateValueAndValidity();
    }
    if (this.addBankAccountForm.invalid) {
      return;
    }
    this.addBankEmitter.emit(formvalue);
  }
}
