import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { MenuItem } from 'primeng/api';
import { Observable, TimeoutError } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { loggedInUser } from 'src/app/makebid/models/logged-user';

@Component({
  selector: 'app-topnav',
  templateUrl: './topnav.component.html',
  styleUrls: ['./topnav.component.scss']
})
export class TopnavComponent implements OnInit, AfterViewInit {
  userDetails$: Observable<any>;
  imgBase = 'https://api.buba.ng/app/api/uploads/';
  processing: boolean;
  currentUrl: string[];
  showMobileNav = false;
  display: boolean;
  @Output() toggleSideMenuEmitter = new EventEmitter();
  @Output() closeBannerEmitter = new EventEmitter();
  noBanner = true;
  items: MenuItem[];
  addAnimation: boolean;
  constructor(private authService: AuthService, private toastr: ToastrService, public router: Router) {
    // window.onclick = (e) => {
    //   if (!e.target.matches('.dropdown-btn')) {
    //     const myDropdown = document.getElementById('myDropdown');
    //     if (myDropdown.classList.contains('show')) {
    //       myDropdown.classList.remove('show');
    //     }
    //   }
    // };
   
  }

  ngAfterViewInit() {
    let keysPressed = {};
    const searchInput = document.getElementById('searchInput');
    document.addEventListener('keydown', (event) => {
      keysPressed[event.key] = true;
   
      if (keysPressed['Control'] && event.key == '/') {
        searchInput.focus();
          // alert(event.key);
      }
   });
    
  }
  ngOnInit(): void {
    this.router.events.subscribe(evt => {
      if (evt instanceof NavigationEnd) {
        this.display = false;
      }
    });
    if (this.authService.isLoggedIn()) {
      this.refreshWallet();
    }
    this.userDetails$ = this.authService.getUser$();
    this.currentUrl = this.router.url.split('/');
    this.items = [
      {
        label: 'Update',
        icon: 'pi pi-refresh'
      },
      {
        label: 'Delete',
        icon: 'pi pi-times'
      },
      {
        label: 'Angular Website',
        icon: 'pi pi-external-link',
        routerLink: '/dashboard/home',
      },
      {
        label: 'Router',
        icon: 'pi pi-upload',
        routerLink: '/fileupload'
      }
    ];
  }

  toggleSideMenu() {
    // this.showMobileNav = ! this.showMobileNav;
    // this.toggleSideMenuEmitter.emit();
    this.display =! this.display;
  }

  closeBanner() {
    this.addAnimation = true;
    setTimeout(() => {
      this.noBanner = true;
    this.closeBannerEmitter.emit(true);
    }, 100);
  }
  get showUserBalance() {
    if (this.currentUrl[1].includes('process_bid')) {
      return true;
    } else {
      return false;
    }
  }

  refreshWallet() {
    this.processing = true;
    this.authService.getWalletBalance().subscribe((data: loggedInUser) => {
      this.processing = false;
      this.authService.storeUser(data.user);
    }, (error: any) => {
      this.processing = false;
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401) {
        } else {
          this.toastr.error('Server error. Please try again later', 'Error');
        }
      } else if (error instanceof TimeoutError) {
        this.toastr.error('Server timed out. Please try again later', 'Time Out!');
      } else {
        this.toastr.error('An unknown error has occured. Please try again later', 'Error');
      }
    });
  }

  get showHomeNav() {
    if (this.currentUrl[1].includes('home')) {
      return true;
    } else {
      return false;
    }
  }

  toggleDropdown() {
    document.getElementById('myDropdown').classList.toggle('show');
  }

  logOut() {
    this.authService.clearSessionStorage().then(() => {
      this.authService.storeUser(null);
      this.router.navigate(['/lobby']);
    });
  }

  closeSideMenu() {
    // this.display = false;
  }
}
