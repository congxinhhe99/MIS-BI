import { Component, Inject, OnDestroy, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StartupService } from '@core';
import { ReuseTabService } from '@delon/abc/reuse-tab';
import { DA_SERVICE_TOKEN, ITokenService, SocialOpenType, SocialService } from '@delon/auth';
import { SettingsService, _HttpClient } from '@delon/theme';
import { environment } from '@env/environment';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

import { AuthenticationService } from '@service';
import { ROLE_SYS_ADMIN } from '@util';

@Component({
  selector: 'passport-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  providers: [SocialService],
})
export class UserLoginComponent implements OnDestroy {
  constructor(
    fb: FormBuilder,
    modalSrv: NzModalService,
    private router: Router,
    private settingsService: SettingsService,
    private socialService: SocialService,
    @Optional()
    @Inject(ReuseTabService)
    private reuseTabService: ReuseTabService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private startupSrv: StartupService,
    public http: _HttpClient,
    public msg: NzMessageService,
    public authenticationService: AuthenticationService,
  ) {
    this.form = fb.group({
      userName: [null, [Validators.required, Validators.minLength(4)]],
      password: [null, Validators.required],
      mobile: [null, [Validators.required, Validators.pattern(/^1\d{10}$/)]],
      captcha: [null, [Validators.required]],
      remember: [true],
    });
    modalSrv.closeAll();
    // localStorage.clear();
    this.tokenService.clear();
    this.settingsService.setUser({});
  }

  // #region fields

  get userName() {
    return this.form.controls.userName;
  }
  get password() {
    return this.form.controls.password;
  }
  get remember() {
    return this.form.controls.remember;
  }
  get mobile() {
    return this.form.controls.mobile;
  }
  get captcha() {
    return this.form.controls.captcha;
  }
  form: FormGroup;
  error = '';
  type = 0;

  count = 0;
  interval$: any;

  isLoading = false;
  // #endregion

  // #region get captcha
  switch(ret: any) {
    this.type = ret.index;
  }

  getCaptcha() {
    if (this.mobile.invalid) {
      this.mobile.markAsDirty({ onlySelf: true });
      this.mobile.updateValueAndValidity({ onlySelf: true });
      return;
    }
    this.count = 59;
    this.interval$ = setInterval(() => {
      this.count -= 1;
      if (this.count <= 0) {
        clearInterval(this.interval$);
      }
    }, 1000);
  }

  // #endregion

  submit() {
    this.isLoading = true;
    this.error = '';
    if (this.type === 0) {
      this.userName.markAsDirty();
      this.userName.updateValueAndValidity();
      this.password.markAsDirty();
      this.password.updateValueAndValidity();
      if (this.userName.invalid || this.password.invalid) {
        return;
      }
    } else {
      this.mobile.markAsDirty();
      this.mobile.updateValueAndValidity();
      this.captcha.markAsDirty();
      this.captcha.updateValueAndValidity();
      if (this.mobile.invalid || this.captcha.invalid) {
        return;
      }
    }

    this.authenticationService
      .login({
        username: this.userName.value,
        password: this.password.value,
        rememberMe: this.remember.value,
      })
      .subscribe((res: any) => {
        this.isLoading = false;
        console.log(res);

        if (res.code !== 200) {
          this.error = res.message;
          return;
        }
        if (res.data === null || res.data === undefined) {
          this.error = res.message;
          return;
        }
        if (res.data.userModel === null) {
          this.error = res.message;
          return;
        }

        // Clear route reuse information
        this.reuseTabService.clear();

        const isSysAdmin = res.data.listRole === null || res.data.listRole === undefined ? false : res.data.listRole.includes(ROLE_SYS_ADMIN);

        // Set user token information
        this.tokenService.set({
          id: res.data.userId,
          token: res.data.tokenString,
          email: res.data.userModel.email,
          timeExpride: res.data.timeExpride,
          time: res.data.timeExpride,
          name: res.data.userModel.name,
          appId: res.data.applicationId,
          rights: res.data.listRight,
          roles: res.data.listRole,
          isSysAdmin
        });

        this.settingsService.setUser({
          name: res.data.userModel.name,
          avatar: './assets/tmp/img/avatar.jpg',
          email: res.data.userModel.email,
        });

        // Retrieving StartupService content,
        // we always believe that application information will generally be affected by the scope of the current user authorization
        this.startupSrv.load().then(() => {
          let url = this.tokenService.referrer.url || '/';
          if (url.includes('/passport')) {
            url = '/';
          }
          this.router.navigateByUrl(url);
        });
      }, (error: any) => {
        this.isLoading = false;
        this.error = 'Sai tên đăng nhập hoặc mật khẩu';
      });
  }

  ngOnDestroy(): void {
    if (this.interval$) {
      clearInterval(this.interval$);
    }
  }
}
