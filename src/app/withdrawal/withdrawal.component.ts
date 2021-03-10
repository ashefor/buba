import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { WithdrawalService } from './services/withdrawal.service';

@Component({
  selector: 'app-withdrawal',
  templateUrl: './withdrawal.component.html',
  styleUrls: ['./withdrawal.component.scss']
})
export class WithdrawalComponent implements OnInit, OnDestroy {
  constructor(private withdrawalService: WithdrawalService, private toastr: ToastrService, private loadingBar: LoadingBarService) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.loadingBar.complete();
  }

}
