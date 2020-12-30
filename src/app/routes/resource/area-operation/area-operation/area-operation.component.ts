import { Component, OnInit, ViewChild } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';

import { ButtonModel, QueryFilerModel } from '@model';
import { AreaOperationService, UserRightService } from '@service';
import { excelStyles, listStatus, overlayLoadingTemplate, overlayNoRowsTemplate, pageSizeOptionsDefault, queryFilerDefault } from '@util';

import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import 'ag-grid-enterprise';

import { BtnCellRenderComponent } from '../../../ag-grid/shared/btn-cell-render/btn-cell-render.component';
import { StatusNameCellRenderComponent } from '../../../ag-grid/shared/status-name-cell-render/status-name-cell-render.component';

import { DeleteModalComponent } from '@shared';
import { AreaOperationImportItemComponent } from '../area-operation-import-item/area-operation-import-item.component';
import { AreaOperationItemComponent } from '../area-operation-item/area-operation-item.component';

import * as moment from 'moment';

@Component({
  selector: 'app-area-operation',
  templateUrl: './area-operation.component.html',
  styleUrls: ['./area-operation.component.less'],
})
export class AreaOperationComponent implements OnInit {
  constructor(
    private areaOperationService: AreaOperationService,
    private userRightService: UserRightService,
    private notification: NzNotificationService
  ) {
    //#region ag-grid
    this.columnDefs = [
      {
        field: 'index',
        headerName: 'STT',
        width: 50,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
      },
      { field: 'code', headerName: 'Mã', minWidth: 180, flex: 1 },
      { field: 'name', headerName: 'Tên', sortable: true, filter: true, minWidth: 180, flex: 1 },
      { field: 'statusName', headerName: 'Trạng thái', minWidth: 150, cellRenderer: 'statusNameCellRender' },
      {
        field: 'order',
        headerName: 'Thứ tự sắp xếp',
        sortable: true,
      },
      {
        headerName: 'Thao tác',
        minWidth: 150,
        cellRenderer: 'btnCellRenderer',
        cellRendererParams: {
          infoClicked: (item: any) => this.onViewItem(item),
          editClicked: (item: any) => this.onEditItem(item),
          deleteClicked: (item: any) => this.onDeleteItem(item),
        },
      },
    ];
    this.defaultColDef = {
      // flex: 1,
      minWidth: 100,
      resizable: true,
    };
    this.frameworkComponents = {
      btnCellRenderer: BtnCellRenderComponent,
      statusNameCellRender: StatusNameCellRenderComponent,
    };
    this.excelStyles = [...excelStyles];
    //#endregion ag-grid

    //#region Init button
    this.btnAdd = {
      Title: 'Thêm mới',
      Titlei18n: '',
      Visible: true,
      Enable: true,
      GrandAccess: true,
      Click: ($event: any) => {
        this.onAddItem();
      },
    };
    this.btnExportExcel = {
      Title: 'Export excel',
      Titlei18n: '',
      Visible: true,
      Enable: true,
      GrandAccess: true,
      Click: ($event: any) => {
        this.onExportExcel();
      },
    };
    this.btnImportExcel = {
      Title: 'Import excel',
      Titlei18n: '',
      Visible: true,
      Enable: true,
      GrandAccess: true,
      Click: ($event: any) => {
        this.onImportExcel();
      },
    };
    this.btnDelete = {
      Title: 'Xóa',
      Titlei18n: '',
      Visible: false,
      Enable: true,
      GrandAccess: true,
      Click: ($event: any) => {
        this.onDeleteItem();
      },
    };
    this.btnSearch = {
      Title: 'Tìm kiếm',
      Titlei18n: '',
      Visible: true,
      Enable: true,
      GrandAccess: true,
      Click: ($event: any) => {
        this.initGridData();
      },
    };
    this.btnResetSearch = {
      Title: 'Đặt lại',
      Titlei18n: '',
      Visible: true,
      Enable: true,
      GrandAccess: true,
      Click: ($event: any) => {
        this.onResetSearch(false);
      },
    };
    this.btnReload = {
      Title: 'Tải lại',
      Titlei18n: '',
      Visible: true,
      Enable: true,
      GrandAccess: true,
      Click: ($event: any) => {
        this.onResetSearch(true);
      },
    };
    //#endregion Init button
  }
  @ViewChild(AreaOperationItemComponent, { static: false }) itemModal;
  @ViewChild(DeleteModalComponent, { static: false }) deleteModal;
  @ViewChild(AreaOperationImportItemComponent, { static: false }) importModal;

  isRenderComplete = false;

  listStatus = listStatus;
  filter: QueryFilerModel = { ...queryFilerDefault };
  pageSizeOptions = [];
  paginationMessage = '';

  columnDefs = [];
  grid: any = {};
  private gridApi;
  private gridColumnApi;
  modules = [ClientSideRowModelModule];
  defaultColDef;
  rowSelection = 'multiple';
  rowData: [];
  overlayLoadingTemplate = overlayLoadingTemplate;
  overlayNoRowsTemplate = overlayNoRowsTemplate;
  quickText = '';
  excelStyles;
  frameworkComponents;

  btnAdd: ButtonModel;
  btnDelete: ButtonModel;
  btnExportExcel: ButtonModel;
  btnImportExcel: ButtonModel;
  btnResetSearch: ButtonModel;
  btnSearch: ButtonModel;
  btnReload: ButtonModel;

  isLoadingDelete = false;
  isShowDelete = false;
  isShowImport = false;

  tittle = 'Danh sách loại hình đơn vị';
  moduleName = 'Loại hình đơn vị';

  modal: any = {
    type: '',
    item: {},
    isShow: false,
    option: {},
  };

  ngOnInit(): void {
    this.initRightOfUser();
    this.isRenderComplete = true;
  }

  initRightOfUser() {
    // this.btnAdd.GrandAccess = this.userRightService.check('area-operation-ADD');
  }

  //#region Ag-grid
  onPageSizeChange() {
    this.initGridData();
  }

  onPageNumberChange() {
    this.initGridData();
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.initGridData();
  }

  onSelectionChanged($event: any) {
    const selectedRows = this.gridApi.getSelectedRows();
    if (selectedRows.length > 0) {
      this.btnDelete.Visible = true;
    } else {
      this.btnDelete.Visible = false;
    }
  }

  onCellDoubleClicked($event: any) {
    this.onViewItem($event.data);
  }
  //#endregion Ag-grid

  //#region Search

  //#endregion Search

  //#region Event
  onExportExcel() {
    const params = {
      columnWidth: 100,
      sheetName: this.moduleName,
      exportMode: undefined, // 'xml', // : undefined,
      suppressTextAsCDATA: true,
      rowHeight: undefined,
      fileName: `Danh sách ${this.moduleName} ${moment(new Date()).format('DD-MM-YYYY')}.xlsx`,
      headerRowHeight: undefined, // undefined,
      customHeader: [
        [],
        [
          {
            styleId: 'bigHeader',
            data: {
              type: 'String',
              value: `Danh sách ${this.moduleName} (${moment(new Date()).format('DD-MM-YYYY')})`,
            },
            mergeAcross: 3,
          },
        ],
        [],
      ],
      customFooter: [[]],
    };
    this.gridApi.exportDataAsExcel(params);
  }

  onImportExcel() {
    this.isShowImport = true;
    this.importModal.initData();
  }

  onResetSearch(reloadData: boolean) {
    this.filter.textSearch = null;
    this.filter.status = null;
    if (reloadData) {
      this.initGridData();
    }
  }

  onAddItem() {
    this.modal = {
      type: 'add',
      item: {},
      isShow: true,
      option: {},
    };
    this.itemModal.initData({}, 'add');
  }

  onEditItem(item: any = null) {
    if (item === null) {
      const selectedRows = this.gridApi.getSelectedRows();
      item = selectedRows[0];
    }
    this.modal = {
      type: 'edit',
      item,
      isShow: true,
      option: {},
    };
    this.itemModal.initData(item, 'edit');
  }

  onViewItem(item: any = null) {
    if (item === null) {
      const selectedRows = this.gridApi.getSelectedRows();
      item = selectedRows[0];
    }
    this.modal = {
      type: 'info',
      item,
      isShow: true,
      option: {},
    };
    this.itemModal.initData(item, 'info');
  }

  onDeleteItem(item: any = null) {
    let selectedRows = this.gridApi.getSelectedRows();
    if (item !== null) {
      selectedRows = [];
      selectedRows.push(item);
    }
    const tittle = 'Xác nhận xóa';
    let content = '';
    if (selectedRows.length > 1) {
      content = 'Bạn có chắc chắn muốn xóa các bản ghi này không?';
    } else {
      content = 'Bạn có chắc chắn muốn xóa bản ghi này không?';
    }
    this.isShowDelete = true;
    this.deleteModal.initData(selectedRows, content);
  }

  //#endregion Event

  //#region Modal

  onModalEventEmmit(event) {
    this.modal.isShow = false;
    if (event.type === 'success') {
      this.initGridData();
    }
  }

  onDeleteEventEmmit(event) {
    if (event.type === 'success') {
      this.initGridData();
    } else if (event.type === 'confirm') {
      this.deleteModal.updateIsLoading(true);
      this.deleteListItem(event.listId);
    }
  }

  onImportEventEmmit(event) {
    if (event.type === 'success') {
      this.initGridData();
    }
  }

  //#endregion Modal

  //#region API Event
  deleteListItem(listId: [string]) {
    this.isLoadingDelete = true;
    const promise = this.areaOperationService.delete(listId).subscribe(
      (res: any) => {
        this.isLoadingDelete = false;
        if (res.code !== 200) {
          this.notification.error(`Có lỗi xảy ra`, `${res.message}`);
          return;
        }
        if (res.data === null || res.data === undefined) {
          this.notification.error(`Có lỗi xảy ra`, `${res.message}`);
          return;
        }
        const dataResult = res.data;
        this.deleteModal.updateData(dataResult);
      },
      (err: any) => {
        this.isLoadingDelete = false;
        this.deleteModal.updateData();
        if (err.error) {
          this.notification.error(`Có lỗi xảy ra`, `${err.error.message}`);
        } else {
          this.notification.error(`Có lỗi xảy ra`, `${err.status}`);
        }
      },
    );
    return promise;
  }

  initGridData() {
    this.btnDelete.Visible = false;
    this.gridApi.showLoadingOverlay();
    const rs = this.areaOperationService.getFilter(this.filter).subscribe(
      (res: any) => {
        this.gridApi.hideOverlay();
        if (res.code !== 200) {
          this.notification.error(`Có lỗi xảy ra`, `${res.message}`);
          return;
        }
        if (res.data === null || res.data === undefined) {
          this.notification.error(`Có lỗi xảy ra`, `${res.message}`);
          return;
        }

        const dataResult = res.data;

        let i = this.filter.pageSize * (this.filter.pageNumber - 1);
        this.paginationMessage = `Hiển thị <b>${i + 1} - ${i + dataResult.dataCount}</b> trên tổng số <b>${dataResult.totalCount}</b> kết quả`;
        for (const item of dataResult.data) {
          item.index = ++i;
          item.statusName = this.listStatus.find(x => x.id === item.status)?.name;
          item.editGrantAccess = true;
          item.deleteGrantAccess = true;
        }

        this.rowData = dataResult.data;
        this.grid.totalData = dataResult.totalCount;
        this.grid.dataCount = dataResult.dataCount;
        this.pageSizeOptions = [...pageSizeOptionsDefault];
        // tslint:disable-next-line: variable-name
        this.pageSizeOptions = this.pageSizeOptions.filter((number) => {
          return number < dataResult.totalCount;
        });
        this.pageSizeOptions.push(dataResult.totalCount);
      },
      (err: any) => {
        this.gridApi.hideOverlay();
        console.log(err);
      },
    );
    return rs;
  }
  //#endregion API Event
}
