import { Injectable } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { LoginCredentials } from '../authentication/interfaces/login-credentials.interface';
import { RegisterCredentials } from '../authentication/interfaces/register-credentials.interface';
import { ConfigService } from './config.service';
import { HttpStatusCode } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private currentUser: User | null = null;

  constructor(private configService: ConfigService) { 
  }

  async login(credentials: LoginCredentials) {
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

      if(response.status == HttpStatusCode.Ok) {

        const userData = await response.json();
        this.currentUser = userData as User;        
        console.log(this.currentUser);
      }
      
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
    // TODO: request to backend to delete the HttpOnly token cookie

    this.currentUser = null;
  }

  get user(): User | null {
    return this.currentUser;
  }
  get isAuthenticated() : boolean {
    return this.currentUser ? true : false;
  }
}
