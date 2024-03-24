import { Injectable } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { LoginCredentials } from '../authentication/interfaces/login-credentials.interface';
import { RegisterCredentials } from '../authentication/interfaces/register-credentials.interface';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private currentUser: User | null = null;

  constructor(private configService: ConfigService) { 
    // Check for stored credentials
    const storedData = localStorage.getItem("RememberedUser");
    if(storedData){
      this.currentUser = JSON.parse(storedData);
    }
  }

  async login(credentials: LoginCredentials, rememberMe: boolean) {
    try{
      const response = await fetch(
        `${this.configService.baseURL}/auth/login`,
        {
          method: "POST",
          headers: {
            'Authorization': 'Basic ' + window.btoa(`${credentials.email}:${credentials.password}`)
          }
        }
      );

      console.log(response);

      // If the rememberMe option is checked, store user credentials in local storage
      if(rememberMe)
        localStorage.setItem("RememberedUser", JSON.stringify(this.currentUser));

      return response.status;
    } catch(error){
      console.error(error);
    }

    return 0;
  }

  async register(credentials: RegisterCredentials) {
    try
    {
      const response = await fetch(
        `${this.configService.baseURL}/auth/register`,
        {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
            name: credentials.firstName,
            surname: credentials.lastName,
          }),
        }
      );
      
      return response.status;
    } catch(error){
      console.error(error);
    }

    return 0;
  }

  logout() {
    // Remove the remembered user (nothing will happen if there is no remembered user)
    localStorage.removeItem("RememberedUser");

    this.currentUser = null;
  }

  get user(): User | null {
    return this.currentUser;
  }
  get isAuthenticated() : boolean {
    return this.currentUser ? true : false;
  }
}
