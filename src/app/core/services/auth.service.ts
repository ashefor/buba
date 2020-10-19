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

}
