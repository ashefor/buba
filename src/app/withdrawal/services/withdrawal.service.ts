import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WithdrawalService {

  constructor(private http: HttpClient) { }

  fetchWithdrawals(pageDetails) {
    return this.http.post(`${environment.bubaApi}/withdrawal/list`, pageDetails).pipe(catchError((error) => throwError(error)));
  }

  makeWithdrawal(withdrawalDetails) {
    return this.http.post(`${environment.bubaApi}/withdrawal/disburse`, withdrawalDetails).pipe(catchError((error) => throwError(error)));
  }
}
