import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonModel } from '@model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ProvinceService } from 'src/app/services/resource/province/province.service';

@Component({
  selector: 'app-province-item',
  templateUrl: './province-item.component.html',
  styleUrls: ['./province-item.component.less']
})
export class ProvinceItemComponent implements OnInit {
  @Input() type = 'add';
  @Input() item: any;
  @Input() isVisible = false;
  @Input() option: any;
  @Output() eventEmmit = new EventEmitter<any>();

  form: FormGroup;
  moduleName = 'tỉnh thành phố';

  isInfo = false;
  isAdd = false;
  isEdit = false;
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
    private provinceService: ProvinceService,
  ) {
    this.btnSave = {
      Title: 'Lưu',
      Titlei18n: '',
      Visible: true,
      Enable: true,
      GrandAccess: true,
      Click: ($event: any) => { this.save(); }
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
      Click: ($event: any) => { this.handleCancel(); }
    };
    this.btnEdit = {
      Title: 'Cập nhật',
      Titlei18n: '',
      Visible: true,
      Enable: true,
      GrandAccess: true,
      Click: ($event: any) => { this.updateFormToEdit(); }
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
      description: [null]
    });
  }

  updateFormToEdit() {
    this.updateFormType('edit');
    this.form.get('code').enable();
    this.form.get('name').enable();
    this.form.get('order').enable();
    this.form.get('status').enable();
    this.form.get('description').enable();
  }

  updateFormType(type: string) {
    switch (type) {
      case 'add':
        this.isInfo = false;
        this.isAdd = true;
        this.tittle = `Thêm mới ${this.moduleName}`;
        break;
      case 'edit':
        this.isInfo = false;
        this.isEdit = true;
        this.isAdd = false;
        this.tittle = `Cập nhật ${this.moduleName}`;
        break;
      case 'info':
        this.isInfo = true;
        this.isEdit = false;
        this.isAdd = false;
        this.tittle = `Chi tiết ${this.moduleName}`;
        break;
      default:
        this.isInfo = false;
        this.isAdd = true;
        this.tittle = `Thêm mới ${this.moduleName}`;
        break;
    }
  }

  public initData(data: any, type = null, option = {}) {
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
        description: [{ value: null, disabled: this.isInfo }]
      });
    } else {
      this.form = this.fb.group({
        code: [{ value: this.item.code, disabled: this.isInfo }, [Validators.required]],
        name: [{ value: this.item.name, disabled: this.isInfo }, [Validators.required]],
        order: [{ value: this.item.order, disabled: this.isInfo }],
        status: [{ value: this.item.status, disabled: this.isInfo }],
        description: [{ value: this.item.description, disabled: this.isInfo }]
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
      code: this.form.controls['code'].value,
      name: this.form.controls.name.value,
      order: this.form.controls.order.value,
      status: this.form.controls.status.value,
      description: this.form.controls.description.value,
    };
    if (data.name === null || data.name === undefined || data.name === '') {
      this.isLoading = false;
      this.messageService.error(`Tên tỉnh thành phố không được để trống!`);
      return;
    }

    if (this.isAdd) {
      const promise = this.provinceService.create(data).subscribe(
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
      const promise = this.provinceService.update(data).subscribe(
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

