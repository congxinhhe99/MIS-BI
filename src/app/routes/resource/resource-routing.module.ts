import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AreaOperationComponent } from './area-operation/area-operation/area-operation.component';
import { CommuneComponent } from './commune/commune/commune.component';
import { DistrictComponent } from './district/district/district.component';
import { ProvinceComponent } from './province/province/province.component';

const routes: Routes = [
  {
    path: '',
    // component: LayoutProComponent,
    children: [
      { path: '', redirectTo: 'unit', pathMatch: 'full' },
      { path: 'province', component: ProvinceComponent },
      { path: 'district', component: DistrictComponent },
      { path: 'commune', component: CommuneComponent },
      { path: 'area-operation', component: AreaOperationComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResourceRoutingModule {}
