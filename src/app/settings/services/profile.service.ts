import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  changeUserPassword(passwordDetails) {
    return this.http.post(`${environment.bubaApi}/profile/password/change`, passwordDetails).pipe(catchError((error) => throwError(error)));
  }

  editProfileDetails(profileDetails) {
    return this.http.post(`${environment.bubaApi}/profile/edit`, profileDetails).pipe(catchError((error) => throwError(error)));
  }

  addBankAccountDetails(bankAccountDetails) {
    return this.http.post(`${environment.bubaApi}/profile/account/add`, bankAccountDetails).pipe(catchError((error) => throwError(error)));
  }

  uploadIdCardDetails(idCardDetails) {
    return this.http.post(`${environment.bubaApi}/profile/idcard`, idCardDetails).pipe(catchError((error) => throwError(error)));
  }
}
