import { _HttpClient } from '@delon/theme';
import { HttpHeaders } from '@angular/common/http';
import { QueryFilerModel } from './../../models/core/query-filter.model';
import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { organizationRouter } from '@util';
@Injectable({
  providedIn: 'root',
})
export class OrganizationService {
  constructor(private http: _HttpClient) {}

  create(model: any): Observable<any> {
    return this.http.post(environment.BASE_API_URL + organizationRouter.create, model);
  }

  createMany(model: any[]): Observable<any> {
    return this.http.post(environment.BASE_API_URL + organizationRouter.createMany, model);
  }

  update(model: any): Observable<any> {
    return this.http.put(environment.BASE_API_URL + organizationRouter.update, model);
  }

  getById(id: string): Observable<any> {
    return this.http.get(environment.BASE_API_URL + organizationRouter.getById + id);
  }

  delete(list: [string]): Observable<any> {
    console.log(list);
    const option = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: list,
    };
    return this.http.request('delete', environment.BASE_API_URL + organizationRouter.delete, option);
  }

  getFilter(model: QueryFilerModel): Observable<any> {
    console.log(model);

    return this.http.post(environment.BASE_API_URL + organizationRouter.getFilter, model);
  }

  getAll(): Observable<any> {
    return this.http.get(environment.BASE_API_URL + organizationRouter.getAll);
  }

  getListCombobox(districtId: string = ''): Observable<any> {
    return this.http.get(environment.BASE_API_URL + organizationRouter.getListCombobox);
  }
}
