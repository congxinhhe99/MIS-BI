import { NgModule } from '@angular/core';

import { SharedModule } from '@shared';
// dashboard pages
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouteRoutingModule } from './routes-routing.module';

// passport pages
import { UserLockComponent } from './passport/lock/lock.component';
import { UserLoginComponent } from './passport/login/login.component';
import { UserRegisterResultComponent } from './passport/register-result/register-result.component';
import { UserRegisterComponent } from './passport/register/register.component';

import { AgGridModule } from 'ag-grid-angular';

import { BtnCellRenderComponent } from './ag-grid/shared/btn-cell-render/btn-cell-render.component';
import { StatusCellRenderComponent } from './ag-grid/shared/status-cell-render/status-cell-render.component';
import { StatusDeleteCellRenderComponent } from './ag-grid/shared/status-delete-cell-render/status-delete-cell-render.component';
import { StatusImportCellRenderComponent } from './ag-grid/shared/status-import-cell-render/status-import-cell-render.component';
import { StatusNameCellRenderComponent } from './ag-grid/shared/status-name-cell-render/status-name-cell-render.component';

// single pages
import { AgGridComponent } from './ag-grid/demo/ag-grid.component';
import { CallbackComponent } from './callback/callback.component';
import { ResourceModule } from './resource/resource.module';

import { ChartsModule } from 'ng2-charts';

const COMPONENTS = [
  DashboardComponent,
  // passport pages
  UserLoginComponent,
  UserRegisterComponent,
  UserRegisterResultComponent,
  UserLockComponent,
  // single pages
  CallbackComponent,
];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    RouteRoutingModule,
    AgGridModule.withComponents([
      StatusCellRenderComponent,
      StatusNameCellRenderComponent,
      StatusDeleteCellRenderComponent,
      StatusImportCellRenderComponent,
      BtnCellRenderComponent,
    ]),
    ResourceModule,
    ChartsModule,
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT,
    AgGridComponent,
    StatusCellRenderComponent,
    StatusNameCellRenderComponent,
    StatusDeleteCellRenderComponent,
    StatusImportCellRenderComponent,
    BtnCellRenderComponent,
  ],
  entryComponents: COMPONENTS_NOROUNT,
})
export class RoutesModule {}
