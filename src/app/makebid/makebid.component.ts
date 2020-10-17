import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-makebid',
  templateUrl: './makebid.component.html',
  styleUrls: ['./makebid.component.scss']
})
export class MakebidComponent implements OnInit {
  currentPage = 1;
  constructor() { }

  ngOnInit(): void {
  }

  changePage() {
    this.currentPage += 1;
  }

 

  goToNextPage(event) {
    console.log(event);
    this.currentPage += 1;
  }
}
