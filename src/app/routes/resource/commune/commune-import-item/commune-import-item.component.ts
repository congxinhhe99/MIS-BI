import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ButtonModel, ExcelColumnMapping } from '@model';
import { stringToBoolean } from '@util';
import { excelStyles, overlayLoadingTemplate, overlayNoRowsTemplate } from '@util';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { UploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer } from 'rxjs';
import { StatusImportCellRenderComponent } from 'src/app/routes/ag-grid/shared/status-import-cell-render/status-import-cell-render.component';
import { StatusNameCellRenderComponent } from 'src/app/routes/ag-grid/shared/status-name-cell-render/status-name-cell-render.component';
import * as XLSX from 'xlsx';
import { DistrictService } from 'src/app/services/resource/district/district.service';
import { ProvinceService } from 'src/app/services/resource/province/province.service';
import { CommuneService } from 'src/app/services/resource/commune/commune.service';

@Component({
  selector: 'app-commune-import-item',
  templateUrl: './commune-import-item.component.html',
  styleUrls: ['./commune-import-item.component.less'],
})
export class CommuneImportItemComponent implements OnInit {
  constructor(
    private messageService: NzMessageService,
    private communeService: CommuneService,
    private districtService: DistrictService,
    private provinceService: ProvinceService,
    private notification: NzNotificationService,
  ) {
    //#region Button
    this.btnDownload = {
      Title: 'Tải về mẫu',
      Titlei18n: '',
      Visible: true,
      Enable: true,
      GrandAccess: true,
      Click: ($event: any) => {
        this.onExportExcel();
      },
    };
    this.btnUpload = {
      Title: 'Tải lên dữ liệu',
      Titlei18n: '',
      Visible: true,
      Enable: true,
      GrandAccess: true,
      Click: ($event: any) => { },
    };
    this.btnReset = {
      Title: 'Đặt lại',
      Titlei18n: '',
      Visible: true,
      Enable: true,
      GrandAccess: true,
      Click: ($event: any) => {
        this.onReset();
      },
    };
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
    this.btnClose = {
      Title: 'Đóng',
      Titlei18n: '',
      Visible: true,
      Enable: true,
      GrandAccess: true,
      Click: ($event: any) => {
        this.handleCancel();
      },
    };
    //#endregion Button

    //#region Ag-grid
    this.columnDefs = [
      {
        flex: 1,
        field: 'index',
        headerName: 'STT',
        width: 30,
      },
      { field: 'code', headerName: 'Mã', editable: true, sortable: true, filter: true, minWidth: 120, flex: 1 },
      { field: 'name', headerName: 'Tên', editable: true, sortable: true, filter: true, minWidth: 120, flex: 1 },
      { field: 'provinceName', headerName: 'Tỉnh thành', sortable: true, filter: true, minWidth: 120, flex: 1 },
      { field: 'districtName', headerName: 'Quận huyện', sortable: true, filter: true, minWidth: 120, flex: 1 },
      { field: 'status', headerName: 'Trạng thái', minWidth: 150, cellRenderer: 'statusNameCellRender', flex: 1 },

      {
        field: 'order',
        editable: true,
        headerName: 'Thứ tự sắp xếp',
        sortable: true,
        minWidth: 150,
        flex: 1,
      },
    ];
    this.defaultColDef = {
      minWidth: 100,
      resizable: true,
    };
    this.frameworkComponents = {
      statusCellRender: StatusImportCellRenderComponent,
      statusNameCellRender: StatusNameCellRenderComponent,
    };
    this.excelStyles = [...excelStyles];
    //#endregion Ag-grid
  }
  @Input() isVisible = false;
  @Output() eventEmmit = new EventEmitter<any>();

  option: any;

  tittle = 'Nhập dữ liệu xã phường từ excel';
  moduleName = 'Xã phường';

  // TODO: Cần bổ sung thêm điều kiện check có phải quản trị hệ thống hay ko?
  // Nếu là quản trị hệ thống thì cần phải

  sentData;

  isLoading = false;
  listProvince = [];
  listDistrict = [];
  gridApi;
  gridColumnApi;
  rowData: any[] = [];
  columnDefs;
  defaultColDef;
  excelStyles;
  frameworkComponents;
  overlayLoadingTemplate = overlayLoadingTemplate;
  overlayNoRowsTemplate = overlayNoRowsTemplate;

  btnDownload: ButtonModel;
  btnUpload: ButtonModel;
  btnReset: ButtonModel;
  btnSave: ButtonModel;
  btnCancel: ButtonModel;
  btnClose: ButtonModel;

  isCompleteImport = false;
  jsonObject: any[] = [];
  excelColumnsMapping: ExcelColumnMapping[] = [
    {
      gridName: 'code',
      excelName: 'Mã',
      dataType: 'string',
    },
    {
      gridName: 'name',
      excelName: 'Tên',
      dataType: 'string',
    },
    {
      gridName: 'provinceName',
      excelName: 'Tỉnh thành',
      dataType: 'string',
    },
    {
      gridName: 'districtName',
      excelName: 'Quận huyện',
      dataType: 'string',
    },
    {
      gridName: 'status',
      excelName: 'Trạng thái',
      dataType: 'boolean',
    },
    {
      gridName: 'order',
      excelName: 'Thứ tự sắp xếp',
      dataType: 'number',
    },
  ];

  ngOnInit() { }

  // get data
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

        this.listProvince = res.data.map((item) => {
          return {
            id: item.id,
            name: item.name,
          };
        });
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

        this.listDistrict = res.data.map((item) => {
          return {
            id: item.id,
            name: item.name,
          };
        });
      },
      (err: any) => {
        console.log(err);
      },
    );
  }
  onExportExcel() {
    const params = {
      columnWidth: 100,
      sheetName: this.moduleName,
      exportMode: undefined, // 'xml', // : undefined,
      suppressTextAsCDATA: true,
      rowHeight: undefined,
      fileName: `Biểu mẫu nhập liệu ${this.moduleName}.xlsx`,
      headerRowHeight: undefined, // undefined,
      customHeader: [],
      customFooter: [],
    };
    this.gridApi.exportDataAsExcel(params);
  }

  onReset() {
    this.gridApi.setRowData([]);
  }

  //#region convertExcelData

  // tslint:disable-next-line: deprecation
  transformFile = (file: UploadFile) => {
    this.parseExcel(file);
    return new Observable((observer: Observer<Blob>) => { });
  }
  parseExcel(file) {
    this.sentData = [];
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, {
        type: 'binary',
      });
      workbook.SheetNames.forEach((sheetName) => {
        // Here is your object
        const XL_row_object = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        this.jsonObject = [...XL_row_object];
      });

      const listObj = [];
      let i = 0;
      let check = false;
      this.jsonObject.forEach((itemExcel) => {
        const itemGrid: any = { index: ++i };
        check = false;
        this.excelColumnsMapping.forEach((col) => {
          this.convertExcelToGrid(itemGrid, itemExcel);
        });
        listObj.push(itemGrid);
      });
      listObj.forEach((item) => {
        let provinceId: any;
        let districtId: any;

        // filter Id;
        provinceId = this.filterId(this.listProvince, item.provinceName);
        districtId = this.filterId(this.listDistrict, item.districtName);
        // check Id

        if ((provinceId === undefined || provinceId === null) && item.provinceName.toString().trim() !== '') {
          this.messageService.error(`Tên tỉnh thành ` + item.provinceName + ` là không hợp lệ`);
        }

        if ((districtId === undefined || districtId === null) && item.districtName.toString().trim() !== '') {
          this.messageService.error(`Tên quận huyện ` + item.districtName + ` là không hợp lệ`);
        }
        const model = {
          code: item.code,
          name: item.name,
          order: item.order,
          status: item.status,
          districtId,
          provinceId,

        };
        this.sentData.push(model);
      });
      this.gridApi.setRowData(listObj);
      if (listObj.length === 0) {
        this.messageService.error(`Dữ liệu tải lên không phù hợp`);
      } else {
        this.messageService.success(`Tải lên dữ liệu thành công`);
      }
    };

    reader.onerror = (ex) => {
      this.messageService.error(`Tải lên dữ liệu thất bại - ${ex}`);
      console.log(ex);
    };

    reader.readAsBinaryString(file);
  }

  // get Id
  filterId(list: any[], text: string) {
    let id;
    list.map((item) => {
      if (item.name === text.toString().trim()) {
        id = item.id;
      }
    });
    return id;
  }

  convertExcelToGrid = (itemGrid: any, itemExcel: any): void => {
    this.excelColumnsMapping.forEach((col) => {
      if (col.dataType === 'string') {
        itemGrid[col.gridName] = '' + itemExcel[col.excelName];
      } else if (col.dataType === 'number') {
        itemGrid[col.gridName] = parseFloat(itemExcel[col.excelName]);
      } else if (col.dataType === 'boolean') {
        itemGrid[col.gridName] = stringToBoolean(itemExcel[col.excelName]);
      } else {
        itemGrid[col.gridName] = itemExcel[col.excelName];
      }
    });
  }

  ////#endregion convertExcelData

  //#region Ag-grid

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.hideOverlay();
  }

  //#endregion Ag-grid

  handleCancel() {
    this.isVisible = false;
    if (this.isCompleteImport) {
      this.eventEmmit.emit({ type: 'success' });
    } else {
      this.eventEmmit.emit({ type: 'close' });
    }
  }

  public initData(option: any = {}) {
    this.initListDistrict();
    this.initListProvince();
    this.option = option;
    this.listProvince = option.listProvince;
    this.listDistrict = option.listDistrict;
    this.isCompleteImport = false;
    this.isVisible = true;
  }

  closeModalReloadData() {
    this.isVisible = false;
    this.eventEmmit.emit({ type: 'success' });
  }

  //#region API Event
  save() {
    this.isLoading = true;
    let data = [];
    data = this.sentData;

    // thay đổi dữ liệu khi sửa trên Grid
    this.gridApi.forEachNode((rowNode, index) => {
      data[index].name = rowNode.data.name;
      // tslint:disable-next-line: radix
      data[index].order = parseInt(rowNode.data.order);
    });

    if (data.length === 0) {
      this.isLoading = false;
      this.messageService.error(`Danh sách ${this.moduleName} không có dữ liệu!`);
      return;
    }
    const promise = this.communeService.createMany(data).subscribe(
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
        this.isCompleteImport = true;
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

  //#endregion API Event
}
