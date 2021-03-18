import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class GamesService {

  constructor(private http: HttpClient) { }

  fetchDailySpecialSession() {
    return this.http.get(`${environment.bubaApi}/daily_special/list`);
  }

  fetchQuickPlaySession() {
    return this.http.get(`${environment.bubaApi}/quick/session/list`);
  }

  fetchSpinItems() {
    return this.http.get(`${environment.bubaApi}/spin/start`);
  }

  fetchLuckyJakaSession() {
    return this.http.get(`${environment.bubaApi}/lucky_jaka`);
  }

  startSpinSession(spinDetails) {
    return this.http.post(`${environment.bubaApi}/spin/stake`, spinDetails);
  }

  startBereketeSpinSession(spinDetails) {
    return this.http.post(`${environment.bubaApi}/berekete/stake`, spinDetails);
  }

  retrySpinSession() {
    return this.http.get(`${environment.bubaApi}/spin/stake/retry`);
  }

  buyTickets(tickets) {
    return this.http.post(`${environment.bubaApi}/daily_special/buy`, tickets);
  }

  buyLuckyJakaTicket(tickets) {
    return this.http.post(`${environment.bubaApi}/lucky_jaka/stake`, tickets);
  }

  buyQuickPlayTickets(tickets) {
    return this.http.post(`${environment.bubaApi}/quick/buy`, tickets);
  }

  checkTicketStatus(bid) {
    return this.http.post(`${environment.bubaApi}/ticket/check`, bid).pipe(catchError(error => throwError(error)));
  }

  fetchAllGamesHistory(pageDetails) {
    return this.http.post(`${environment.bubaApi}/games/history`, pageDetails);
  }

  fetchAllSpinHistory(pageDetails) {
    return this.http.post(`${environment.bubaApi}/spin/history`, pageDetails);
  }
  fetchBereketeHistory(pageDetails) {
    return this.http.post(`${environment.bubaApi}/berekete/history`, pageDetails);
  }
  fetchLuckyJakaHistory(pageDetails) {
    return this.http.post(`${environment.bubaApi}/lucky_jaka/history`, pageDetails);
  }

  fetchGamesHistory(details) {
    return forkJoin([this.fetchAllGamesHistory(details.games),
       this.fetchAllSpinHistory(details.spin), this.fetchBereketeHistory(details.berekete), this.fetchLuckyJakaHistory(details.luckyjaka)]);
  }
}
