import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private authService: AuthService) {}
  
  title = 'app';
  isLoggedIn = false;

  ngOnInit(): void {
    if(window.localStorage.getItem('currentUser') && typeof window.localStorage.getItem('currentUser') !== 'undefined') {
      this.isLoggedIn = true;
    }
  }

  onLogout():void {
    this.authService.logoutUser();
  }
}
