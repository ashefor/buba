import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GetBidsService {

  constructor(private http: HttpClient) { }

  fetchOpenBids() {
    return this.http.get(`${environment.bubaApi}/bid/open`).pipe(catchError((error) => throwError(error)));
  }

  fetchAllBidHistory(pageDetails) {
    return this.http.post(`${environment.bubaApi}/bid/history`, pageDetails).pipe(catchError((error) => throwError(error)));
  }
}
