import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class GamesService {

  constructor(private http: HttpClient) { }

  fetchGameSession() {
    return this.http.get(`${environment.bubaApi}/daily_special/list`).pipe(catchError((error) => throwError(error)));
  }

  buyTickets(tickets) {
    return this.http.post(`${environment.bubaApi}/daily_special/buy`, tickets).pipe(catchError((error) => throwError(error)));
  }

  checkTicketStatus(bid) {
    return this.http.post(`${environment.bubaApi}/ticket/check`, bid).pipe(catchError(error => throwError(error)));
  }
}
