import { Component, EventEmitter, OnInit } from '@angular/core';
import { QueryFilerModel } from '@model';
import { listStatus, pageSizeOptionsDefault, queryFilerDefault } from '@util';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.less']
})
export class PaginationComponent implements OnInit {

  constructor() { }
  paginationMessage = '';
  filter: QueryFilerModel = queryFilerDefault;
  grid: any;
  pageSizeOptions = [];

  pageNumberChange: EventEmitter<number>;
  pageSizeChange: EventEmitter<number>;

  onPageNumberChange() {

  }
  onPageSizeChange() {

  }

  ngOnInit(): void {
  }

}
