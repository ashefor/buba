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

  fetchSortBids(details) {
    return this.http.post(`${environment.bubaApi}/bids/sort`, details);
  }
}
