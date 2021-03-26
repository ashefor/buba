import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-winning-marquee',
  templateUrl: './winning-marquee.component.html',
  styleUrls: ['./winning-marquee.component.scss']
})
export class WinningMarqueeComponent implements OnInit {
  winners$: Observable<any>;

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    this.winners$ = this.auth.getMarqueWinners$();
  }

}
