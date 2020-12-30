import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// layout
import { LayoutProComponent } from '@brand';
import { environment } from '@env/environment';
import { LayoutPassportComponent } from '../layout/passport/passport.component';
// single pages
import { CallbackComponent } from './callback/callback.component';
// dashboard pages
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserLockComponent } from './passport/lock/lock.component';
// passport pages
import { UserLoginComponent } from './passport/login/login.component';
import { UserRegisterResultComponent } from './passport/register-result/register-result.component';
import { UserRegisterComponent } from './passport/register/register.component';

import { AgGridComponent } from './ag-grid/demo/ag-grid.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutProComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'ag-grid', component: AgGridComponent },
      // Exception
      {
        path: 'res',
        loadChildren: () => import('./resource/resource.module').then((m) => m.ResourceModule),
      },
      {
        path: 'cms',
        loadChildren: () => import('./cms/cms.module').then((m) => m.CmsModule),
      },
      // Exception
      {
        path: 'exception',
        loadChildren: () => import('./exception/exception.module').then((m) => m.ExceptionModule),
      },
    ],
  },
  // passport
  {
    path: 'passport',
    component: LayoutPassportComponent,
    children: [
      {
        path: 'login',
        component: UserLoginComponent,
        data: { title: 'Đăng nhập', titleI18n: 'app.login.login' },
      },
      // {
      //   path: 'register',
      //   component: UserRegisterComponent,
      //   data: { title: 'Đăng ký', titleI18n: 'app.register.register' },
      // },
      // {
      //   path: 'register-result',
      //   component: UserRegisterResultComponent,
      //   data: { title: 'Kết quả đăng ký', titleI18n: 'app.register.register' },
      // },
      // {
      //   path: 'lock',
      //   component: UserLockComponent,
      //   data: { title: 'Khóa', titleI18n: 'app.lock' },
      // },
    ],
  },
  // Single page not wrapped Layout
  { path: 'callback/:type', component: CallbackComponent },
  { path: '**', redirectTo: 'exception/404' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: environment.useHash,
      // NOTICE: If you use `reuse-tab` component and turn on keepingScroll you can set to `disabled`
      // Pls refer to https://ng-alain.com/components/reuse-tab
      scrollPositionRestoration: 'top',
    }),
  ],
  exports: [RouterModule],
})
export class RouteRoutingModule {}
