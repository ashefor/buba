import { Component, OnInit } from '@angular/core';
import { EMPTY } from 'rxjs';
import { LandingService } from './landing.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  noBanner = true;
  display: boolean;
  defaultImage = 'https://via.placeholder.com/500x250';
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
  hotBids: any[];
  todayBids: any[];
  recommendedBids: any[];
  constructor(private service: LandingService) { }
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
}
