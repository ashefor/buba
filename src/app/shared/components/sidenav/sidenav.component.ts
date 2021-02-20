import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  shouldOpenMenu: boolean;
  constructor(public authService: AuthService, private router: Router) {
    this.shouldOpenMenu = router.url.includes('games');
  }

  ngOnInit(): void {
  }
  changeRoute(route) {
    console.log(route)
    this.router.navigateByUrl(route)
  }
  // closeSideBar(action) {
  //   this.closeSideBarEmitter.emit(action);
  // }
  logOut() {
    this.authService.clearSessionStorage().then(() => {
      this.authService.storeUser(null);
      this.router.navigate(['/login']);
    });
  }

}
