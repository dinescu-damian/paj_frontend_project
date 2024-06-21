import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private _baseURL = 'http://52.22.30.103:80/api';

  get baseURL() {
    return this._baseURL;
  }

  constructor() { }
}
