import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { EMPTY } from 'rxjs';
import { LandingService } from './landing.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit, OnDestroy{
  noBanner = true;
  display: boolean;
  displayLandingModal: boolean;
  defaultImage = 'assets/img/placeholder.webp';
  responsiveOptions = [
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
  jumbos = [
    {
      url: 'assets/img/top-banner3.jpg',
      alt: 'Banner 3',
      router: '/process_bid/BUBA_4384943969572989514070252681225670427'
    },
    {
      url: 'assets/img/top-banner.jpg',
      alt: 'Banner 1',
      router: '/dashboard/games/berekete'
    },
    {
      url: 'assets/img/top-banner2.png',
      alt: 'Banner 2',
      router: '/process_bid/BUBA_5529627156724418712663191374450706596'
    }
  ];
  products = ['', '', '', '', ''];
  youtubeUrls = [
    'https://www.youtube.com/embed/yEoa3kUqF8g?autoplay=1&mute=0',
    'https://www.youtube.com/embed/w2IyneuLHaE'
  ]
  hotBids: any[];
  todayBids: any[];
  recommendedBids: any[];
  safeUrl: any;
  cashBids: any;
  gadgetBids: any;
  safeYouTubeUrls: any;
  constructor(private service: LandingService, private sanitizer: DomSanitizer, private title: Title) {
    // this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/yEoa3kUqF8g')
    this.safeYouTubeUrls = this.youtubeUrls.map(url => this.sanitizer.bypassSecurityTrustResourceUrl(url))
    this.title.setTitle('More For Less - Buba');
  }
  jumboSlideConfig = {
    slidesToShow: 5,
    slidesToScroll: 5
  };
  slideConfig = {
    slidesToShow: 5,
    slidesToScroll: 5,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };
  ngOnInit(): void {
    this.fetchAllTodayBids();
    this.fetchAllRecommendedBids();
    this.fetchAllHotBids();
    this.fetchGadgetBids();
    this.fetchCashBids();
  }


  ngOnDestroy() {
    this.displayLandingModal = false;
    clearTimeout();
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

  fetchAllTodayBids() {
    const details = {
      operations_category: 'TODAYS_DEAL'
    };
    this.service.fetchLandingBids(details).subscribe((data: any) => {
      if (data.status === 'success') {
        this.todayBids = data.bids;
      }
    }, (error: any) => {
      return EMPTY;
    });
  }
  fetchAllRecommendedBids() {
    const details = {
      operations_category: 'RECOMMENDED'
    };
    this.service.fetchLandingBids(details).subscribe((data: any) => {
      if (data.status === 'success') {
        this.recommendedBids = data.bids;
      }
    }, (error: any) => {
      return EMPTY;
    });
  }
  fetchAllHotBids() {
    const details = {
      operations_category: 'HOT_DEAL'
    };
    this.service.fetchLandingBids(details).subscribe((data: any) => {
      if (data.status === 'success') {
        this.hotBids = data.bids;
      }
    }, (error: any) => {
      return EMPTY;
    });
  }

  fetchCashBids() {
    const details = {
      category: 'CASH'
    };
    this.service.fetchSortBids(details).subscribe((data: any) => {
      if (data.status === 'success') {
        this.cashBids = data.bids;
      }
    }, (error: any) => {
      return EMPTY;
    });
  }

  fetchGadgetBids() {
    const details = {
      category: 'GADGETS'
    };
    this.service.fetchSortBids(details).subscribe((data: any) => {
      if (data.status === 'success') {
        this.gadgetBids = data.bids;
      }
    }, (error: any) => {
      return EMPTY;
    });
  }
}
