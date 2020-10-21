import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  urlModule = 'auth';
  redirectUrl: string;
  currentPage: number;
  constructor(private http: HttpClient, private router: Router) { }

  storeToken(token: string) {
    return sessionStorage.setItem('creditalert-access-token', token);
  }

  getToken() {
    return sessionStorage.getItem('creditalert-access-token');
  }

  storeUser(user: any) {
    return sessionStorage.setItem('creditalert-user', JSON.stringify(user));
  }

  getUser() {
    return sessionStorage.getItem('creditalert-user');
  }

  isLoggedIn() {
    return !!this.getToken();
  }

  clearSessionStorage() {
    return sessionStorage.clear();
  }

  getWalletBalance() {
    return this.http.get(`${environment.bubaApi}/user/account/details`).pipe(catchError((error) => throwError(error)));
  }

  login(user) {
    return this.http.post(`${environment.bubaApi}/user/account/login`, user).pipe(catchError((error) => throwError(error)));
  }

  register(newUser) {
    return this.http.post(`${environment.bubaApi}/user/account/create`, newUser).pipe(catchError((error) => throwError(error)));
  }

  createPaymentAccount() {
    return this.http.get(`${environment.bubaApi}/user/account/payment/create`).pipe(catchError((error) => throwError(error)));
  }
}
