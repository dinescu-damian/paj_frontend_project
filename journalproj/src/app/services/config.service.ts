import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private _baseURL = 'https://localhost:80/api';

  get baseURL() {
    return this._baseURL;
  }

  constructor() { }
}
