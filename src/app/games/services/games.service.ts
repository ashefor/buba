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

  fetchDailySpecialSession() {
    return this.http.get(`${environment.bubaApi}/daily_special/list`).pipe(catchError((error) => throwError(error)));
  }

  fetchQuickPlaySession() {
    return this.http.get(`${environment.bubaApi}/quick/session/list`).pipe(catchError((error) => throwError(error)));
  }

  fetchSpinItems() {
    return this.http.get(`${environment.bubaApi}/spin/start`).pipe(catchError((error) => throwError(error)));
  }

  startSpinSession(spinDetails) {
    return this.http.post(`${environment.bubaApi}/spin/stake`, spinDetails).pipe(catchError((error) => throwError(error)));
  }

  retrySpinSession() {
    return this.http.get(`${environment.bubaApi}/spin/stake/retry`).pipe(catchError((error) => throwError(error)));
  }

  buyTickets(tickets) {
    return this.http.post(`${environment.bubaApi}/daily_special/buy`, tickets).pipe(catchError((error) => throwError(error)));
  }

  buyQuickPlayTickets(tickets) {
    return this.http.post(`${environment.bubaApi}/quick/buy`, tickets).pipe(catchError((error) => throwError(error)));
  }

  checkTicketStatus(bid) {
    return this.http.post(`${environment.bubaApi}/ticket/check`, bid).pipe(catchError(error => throwError(error)));
  }

  fetchAllGamesHistory(pageDetails) {
    return this.http.post(`${environment.bubaApi}/games/history`, pageDetails).pipe(catchError((error) => throwError(error)));
  }

  fetchAllSpinHistory(pageDetails) {
    return this.http.post(`${environment.bubaApi}/spin/history`, pageDetails).pipe(catchError((error) => throwError(error)));
  }
}
