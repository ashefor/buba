import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-responsible-gaming',
  templateUrl: './responsible-gaming.component.html',
  styleUrls: ['./responsible-gaming.component.scss']
})
export class ResponsibleGamingComponent implements OnInit {
  noBanner = true;
  display: boolean;
  constructor() { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
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
