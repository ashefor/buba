import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { EMPTY, Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { BidService } from 'src/app/makebid/services/bid.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private service: AuthService, private router: Router, private toastr: ToastrService, private bidService: BidService) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.service.isLoggedIn()) {
            const token = this.service.getToken();
            req = req.clone({
                setHeaders: {
                    'Content-Type': 'application/json',
                    Authorization: token
                }
            });
        }
        return next.handle(req).pipe(catchError(error => {
            if (error instanceof HttpErrorResponse && error.status === 401) {
                this.service.clearSessionStorage().then(() => this.service.storeUser(null));
                this.toastr.error('Please sign in to continue', 'Unauthorised!');
                this.bidService.setCurrentPage(2);
                return throwError(error);
            } else {
                return throwError(error);
            }
        }));
    }
}
