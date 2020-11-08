import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { EMPTY, Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { BidService } from 'src/app/makebid/services/bid.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private service: AuthService,
        private router: Router,
        private toastr: ToastrService, private bidService: BidService, private activatedRoute: ActivatedRoute) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // tslint:disable-next-line: no-string-literal
        const routePath = this.activatedRoute.snapshot['_routerState'].url;
        if (this.service.isLoggedIn()) {
            const token = this.service.getToken();
            req = req.clone({
                setHeaders: {
                    Authorization: token
                }
            });
        }

        if (req.url.includes('idcard')) {
            req.headers.delete('content-type');
        } else {
            req = req.clone({
                setHeaders: {
                    'Content-Type': 'application/json',
                }
            });
        }
        return next.handle(req).pipe(catchError(error => {
            if (error instanceof HttpErrorResponse && error.status === 401) {
                if (routePath.toLowerCase().includes('process_bid')) {
                    this.bidService.setCurrentPage(2);
                } else {
                    this.router.navigate(['/login']);
                }
                this.service.clearSessionStorage().then(() => this.service.storeUser(null));
                this.toastr.error('Please sign in to continue', 'Unauthorised!');
                return throwError(error);
            } else {
                return throwError(error);
            }
        }));
    }
}
