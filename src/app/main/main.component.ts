import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  display: boolean;
  winners$: Observable<any>;
  winner: any;
  noBanner = true;

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    this.auth.retrieveWinners().subscribe((data: any) => {
      const winner = document.getElementById('winner');
      if (data.winners.length) {
        setInterval(() => {
          const index = Math.floor(Math.random() * (19 - 0) + 0);
          this.winner = data.winners[index];
          winner.style.display = 'inline-block';
          const interval = setInterval(() => {
            this.winner = data.winners[index];
          }, 2000);
          setTimeout(() => {
            winner.style.display = 'none';
            clearInterval(interval);
          }, 2000);
        }, 4000);
      }
    });
  }

  showSideMenu(event) {
    this.display = !this.display;
  }

  closeBanner(event) {
    this.noBanner = event;
  }
  closeSideMenu() {
    this.display = false;
  }
}
