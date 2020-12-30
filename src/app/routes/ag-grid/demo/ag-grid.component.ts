import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ag-grid',
  templateUrl: './ag-grid.component.html',
  styleUrls: ['./ag-grid.component.less'],
})
export class AgGridComponent implements OnInit {
  // columnDefs = [
  //   { field: 'make' },
  //   { field: 'model' },
  //   { field: 'price' }
  // ];
  columnDefs = [
    { headerName: '#', field: 'index', width: 70 },
    { field: 'make', headerName: 'Tên', sortable: true, filter: true, editable: true, minWidth: 180, flex: 1 },
    { field: 'model', headerName: 'Trạng thái', minWidth: 150, cellRenderer: 'statusCellRender' },
    { field: 'price', headerName: 'Thứ tự sắp xếp', sortable: true },
  ];
  rowData = [
    { make: 'Toyota', model: 'Celica', price: 35000 },
    { make: 'Ford', model: 'Mondeo', price: 32000 },
    { make: 'Porsche', model: 'Boxter', price: 72000 },
  ];

  constructor() { }
  listOfOption: Array<{ value: string; label: string }> = [];
  listOfSelectedValue = ['a10', 'c12'];
  ngOnInit(): void {
    const children: string[] = [];
    for (let i = 10; i < 10000; i++) {
      children.push(`${i.toString(36)}${i}`);
    }
    this.listOfOption = children.map(item => {
      return {
        value: item,
        label: item
      };
    });
  }
}
