import { provinceRouter } from '@util';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { _HttpClient } from '@delon/theme';
import { Injectable } from '@angular/core';
import { QueryFilerModel } from '@model';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProvinceService {

  constructor(private http: _HttpClient) { }

  create(model: any): Observable<any> {
    return this.http.post(environment.BASE_API_URL + provinceRouter.create, model);
  }
  createMany(model: any[]): Observable<any> {
    return this.http.post(environment.BASE_API_URL + provinceRouter.createMany, model);
  }
  getFilter(model: QueryFilerModel): Observable<any> {
    return this.http.post(environment.BASE_API_URL + provinceRouter.getFilter, model);
  }

  getAll(): Observable<any> {
    return this.http.get(environment.BASE_API_URL + provinceRouter.getAll);
  }
  update(model: any): Observable<any> {
    return this.http.put(environment.BASE_API_URL + provinceRouter.update, model);
  }
  getById(id: string): Observable<any> {
    return this.http.get(environment.BASE_API_URL + provinceRouter.getById + id);
  }
  delete(list: [string]): Observable<any> {
    const option = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: list,
    };
    return this.http.request('delete', environment.BASE_API_URL + provinceRouter.delete, option);
  }
  getListCombobox(): Observable<any> {
    return this.http.get(environment.BASE_API_URL + provinceRouter.getListCombobox);
  }
}
