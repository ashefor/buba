import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { bidDetails } from '../models/bid-details';

@Injectable({
  providedIn: 'root'
})
export class BidService {
  bidDetails$ = new BehaviorSubject<bidDetails>(null);
  userDetails$ = new BehaviorSubject<any>(null);
  walletDetails$ = new BehaviorSubject<any>(null);
  currentPage$ = new BehaviorSubject<number>(1);
  constructor(private http: HttpClient) { }

  // tslint:disable-next-line: variable-name
  listOneBid(bid_id) {
    return this.http.post(`${environment.bubaApi}/bid/one`, { bid_id }).pipe(catchError(error => throwError(error)));
  }

  setBidDetails(bid: bidDetails) {
    return this.bidDetails$.next(bid);
  }

  getBidDetails$() {
    return this.bidDetails$.asObservable();
  }

  setUserDetails(user) {
    return this.userDetails$.next(user);
  }

  getUserDetails$() {
    return this.userDetails$.asObservable();
  }

  setWalletDetails(wallet: any) {
    return this.walletDetails$.next(wallet);
  }

  getWalletDetails$() {
    return this.walletDetails$.asObservable();
  }
  setCurrentPage(page: number) {
    return this.currentPage$.next(page);
  }

  getCurrentPage$() {
    return this.currentPage$.asObservable();
  }

  buyBid(bid) {
    return this.http.post(`${environment.bubaApi}/bid/buy`, bid).pipe(catchError(error => throwError(error)));
  }
  
  checkBidStatus(bid) {
    return this.http.post(`${environment.bubaApi}/bids/check`, bid).pipe(catchError(error => throwError(error)));
  }

  initiateFlutterwave(details) {
    return this.http.post(`${environment.bubaApi}/flutterwave/initiate`, details);
  }

  verifyFlutterwave(details) {
    return this.http.post(`${environment.bubaApi}/flutterwave/verify`, details);
  }
}
