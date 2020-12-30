import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';

import { AgGridModule } from 'ag-grid-angular';

import { ResourceRoutingModule } from './resource-routing.module';

import { AreaOperationImportItemComponent } from './area-operation/area-operation-import-item/area-operation-import-item.component';
import { AreaOperationItemComponent } from './area-operation/area-operation-item/area-operation-item.component';
import { AreaOperationComponent } from './area-operation/area-operation/area-operation.component';

import { ProvinceImportItemComponent } from './province/province-import-item/province-import-item.component';
import { ProvinceItemComponent } from './province/province-item/province-item.component';
import { ProvinceComponent } from './province/province/province.component';

import { DistrictImportItemComponent } from './district/district-import-item/district-import-item.component';
import { DistrictItemComponent } from './district/district-item/district-item.component';
import { DistrictComponent } from './district/district/district.component';

import { CommuneImportItemComponent } from './commune/commune-import-item/commune-import-item.component';
import { CommuneItemComponent } from './commune/commune-item/commune-item.component';
import { CommuneComponent } from './commune/commune/commune.component';

@NgModule({
  declarations: [
    AreaOperationComponent,
    AreaOperationItemComponent,
    AreaOperationImportItemComponent,
    ProvinceComponent,
    ProvinceItemComponent,
    ProvinceImportItemComponent,
    DistrictComponent,
    DistrictItemComponent,
    DistrictImportItemComponent,
    CommuneComponent,
    CommuneItemComponent,
    CommuneImportItemComponent,
  ],
  imports: [SharedModule, CommonModule, ResourceRoutingModule, AgGridModule.withComponents([])],
})
export class ResourceModule {}
