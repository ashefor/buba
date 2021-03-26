import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'More For Less - Buba';
  constructor(private primengConfig: PrimeNGConfig, private meta: Meta, private router: Router) {
      this.router.events.subscribe(ev => {
        if (ev instanceof NavigationEnd) {
          window.scrollTo(0, 0);
        }
      })
  }

  ngOnInit() {
    this.primengConfig.ripple = true;
  }
}
