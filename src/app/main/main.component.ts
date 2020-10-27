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
  constructor(private auth: AuthService) { }

  ngOnInit(): void {
  }

  showSideMenu(event) {
    this.display = ! this.display;
  }
  

  closeSideMenu() {
    this.display = false;
  }
}
