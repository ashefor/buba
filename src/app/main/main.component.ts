import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  userDetails$: Observable<any>;
  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    this.userDetails$ = this.auth.getUser$();
  }

}
