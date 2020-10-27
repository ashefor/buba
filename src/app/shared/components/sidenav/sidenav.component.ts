import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  @Output() closeSideBarEmitter = new EventEmitter();
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  closeSideBar(action) {
    this.closeSideBarEmitter.emit(action);
  }
  logOut() {
    this.authService.clearSessionStorage().then(() => {
      this.authService.storeUser(null);
      this.router.navigate(['/login']);
    });
  }

}
