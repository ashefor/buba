import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LandingService {

  constructor(private http: HttpClient) { }

  fetchLandingBids(details) {
    return this.http.post(`${environment.bubaApi}/bids`, details);
  }

  fetchTodayDeals() {
    return this.http.get(`${environment.bubaApi}/products/list/ticket`);
  }

  fetchCashDeals() {
    return this.http.get(`${environment.bubaApi}/products/list/bid`);
  }
  fetchSortBids(details) {
    return this.http.post(`${environment.bubaApi}/bids/sort`, details);
  }
}
