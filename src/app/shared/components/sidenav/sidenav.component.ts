import { Component, OnInit, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit, AfterViewInit {
  shouldOpenMenu: boolean;
  constructor(private authService: AuthService, private router: Router) {
    this.shouldOpenMenu = router.url.includes('games');
  }

  ngOnInit(): void {
  }

  get isLoggedIn() {
    return this.authService.isLoggedIn();
  }
  ngAfterViewInit() {
    const accordions = document.getElementsByClassName('accordion');
    let i;
    for (i = 0; i < accordions.length; i++) {
      const submenu = accordions[i] as HTMLElement;
      submenu.onclick = (e) => {
        const shouldOpen = submenu.classList.contains('accordion-open');
        e.preventDefault();
        closeAllMenus();

        if (shouldOpen) {
          submenu.classList.add('accordion-open');
          submenu.nextElementSibling.classList.add('submenu-show');
        }
        e.stopPropagation();
        submenu.classList.toggle('accordion-open');
        submenu.nextElementSibling.classList.toggle('submenu-show');
      };

      function closeAllMenus() {
        const menus = document.querySelectorAll('.accordion');
        menus.forEach(el => {
          el.classList.remove('accordion-open');
          el.nextElementSibling.classList.remove('submenu-show');
        });
      }
    }
  }
  logOut() {
    this.authService.clearSessionStorage().then(() => {
      this.authService.storeUser(null);
      this.router.navigate(['/login']);
    });
  }

}
