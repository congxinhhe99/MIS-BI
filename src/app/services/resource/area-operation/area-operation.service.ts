import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';

import { HttpHeaders } from '@angular/common/http';
import { environment } from '@env/environment';
import { QueryFilerModel } from '@model';
import { areaOperationRouter } from '@util';
// RxJS
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AreaOperationService {
  constructor(private http: _HttpClient) {}

  create(model: any): Observable<any> {
    return this.http.post(environment.BASE_API_URL + areaOperationRouter.create, model);
  }

  createMany(model: any[]): Observable<any> {
    return this.http.post(environment.BASE_API_URL + areaOperationRouter.createMany, model);
  }

  update(model: any): Observable<any> {
    return this.http.put(environment.BASE_API_URL + areaOperationRouter.update, model);
  }

  getById(id: string): Observable<any> {
    return this.http.get(environment.BASE_API_URL + areaOperationRouter.getById + id);
  }

  delete(list: [string]): Observable<any> {
    const option = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: list,
    };
    return this.http.request('delete', environment.BASE_API_URL + areaOperationRouter.delete, option);
  }

  getFilter(model: QueryFilerModel): Observable<any> {
    return this.http.post(environment.BASE_API_URL + areaOperationRouter.getFilter, model);
  }

  getAll(): Observable<any> {
    return this.http.get(environment.BASE_API_URL + areaOperationRouter.getAll);
  }

  getListCombobox(): Observable<any> {
    return this.http.get(environment.BASE_API_URL + areaOperationRouter.getListCombobox);
  }
}
