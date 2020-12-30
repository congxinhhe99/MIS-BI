import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { Inject, Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { ALAIN_I18N_TOKEN, SettingsService, _HttpClient } from '@delon/theme';
import { environment } from '@env/environment';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Observable, of, throwError } from 'rxjs';
import { catchError, finalize, mergeMap, retry } from 'rxjs/operators';

// import { I18NService } from '../i18n/i18n.service';

import { LoaderService } from '../../services/core/loader/loader.service';
import { MessageService } from '../../services/core/message/message.service';

const CODEMESSAGE = {
  200: '200 - Success',
  201: '201 - Success',
  202: '202 - Success',
  204: '204 - Xóa dữ liệu thành công',
  400: '400 - Error',
  401: '401 - Unauthorized',
  403: '403 - Forbidden Error',
  404: '404 - Not Found',
  406: '406 - Not Acceptable',
  410: '410 - Gone',
  422: '422 - Unprocessable Entity',
  500: '500 - Internal Server Error',
  502: '502 - Bad Gateway',
  503: '503 - Service Unavailable',
  504: '504 - Gateway Timeout',
};

/**
 * The default HTTP interceptor, see the registration details `app.module.ts`
 */
@Injectable()
export class DefaultInterceptor implements HttpInterceptor {
  private requests: HttpRequest<any>[] = [];

  constructor(
    private injector: Injector,
    private settingsService: SettingsService,
    public loaderService: LoaderService,
    public messageService: MessageService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    // @Inject(ALAIN_I18N_TOKEN) private i18n: I18NService,
  ) { }

  private get notification(): NzNotificationService {
    return this.injector.get(NzNotificationService);
  }

  private goTo(url: string) {
    setTimeout(() => this.injector.get(Router).navigateByUrl(url));
  }

  private checkStatus(ev: HttpResponseBase) {
    if ((ev.status >= 200 && ev.status < 300) || ev.status === 401) {
      return;
    }

    const errortext = CODEMESSAGE[ev.status] || ev.statusText;
    const mess = `Request error ${ev.status}: ${ev.url}` + errortext;
    this.messageService.add(mess);
  }

  private handleData(ev: HttpResponseBase): Observable<any> {
    // It may not be possible to perform the `end()` operation of `_HttpClient` because of `throw` export
    if (ev.status > 0) {
      this.injector.get(_HttpClient).end();
    }
    this.checkStatus(ev);
    // Business processing: some common operations
    switch (ev.status) {
      case 200:
        break;
      case 401:
        if (this.tokenService.get().token) {
          this.messageService.add(`Not logged in or the login has expired, please log in again`);
        }
        // Clear token information
        this.settingsService.setUser({});
        (this.injector.get(DA_SERVICE_TOKEN) as ITokenService).clear();
        this.goTo('/passport/login');
        break;
      case 403:
        break;
      case 404:
        break;
      case 500:
        // this.messageService.add(`Error 500, please log in again`);
        // this.goTo(`/exception/${ev.status}`);
        break;
      default:
        if (this.tokenService.get().token) {
          this.messageService.add(`Not logged in or the login has expired, please log in again`);
        }
        this.goTo('/passport/login');
        if (ev instanceof HttpErrorResponse) {
          console.warn('Unknown error, mostly due to backend not supporting CORS or invalid configuration', ev);
        }
        break;
    }
    if (ev instanceof HttpErrorResponse) {
      return throwError(ev);
    } else {
      return of(ev);
    }
  }
  removeRequest(req: HttpRequest<any>) {
    const i = this.requests.indexOf(req);
    if (i >= 0) {
      this.requests.splice(i, 1);
    }
    this.loaderService.isLoading.next(this.requests.length > 0);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Unified plus server prefix
    let url = req.url;
    if (!url.startsWith('https://') && !url.startsWith('http://')) {
      url = environment.SERVER_URL + url;
    }
    let newReq = req.clone({ url });
    if (this.tokenService.get().token) {
      newReq = newReq.clone({
        headers: newReq.headers
          .set('Authorization', 'Bearer ' + this.tokenService.get().token)
          .set('X-ApplicationId', this.tokenService.get().appId),
      });
    }

    // Loader icon
    this.requests.push(newReq);
    // console.log('No of requests--->' + this.requests.length);
    this.loaderService.isLoading.next(true);

    return next.handle(newReq).pipe(
      mergeMap((event: any) => {
        // allow unified handling of request errors
        if (event instanceof HttpResponseBase) {
          return this.handleData(event);
        }
        // if everything is normal, follow up
        return of(event);
      }),
      catchError((err: HttpErrorResponse) => this.handleData(err)),
      finalize(() => {
        this.removeRequest(newReq);
      }),
    );
  }
}
