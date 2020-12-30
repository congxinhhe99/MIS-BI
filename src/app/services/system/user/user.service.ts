import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { environment } from '@env/environment';
import { userRouter } from '@util';
// RxJS
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: _HttpClient) { }

  getRightOfUser(userId: string, applicationId: string): Observable<any> {
    return this.http.get(
      environment.BASE_API_URL + userRouter.getListRightOfUser + `/${userId}/right?applicationId=${applicationId}`,
    );
  }

  getRoleOfUser(userId: string, applicationId: string): Observable<any> {
    return this.http.get(
      environment.BASE_API_URL + userRouter.getListRoleOfUser + `/${userId}/role?applicationId=${applicationId}`,
    );
  }
}
