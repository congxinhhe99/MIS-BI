import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';

import { environment } from '@env/environment';

import { navigationRouter } from '@util';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  constructor(private http: _HttpClient) { }

  getNavigationOwner() {
    return this.http.get(environment.BASE_API_URL + navigationRouter.getNavigationOwner);
  }
}
