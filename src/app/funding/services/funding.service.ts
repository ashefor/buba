import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FundingService {

  constructor(private http: HttpClient) { }

  fetchTransactions(pageDetails) {
    return this.http.post(`${environment.bubaApi}/transactions/list`, pageDetails).pipe(catchError((error) => throwError(error)));
  }
}
