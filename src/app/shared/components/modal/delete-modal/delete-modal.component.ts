import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';

import { overlayLoadingTemplate, overlayNoRowsTemplate } from '@util';
import { StatusDeleteCellRenderComponent } from '../../../../routes/ag-grid/shared/status-delete-cell-render/status-delete-cell-render.component';

@Component({
  selector: 'delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.less']
})
export class DeleteModalComponent implements OnInit {
  @Input() isVisible = false;
  @Output() eventEmmit = new EventEmitter<any>();

  message = '';

  isLoading = false;
  completeDelete = false;
  listItem: any[];

  gridApi;
  gridColumnApi;
  rowData: any[];
  columnDefs;
  defaultColDef;
  frameworkComponents;
  overlayLoadingTemplate = overlayLoadingTemplate;
  overlayNoRowsTemplate = overlayNoRowsTemplate;

  constructor(
  ) {
    this.columnDefs = [
      { headerName: 'STT', field: 'index', width: 90, },
      { field: 'name', headerName: 'Tên', sortable: true, minWidth: 150, flex: 1, },
      { field: 'result', headerName: 'Trạng thái', cellRenderer: 'statusDeleteCellRender', width: 150, },
      { field: 'message', headerName: 'Mô tả', minWidth: 150, flex: 1, },
    ];
    this.defaultColDef = {
      // flex: 1,
      minWidth: 20,
      resizable: true,
    };
    this.frameworkComponents = {
      statusDeleteCellRender: StatusDeleteCellRenderComponent,
    };
  }

  handleCancel($event: any) {
    this.isVisible = false;
    if (this.completeDelete) {
      this.eventEmmit.emit({ type: 'success' });
    } else {
      this.eventEmmit.emit({ type: 'close' });
    }
  }

  ngOnInit() {

  }

  public updateIsLoading(isLoading) {
    this.isLoading = isLoading;
  }

  public initData(data: any[], message = '') {
    this.isVisible = true;
    this.completeDelete = false;
    this.message = message;
    this.listItem = [];
    let i = 0;
    for (const item of data) {
      this.listItem.push({
        index: ++i,
        id: item.id,
        name: item.name,
        result: null,
        message: ''
      });
    }
    this.rowData = [];
    this.rowData = [...this.listItem];
  }

  public updateData(data: any[] = null) {
    if (data === null || data === undefined) {
      this.completeDelete = true;
      this.isLoading = false;
      for (const item of this.listItem) {
        item.result = false;
        item.message = 'Có lỗi xảy ra!';
      }
      this.rowData = [];
      this.rowData = [...this.listItem];
    } else {
      this.completeDelete = true;
      this.isLoading = false;
      for (const item of this.listItem) {
        const dt = data.find(x => x.id === item.id);
        if (dt) {
          item.result = dt.result;
          item.message = dt.message;
        }
      }
      this.rowData = [];
      this.rowData = [...this.listItem];
    }
  }

  confirmDelete($event: any) {
    this.eventEmmit.emit({ type: 'confirm', listId: this.listItem.map(({ id }) => id) });
  }

  closeModalReloadData($event: any) {
    this.isVisible = false;
    this.eventEmmit.emit({ type: 'success' });
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.rowData = this.listItem;
  }
}
