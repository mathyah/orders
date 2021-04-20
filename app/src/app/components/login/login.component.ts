import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})



export class LoginComponent implements OnInit {

  usuario = {
    username: '',
    password: ''
  };

  constructor(private authService: AuthService, private router: Router) { }
  ngOnInit(): void {
  }
  onLogin() {
    return this.authService
      .loginuser(this.usuario.username, this.usuario.password)
      .subscribe(data => {
        if(data) {
          this.authService.setUser(data['user']);
          this.authService.setToken(data['user']['auth_token']);
          this.router.navigate(['/listorders'])  
            .then(() => {
              window.location.reload();
            });
        }
      },
      error => console.log(error)
    );
  }

}
