import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonModel, QueryFilerModel } from '@model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DistrictService } from 'src/app/services/resource/district/district.service';
import { CommuneService } from 'src/app/services/resource/commune/commune.service';
import { ProvinceService } from 'src/app/services/resource/province/province.service';
import { queryFilerDefault } from '@util';

@Component({
  selector: 'app-commune-item',
  templateUrl: './commune-item.component.html',
  styleUrls: ['./commune-item.component.less'],
})
export class CommuneItemComponent implements OnInit {
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
    const rs = this.districtService.getListCombobox(this.form.controls.provinceId.value === null ? '' : this.form.controls.provinceId.value).subscribe(
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

  public initData(data: any, type = null, option = {}) {
    this.initListDistrict();
    this.initListProvince();
    this.isLoading = false;
    this.isReloadGrid = false;
    this.item = data;
    this.type = type;
    this.option = option;
    this.updateFormType(type);
    if (this.item.id === null || this.item.id === undefined) {
      this.form = this.fb.group({
        code: [{ value: null, disabled: this.isInfo }, [Validators.required]],
        name: [{ value: null, disabled: this.isInfo }, [Validators.required]],
        order: [{ value: 0, disabled: this.isInfo }],
        status: [{ value: true, disabled: this.isInfo }],
        description: [{ value: null, disabled: this.isInfo }],
        districtId: [{ value: null, disabled: this.isInfo }, [Validators.required]],
        provinceId: [{ value: null, disabled: this.isInfo }, [Validators.required]],
      });
    } else {
      this.form = this.fb.group({
        code: [{ value: this.item.code, disabled: this.isInfo }, [Validators.required]],
        name: [{ value: this.item.name, disabled: this.isInfo }, [Validators.required]],
        order: [{ value: this.item.order, disabled: this.isInfo }],
        status: [{ value: this.item.status, disabled: this.isInfo }],
        description: [{ value: this.item.description, disabled: this.isInfo }],
        districtId: [{ value: this.item.districtId, disabled: this.isInfo }, [Validators.required]],
        provinceId: [{ value: this.item.provinceId, disabled: this.isInfo }, [Validators.required]],
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

    const data = {
      id: this.item.id,
      code: this.form.controls.code.value,
      name: this.form.controls.name.value,
      order: this.form.controls.order.value,
      status: this.form.controls.status.value,
      description: this.form.controls.description.value,
      districtId: this.form.controls.districtId.value,
      provinceId: this.form.controls.provinceId.value,
    };

    if (data.provinceId === null || data.provinceId === undefined || data.provinceId === '') {
      this.isLoading = false;
      this.messageService.error(`Tỉnh thành không được để trống!`);
      return;
    }

    if (data.districtId === null || data.districtId === undefined || data.districtId === '') {
      this.isLoading = false;
      this.messageService.error(`Quận huyện không được để trống!`);
      return;
    }


    if (data.code === null || data.code === undefined || data.code === '') {
      this.isLoading = false;
      this.messageService.error(`Mã xã phường không được để trống!`);
      return;
    }

    if (data.name === null || data.name === undefined || data.name === '') {
      this.isLoading = false;
      this.messageService.error(`Tên xã phường không được để trống!`);
      return;
    }

    if (this.isAdd) {
      const promise = this.communeService.create(data).subscribe(
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
      const promise = this.communeService.update(data).subscribe(
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
