import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  loginuser(username, password) {
    var data = {
      user: username,
      pass:password
    }
    return this.http.post('/api/public/login', data);
  }

  setUser(user): void {
    let user_string = JSON.stringify(user);
    localStorage.setItem("currentUser", user_string);
  }

  setToken(token): void {
    localStorage.setItem("accessToken", token);
  }

  logoutUser():void {
    let accessToken = localStorage.getItem("accessToken");
    const url_api = `http://localhost:4200/api/Users/logout?access_token=${accessToken}`;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("currentUser");
  }
}
