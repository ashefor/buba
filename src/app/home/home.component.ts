import { AfterViewInit, Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  displayLandingModal: boolean;
  youtubeUrls = [
    'https://www.youtube.com/embed/yEoa3kUqF8g?autoplay=1&mute=0',
    'https://www.youtube.com/embed/w2IyneuLHaE',
    'https://www.youtube.com/embed/H5OQiKad3n8',
    'https://www.youtube.com/embed/J9CnA3OxR18',
    'https://www.youtube.com/embed/AKqJYZK8fh0',
    'https://www.youtube.com/embed/rb82Bk_M0kY'
  ]
  responsiveOptions: { breakpoint: string; numVisible: number; numScroll: number; }[];
  safeYouTubeUrls: any[];

  constructor(private sanitizer: DomSanitizer,) {
    this.safeYouTubeUrls = this.youtubeUrls.map(url => this.sanitizer.bypassSecurityTrustResourceUrl(url));
    this.responsiveOptions = [
      {
          breakpoint: '1024px',
          numVisible: 3,
          numScroll: 3
      },
      {
          breakpoint: '768px',
          numVisible: 2,
          numScroll: 2
      },
      {
          breakpoint: '560px',
          numVisible: 1,
          numScroll: 1
      }
  ];
   }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      // this.displayLandingModal = true;
    }, 1000);
  }
}
