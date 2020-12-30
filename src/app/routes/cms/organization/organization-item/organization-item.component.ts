import { AreaOperationService } from './../../../../services/resource/area-operation/area-operation.service';
import { OrganizationService } from './../../../../services/cms/organization.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ProvinceService } from './../../../../services/resource/province/province.service';
import { DistrictService } from './../../../../services/resource/district/district.service';
import { CommuneService } from './../../../../services/resource/commune/commune.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ButtonModel } from './../../../../models/core/button.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-organization-item',
  templateUrl: './organization-item.component.html',
  styleUrls: ['./organization-item.component.less'],
})
export class OrganizationItemComponent implements OnInit {
  @Input() type = 'add';
  @Input() item: any;
  @Input() isVisible = false;
  @Input() option: any;
  @Output() eventEmmit = new EventEmitter<any>();

  private gridApi;

  form: FormGroup;
  moduleName = 'xã phường';

  // TODO: Cần bổ sung thêm điều kiện check có phải quản trị hệ thống hay ko?
  // Nếu là quản trị hệ thống thì cần phải

  listDistrict = [];
  listProvince = [];
  listCommune = [];
  listOrganization = [];
  listAreaOperation = [];
  listType = [
    {
      id: 1,
      name: 'Đơn vị',
    },
    {
      id: 2,
      name: 'Phòng ban',
    },
  ];
  isInfo = false;
  isEdit = false;
  isAdd = false;
  tittle = '';

  isLoading = false;
  isReloadGrid = false;

  btnSave: ButtonModel;
  btnSaveAndCreate: ButtonModel;
  btnCancel: ButtonModel;
  btnEdit: ButtonModel;

  constructor(
    private fb: FormBuilder,
    private messageService: NzMessageService,
    private communeService: CommuneService,
    private districtService: DistrictService,
    private provinceService: ProvinceService,
    private organizationService: OrganizationService,
    private areaOperationService: AreaOperationService,
    private notification: NzNotificationService,
  ) {
    this.btnSave = {
      Title: 'Lưu',
      Titlei18n: '',
      Visible: true,
      Enable: true,
      GrandAccess: true,
      Click: ($event: any) => {
        this.save();
      },
    };
    this.btnSaveAndCreate = {
      Title: 'Lưu & Thêm mới',
      Titlei18n: '',
      Visible: true,
      Enable: true,
      GrandAccess: true,
      Click: ($event: any) => {
        this.save(true);
      },
    };
    this.btnCancel = {
      Title: 'Hủy',
      Titlei18n: '',
      Visible: true,
      Enable: true,
      GrandAccess: true,
      Click: ($event: any) => {
        this.handleCancel();
      },
    };
    this.btnEdit = {
      Title: 'Cập nhật',
      Titlei18n: '',
      Visible: true,
      Enable: true,
      GrandAccess: true,
      Click: ($event: any) => {
        this.updateFormToEdit();
      },
    };
  }

  handleCancel() {
    this.isVisible = false;
    if (this.isReloadGrid) {
      this.eventEmmit.emit({ type: 'success' });
    } else {
      this.eventEmmit.emit({ type: 'close' });
    }
  }

  ngOnInit() {
    this.form = this.fb.group({
      code: [null, [Validators.required]],
      name: [null, [Validators.required]],
      order: [null],
      status: [true],
      description: [null],
    });
  }

  updateFormToEdit() {
    this.updateFormType('edit');
    this.form.get('code').enable();
    this.form.get('name').enable();
    this.form.get('order').enable();
    this.form.get('status').enable();
    this.form.get('description').enable();
    this.form.get('districtId').enable();
    this.form.get('provinceId').enable();
  }

  updateFormType(type: string) {
    switch (type) {
      case 'add':
        this.isInfo = false;
        this.isEdit = false;
        this.isAdd = true;
        this.tittle = `Thêm mới ${this.moduleName}`;
        break;
      case 'info':
        this.isInfo = true;
        this.isEdit = false;
        this.isAdd = false;
        this.tittle = `Chi tiết ${this.moduleName}`;
        break;
      case 'edit':
        this.isInfo = false;
        this.isEdit = true;
        this.isAdd = false;
        this.tittle = `Cập nhật ${this.moduleName}`;
        break;
      default:
        this.isInfo = false;
        this.isEdit = false;
        this.isAdd = true;
        this.tittle = `Thêm mới ${this.moduleName}`;
        break;
    }
  }
  onProvinceChange($event: any) {
    const rs = this.districtService
      .getListCombobox(this.form.controls.provinceId.value === null ? '' : this.form.controls.provinceId.value)
      .subscribe(
        (res: any) => {
          if (res.code !== 200) {
            this.notification.error(`Có lỗi xảy ra`, `${res.message}`);
            return;
          }
          if (res.data === null || res.data === undefined) {
            this.notification.error(`Có lỗi xảy ra`, `${res.message}`);
            return;
          }

          this.listDistrict = res.data;
        },
        (err: any) => {
          console.log(err);
        },
      );
  }
  onDistrictChange($event: any) {
    const rs = this.communeService
      .getListCombobox(this.form.controls.districtId.value === null ? '' : this.form.controls.districtId.value)
      .subscribe(
        (res: any) => {
          if (res.code !== 200) {
            this.notification.error(`Có lỗi xảy ra`, `${res.message}`);
            return;
          }
          if (res.data === null || res.data === undefined) {
            this.notification.error(`Có lỗi xảy ra`, `${res.message}`);
            return;
          }

          this.listCommune = res.data;
        },
        (err: any) => {
          console.log(err);
        },
      );
  }

  initListDistrict() {
    const rs = this.districtService.getListCombobox('').subscribe(
      (res: any) => {
        if (res.code !== 200) {
          this.notification.error(`Có lỗi xảy ra`, `${res.message}`);
          return;
        }
        if (res.data === null || res.data === undefined) {
          this.notification.error(`Có lỗi xảy ra`, `${res.message}`);
          return;
        }

        this.listDistrict = res.data;
      },
      (err: any) => {
        console.log(err);
      },
    );
  }

  initListProvince() {
    const rs = this.provinceService.getListCombobox().subscribe(
      (res: any) => {
        if (res.code !== 200) {
          this.notification.error(`Có lỗi xảy ra`, `${res.message}`);
          return;
        }
        if (res.data === null || res.data === undefined) {
          this.notification.error(`Có lỗi xảy ra`, `${res.message}`);
          return;
        }

        this.listProvince = res.data;
      },
      (err: any) => {
        console.log(err);
      },
    );
  }

  initListCommune() {
    const rs = this.communeService.getListCombobox().subscribe(
      (res: any) => {
        if (res.code !== 200) {
          this.notification.error(`Có lỗi xảy ra`, `${res.message}`);
          return;
        }
        if (res.data === null || res.data === undefined) {
          this.notification.error(`Có lỗi xảy ra`, `${res.message}`);
          return;
        }

        this.listCommune = res.data;
      },
      (err: any) => {
        console.log(err);
      },
    );
  }

  initListOrganization() {
    const rs = this.organizationService.getListCombobox().subscribe(
      (res: any) => {
        if (res.code !== 200) {
          this.notification.error(`Có lỗi xảy ra`, `${res.message}`);
          return;
        }
        if (res.data === null || res.data === undefined) {
          this.notification.error(`Có lỗi xảy ra`, `${res.message}`);
          return;
        }

        this.listOrganization = res.data;
      },
      (err: any) => {
        console.log(err);
      },
    );
  }

  initListAreaOperation() {
    const rs = this.areaOperationService.getListCombobox().subscribe(
      (res: any) => {
        if (res.code !== 200) {
          this.notification.error(`Có lỗi xảy ra`, `${res.message}`);
          return;
        }
        if (res.data === null || res.data === undefined) {
          this.notification.error(`Có lỗi xảy ra`, `${res.message}`);
          return;
        }

        this.listAreaOperation = res.data;
      },
      (err: any) => {
        console.log(err);
      },
    );
  }

  public initData(data: any, type = null, option = {}) {
    this.initListDistrict();
    this.initListProvince();
    this.initListCommune();
    this.initListOrganization();
    this.initListAreaOperation();
    this.isLoading = false;
    this.isReloadGrid = false;
    this.item = data;
    this.type = type;
    this.option = option;
    this.updateFormType(type);
    if (this.item.id === null || this.item.id === undefined) {
      this.form = this.fb.group({
        dvCha: [{ value: null, disabled: this.isInfo }, [Validators.required]],
        status: [{ value: true, disabled: this.isInfo }, [Validators.required]],
        maDv: [{ value: null, disabled: this.isInfo }, [Validators.required]],
        email: [{ value: null, disabled: this.isInfo }],
        tenDv: [{ value: null, disabled: this.isInfo }, [Validators.required]],
        address: [{ value: null, disabled: this.isInfo }],
        loai: [{ value: null, disabled: this.isInfo }, [Validators.required]],
        tenVietTat: [{ value: null, disabled: this.isInfo }],
        loaiDv: [{ value: null, disabled: this.isInfo }],
        phone: [{ value: null, disabled: this.isInfo }],
        provinceId: [{ value: null, disabled: this.isInfo }],
        thuTu: [{ value: null, disabled: this.isInfo }],
        districtId: [{ value: null, disabled: this.isInfo }],
        logo: [{ value: null, disabled: this.isInfo }],
        communeId: [{ value: null, disabled: this.isInfo }],
        description: [{ value: null, disabled: this.isInfo }],
      });
    } else {
      console.log(this.item);
      this.form = this.fb.group({
        dvCha: [{ value: this.item.parentId, disabled: this.isInfo }, [Validators.required]],
        status: [{ value: this.item.status, disabled: this.isInfo }, [Validators.required]],
        maDv: [{ value: this.item.code, disabled: this.isInfo }, [Validators.required]],
        email: [{ value: null, disabled: this.isInfo }],
        tenDv: [{ value: this.item.name, disabled: this.isInfo }, [Validators.required]],
        address: [{ value: this.item.address, disabled: this.isInfo }],
        loai: [{ value: this.item.type, disabled: this.isInfo }, [Validators.required]],
        tenVietTat: [{ value: null, disabled: this.isInfo }],
        loaiDv: [{ value: this.item.areaOperationId, disabled: this.isInfo }],
        phone: [{ value: null, disabled: this.isInfo }],
        provinceId: [{ value: null, disabled: this.isInfo }],
        thuTu: [{ value: null, disabled: this.isInfo }],
        districtId: [{ value: null, disabled: this.isInfo }],
        logo: [{ value: null, disabled: this.isInfo }],
        communeId: [{ value: null, disabled: this.isInfo }],
        description: [{ value: this.item.description, disabled: this.isInfo }],
      });
    }
  }

  resetForm() {
    this.form.reset();
    this.form.get('status').setValue(true);
    this.form.get('order').setValue(0);
  }

  closeModalReloadData() {
    this.isVisible = false;
    this.eventEmmit.emit({ type: 'success' });
  }

  save(isCreateAfter: boolean = false) {
    this.isLoading = true;
    // tslint:disable-next-line: forin
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
    }
    if (!this.form.valid) {
      this.isLoading = false;
      this.messageService.error(`Kiểm tra lại thông tin các trường đã nhập!`);
      return;
    }

    // request data
    const data = {
      phoneNumber: this.form.controls.phone.value,
      email: this.form.controls.email.value,
      shortName: this.form.controls.tenVietTat.value,
      type: this.form.controls.loai.value,
      logoUrl: this.form.controls.logo.value,
      provinceId: this.form.controls.provinceId.value,
      districtId: this.form.controls.districtId.value,
      communeId: this.form.controls.communeId.value,
      code: this.form.controls.maDv.value,
      name: this.form.controls.tenDv.value,
      status: this.form.controls.status.value,
      order: this.form.controls.thuTu.value,
      description: this.form.controls.description.value,
      address: this.form.controls.address.value,
      areaOperationId: this.form.controls.loaiDv.value,
      parentId: this.form.controls.dvCha.value,
    };

    console.log(data);

    if (data.code === null || data.code === undefined || data.code === '') {
      this.isLoading = false;
      this.messageService.error(`Mã phòng ban không được để trống!`);
      return;
    }

    if (this.isAdd) {
      const promise = this.organizationService.create(data).subscribe(
        (res: any) => {
          console.log(res);
          this.isLoading = false;
          if (res.code !== 200) {
            this.messageService.error(`${res.message}`);
            return;
          }
          if (res.data === null || res.data === undefined) {
            this.messageService.error(`${res.message}`);
            return;
          }
          const dataResult = res.data;
          this.messageService.success(`${res.message}`);
          this.isReloadGrid = true;
          if (isCreateAfter) {
            this.resetForm();
          } else {
            this.closeModalReloadData();
          }
        },
        (err: any) => {
          this.isLoading = false;
          if (err.error) {
            this.messageService.error(`${err.error.message}`);
          } else {
            this.messageService.error(`${err.status}`);
          }
        },
      );
      return promise;
    } else if (this.isEdit) {
      Object.assign(data, { id: `${this.item.id}` });
      const promise = this.organizationService.update(data).subscribe(
        (res: any) => {
          this.isLoading = false;
          if (res.code !== 200) {
            this.messageService.error(`${res.message}`);
            return;
          }
          if (res.data === null || res.data === undefined) {
            this.messageService.error(`${res.message}`);
            return;
          }
          const dataResult = res.data;
          this.messageService.success(`${res.message}`);
          this.closeModalReloadData();
        },
        (err: any) => {
          this.isLoading = false;
          if (err.error) {
            this.messageService.error(`${err.error.message}`);
          } else {
            this.messageService.error(`${err.status}`);
          }
        },
      );
      return promise;
    }
  }
}
