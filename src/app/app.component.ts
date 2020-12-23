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
    this.meta.addTags([
      { name: "keywords", content: "Buba, Bid, Auction, PS4, PS5, Iphone, iphone, iPhone 12, wig, hair, bone straight", },
      { name: "description", content: "Welcome to your Buba Account Dashboard" },
      { name: "twitter:card", content: "summary" },
      {meta:'property="og:type"', content:"website"},
      { name: "twitter:domain", content: "account.buba.ng" },
      { name: "twitter:site", content: "@michaelashefor" },
      {name: "twitter:title", content: "Buba Account"},
      {name: "twitter:description", content: "Create your Buba account to enjoy More for Less!"},
    ], true)
  }

  ngOnInit() {
    this.primengConfig.ripple = true;
  }
}
