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

  fetchTransactions() {
    return this.http.get(`${environment.bubaApi}/bid/history`).pipe(catchError((error) => throwError(error)));
  }
}
