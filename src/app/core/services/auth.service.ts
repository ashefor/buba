import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  urlModule = 'auth';
  redirectUrl: string;
  currentPage: number;
  user: any;
  userObject$ = new BehaviorSubject<any>(this.getUserObject$());
  winners$ = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient, private router: Router) {

  }

  public getUserObject$() {
    const userData = sessionStorage.getItem('bidbuba-user');
    if (userData !== 'undefined' || userData !== undefined || userData !== null) {
      return JSON.parse(userData);
    } else {
      return null;
    }
  }
  storeToken(token: string) {
    return sessionStorage.setItem('bidbuba-access-token', token);
  }

  getToken() {
    return sessionStorage.getItem('bidbuba-access-token') || null;
  }

  storeUser(user: any) {
    sessionStorage.setItem('bidbuba-user', JSON.stringify(user));
    return this.userObject$.next(user);
  }

  storeLoginStatus(status: boolean) {
    return sessionStorage.setItem('bidbuba-user-status', JSON.stringify(status));
  }

  getLoginStatus() {
    return sessionStorage.getItem('bidbuba-user-status') || null;
  }

  getUser$() {
    return this.userObject$.asObservable();
  }

  isLoggedIn() {
    return !!this.getToken();
  }

  hasCompletedSetup() {
    return !!this.getLoginStatus();
  }

  async clearSessionStorage() {
    await sessionStorage.clear();
  }

  getWalletBalance() {
    return this.http.get(`${environment.bubaApi}/user/account/details`).pipe(catchError((error) => throwError(error)));
  }

  login(user) {
    return this.http.post(`${environment.bubaApi}/user/account/login`, user).pipe(catchError((error) => throwError(error)));
  }
  resetAccount(user) {
    return this.http.post(`${environment.bubaApi}/user/account/reset`, user).pipe(catchError((error) => throwError(error)));
  }
  register(newUser) {
    return this.http.post(`${environment.bubaApi}/user/account/create`, newUser).pipe(catchError((error) => throwError(error)));
  }

  createPaymentAccount() {
    return this.http.get(`${environment.bubaApi}/user/account/payment/create`).pipe(catchError((error) => throwError(error)));
  }

  addBankAccountDetails(bankAccountDetails) {
    return this.http.post(`${environment.bubaApi}/user/account/add`, bankAccountDetails).pipe(catchError((error) => throwError(error)));
  }

  transferFundsToWallet(amount) {
    return this.http.post(`${environment.bubaApi}/funding/transfer`, amount).pipe(catchError((error) => throwError(error)));
  }

  transferLoyaltyToWallet(amount) {
    return this.http.post(`${environment.bubaApi}/funding/loyalty_balance/transfer`, amount).pipe(catchError((error) => throwError(error)));
  }

  withdrawLoyaltyBalance(details) {
    return this.http.post(`${environment.bubaApi}/withdrawal/bonus/disburse`, details)
  }

  retrieveWinners() {
    return this.http.get(`${environment.bubaApi}/winners/list`).pipe(catchError((error) => throwError(error)));
  }

  redeemPromoCode(code) {
    return this.http.post(`${environment.bubaApi}/promo_code/redeem`, code).pipe(catchError((error) => throwError(error)));
  }
}
