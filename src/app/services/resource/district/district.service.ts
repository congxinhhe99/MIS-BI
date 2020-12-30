import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';

import { HttpHeaders } from '@angular/common/http';
import { environment } from '@env/environment';
import { QueryFilerModel } from '@model';
import { districtRouter } from '@util';
// RxJS
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DistrictService {
  constructor(private http: _HttpClient) { }

  create(model: any): Observable<any> {
    return this.http.post(environment.BASE_API_URL + districtRouter.create, model);
  }

  createMany(model: any[]): Observable<any> {
    return this.http.post(environment.BASE_API_URL + districtRouter.createMany, model);
  }

  update(model: any): Observable<any> {
    return this.http.put(environment.BASE_API_URL + districtRouter.update, model);
  }

  getById(id: string): Observable<any> {
    return this.http.get(environment.BASE_API_URL + districtRouter.getById + id);
  }

  delete(list: [string]): Observable<any> {
    const option = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: list,
    };
    return this.http.request('delete', environment.BASE_API_URL + districtRouter.delete, option);
  }

  getFilter(model: QueryFilerModel): Observable<any> {
    return this.http.post(environment.BASE_API_URL + districtRouter.getFilter, model);
  }

  getAll(): Observable<any> {
    return this.http.get(environment.BASE_API_URL + districtRouter.getAll);
  }

  getListCombobox(provinceId: string = ''): Observable<any> {
    return this.http.get(environment.BASE_API_URL + districtRouter.getListCombobox + '?provinceId=' + provinceId);
  }
}
