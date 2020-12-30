import { AreaOperationService } from './../../../../services/resource/area-operation/area-operation.service';
import { OrganizationService } from './../../../../services/cms/organization.service';
import { ButtonModel } from './../../../../models/core/button.model';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { QueryFilerModel } from './../../../../models/core/query-filter.model';
import { OrganizationImportItemComponent } from './../organization-import-item/organization-import-item.component';
import { DeleteModalComponent } from './../../../../shared/components/modal/delete-modal/delete-modal.component';
import { OrganizationItemComponent } from './../organization-item/organization-item.component';
import {
  excelStyles,
  listStatus,
  queryFilerDefault,
  overlayLoadingTemplate,
  overlayNoRowsTemplate,
  pageSizeOptionsDefault,
} from './../../../../utils/constants';
import { StatusNameCellRenderComponent } from './../../../ag-grid/shared/status-name-cell-render/status-name-cell-render.component';
import { BtnCellRenderComponent } from './../../../ag-grid/shared/btn-cell-render/btn-cell-render.component';
import { ProvinceService } from './../../../../services/resource/province/province.service';
import { DistrictService } from './../../../../services/resource/district/district.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { UserRightService } from './../../../../services/system/user-right/user-right.service';
import { CommuneService } from './../../../../services/resource/commune/commune.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.less'],
})
export class OrganizationComponent implements OnInit {
  constructor(
    private userRightService: UserRightService,
    private notification: NzNotificationService,
    private districtService: DistrictService,
    private provinceService: ProvinceService,
    private organizationService: OrganizationService,
    private areaOperationService: AreaOperationService,
  ) {
    this.columnDefs = [
      {
        field: 'index',
        headerName: 'STT',
        width: 50,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
      },
      { field: 'code', headerName: 'Mã', minWidth: 180, flex: 1, width: 50 },
      { field: 'name', headerName: 'Tên', sortable: true, filter: true, minWidth: 180, flex: 1 },
      {
        field: 'parentOrganizationName',
        headerName: 'Đơn vị cha',
        sortable: true,
        filter: true,
      },
      {
        field: 'areaOperationName',
        headerName: 'Loại hình đơn vị',
        sortable: true,
        filter: true,
      },
      { field: 'statusName', headerName: 'Trạng thái', cellRenderer: 'statusNameCellRender' },
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
    //#region ag-grid

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
  @ViewChild(OrganizationItemComponent, { static: false }) itemModal;
  @ViewChild(DeleteModalComponent, { static: false }) deleteModal;
  @ViewChild(OrganizationImportItemComponent, { static: false }) importModal;
  // TODO: Cần bổ sung thêm điều kiện check có phải quản trị hệ thống hay ko?
  // Nếu là quản trị hệ thống thì cần phải
  isRenderComplete = false;

  selectedAreaOperation = '';
  listStatus = listStatus;
  listAreaOperation = [];
  filter: QueryFilerModel = { ...queryFilerDefault, areaOperationId: null, ShowAdSearch: true };
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

  tittle = 'Danh sách phòng ban';
  moduleName = 'Phòng ban';

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
    // this.btnAdd.GrandAccess = this.userRightService.check('LINK-CATALOG-ADD');
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
    const option = {
      listProvince: this.listAreaOperation,
    };
    this.importModal.initData(option);
  }
  onResetSearch(reloadData: boolean) {
    this.filter.textSearch = null;
    this.filter.status = null;
    this.filter.districtId = null;
    this.filter.provinceId = null;
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
    const promise = this.organizationService.delete(listId).subscribe(
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
  initListAreaOperation() {
    const rs = this.areaOperationService.getListCombobox().subscribe(
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

        this.listAreaOperation = res.data;
      },
      (err: any) => {
        console.log(err);
      },
    );
  }

  onStatusChange($event: any) {
    this.initGridData();
  }

  initGridData() {
    this.btnDelete.Visible = false;
    this.initListAreaOperation();
    this.gridApi.showLoadingOverlay();
    const rs = this.organizationService.getFilter(this.filter).subscribe(
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
        this.paginationMessage = `Hiển thị <b>${i + 1} - ${i + dataResult.dataCount}</b> trên tổng số <b>${
          dataResult.totalCount
        }</b> kết quả`;
        for (const item of dataResult.data) {
          item.index = ++i;
          item.statusName = this.listStatus.find((x) => x.id === item.status)?.name;

          item.editGrantAccess = true;
          item.deleteGrantAccess = true;
        }
        console.log(dataResult.data);
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
