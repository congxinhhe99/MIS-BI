import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationImportItemComponent } from './organization-import-item.component';

describe('OrganizationImportItemComponent', () => {
  let component: OrganizationImportItemComponent;
  let fixture: ComponentFixture<OrganizationImportItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizationImportItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationImportItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
