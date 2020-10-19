import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BidService {

  constructor(private http: HttpClient) { }

  listOneBid(bid_id) {
    return this.http.post(`${environment.bubaApi}/bid/one`, { bid_id }).pipe(catchError(error => throwError(error)));
  }
}
