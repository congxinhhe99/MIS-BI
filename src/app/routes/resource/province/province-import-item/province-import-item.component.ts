import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { excelStyles, overlayLoadingTemplate, overlayNoRowsTemplate, stringToBoolean } from '@util';

import { ButtonModel, ExcelColumnMapping } from '@model';

import { ProvinceService } from 'src/app/services/resource/province/province.service';
import { NzMessageService } from 'ng-zorro-antd/message';

import { UploadFile } from 'ng-zorro-antd/upload';

import { StatusImportCellRenderComponent } from '../../../ag-grid/shared/status-import-cell-render/status-import-cell-render.component';

import { Observable, Observer } from 'rxjs';
import { StatusNameCellRenderComponent } from 'src/app/routes/ag-grid/shared/status-name-cell-render/status-name-cell-render.component';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-province-import-item',
  templateUrl: './province-import-item.component.html',
  styleUrls: ['./province-import-item.component.less'],
})
export class ProvinceImportItemComponent implements OnInit {
  constructor(private messageService: NzMessageService, private provinceService: ProvinceService) {
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
      { field: 'index', headerName: 'STT', width: 70 },
      { field: 'code', headerName: 'Mã', editable: true, sortable: true, filter: true, minWidth: 180, flex: 1 },
      { field: 'name', headerName: 'Tên', editable: true, sortable: true, filter: true, minWidth: 180, flex: 1 },
      { field: 'status', headerName: 'Trạng thái', editable: true, cellRenderer: 'statusNameCellRender', minWidth: 150 },
      { field: 'order', headerName: 'Thứ tự sắp xếp', editable: true, sortable: true },
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

  tittle = 'Nhập dữ liệu tỉnh thành phố từ excel';
  moduleName = 'Tỉnh thành phố';

  isLoading = false;

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

  transformFile = (file: UploadFile) => {
    this.parseExcel(file);
    return new Observable((observer: Observer<Blob>) => { });
  };

  parseExcel(file) {
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
      console.log(this.jsonObject);

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

      console.log(listObj);
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
  };

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

  public initData(option = {}) {
    this.option = option;
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
    const data = [];
    // iterate through every node in the grid
    this.gridApi.forEachNode((rowNode, index) => {
      data.push(rowNode.data);
    });

    // console.log(data);

    if (data.length === 0) {
      this.isLoading = false;
      this.messageService.error(`Danh sách ${this.moduleName} không có dữ liệu!`);
      return;
    }

    const promise = this.provinceService.createMany(data).subscribe(
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
