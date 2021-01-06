import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'More For Less - Buba';
  constructor(private primengConfig: PrimeNGConfig, private meta: Meta) {
    
  }

  ngOnInit() {
    this.primengConfig.ripple = true;
  }
}
