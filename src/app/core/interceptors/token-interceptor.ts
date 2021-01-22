import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { EMPTY, Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { BidService } from 'src/app/makebid/services/bid.service';
import { RouterService } from '../services/router.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private service: AuthService,
                private router: Router,
                private toastr: ToastrService, private bidService: BidService, private activatedRoute: ActivatedRoute, private routeStatus: RouterService) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // tslint:disable-next-line: no-string-literal
        const routePath = this.activatedRoute.snapshot['_routerState'].url;
        if (this.service.isLoggedIn()) {
            const token = this.service.getToken();
            let request;
            if (token) {
                request = req.clone({
                    setHeaders: {
                        Authorization: token
                    }
                });
            }
            req = request;
        }

        if (req.url.includes('idcard') || req.url.includes('profile/picture')) {
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
                this.toastr.error('Authorization Failed! Please login to continue');
                if (routePath.toLowerCase().includes('process_bid')) {
                    this.bidService.setCurrentPage(2);
                } else {
                    if (this.router.url.includes('bank-details')) {
                        this.routeStatus.setRouteStatus(0);
                    } else {
                        this.routeStatus.setRouteStatus(1);
                    }
                    this.router.navigate(['/login']);
                }
                this.service.clearSessionStorage().then(() => this.service.storeUser(null));
                // this.toastr.error('Please sign in to continue', 'Unauthorised!');
                return EMPTY;
            } else {
                return throwError(error);
            }
        }));
    }
}
