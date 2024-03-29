import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { RouterService } from '../services/router.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private url: RouterService, private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkIfLoggedIn(state.url);
  }

  checkIfLoggedIn(url: string) {
    if (this.auth.isLoggedIn()) {
      return true;
    }
    this.auth.redirectUrl = url;
    this.router.navigate(['/login'], {queryParams: {redirect: this.url.getCurrentUrl()}});
    return false;
  }
}
