import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
  noBanner = true;
  display: boolean;
  activeState: boolean[] = [true, false, false, false, false, false, false, false];
  constructor() { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }

  toggle(index: number) {
    this.activeState = this.activeState.map(() => false);
    this.activeState[index] = !this.activeState[index];
    window.scrollTo(0, 150);
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
