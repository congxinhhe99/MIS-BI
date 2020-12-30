import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CmsRoutingModule } from './cms-routing.module';
import { OrganizationComponent } from './organization/organization/organization.component';
import { OrganizationImportItemComponent } from './organization/organization-import-item/organization-import-item.component';
import { OrganizationItemComponent } from './organization/organization-item/organization-item.component';
import { SharedModule } from '@shared';
import { AgGridModule } from 'ag-grid-angular';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
@NgModule({
  declarations: [OrganizationComponent, OrganizationImportItemComponent, OrganizationItemComponent],
  imports: [CommonModule, NzInputNumberModule, AgGridModule, CmsRoutingModule, SharedModule],
})
export class CmsModule {}
