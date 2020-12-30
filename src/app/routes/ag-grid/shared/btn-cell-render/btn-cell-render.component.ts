import { Component, OnDestroy, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { IAfterGuiAttachedParams } from 'ag-grid-community';

@Component({
  selector: 'app-btn-cell-render',
  templateUrl: './btn-cell-render.component.html',
})
export class BtnCellRenderComponent implements ICellRendererAngularComp, OnInit, OnDestroy {
  constructor() {}

  params: any;

  refresh(params: any): boolean {
    throw new Error('Method not implemented.');
  }

  afterGuiAttached?(params?: IAfterGuiAttachedParams): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {}

  agInit(params: any): void {
    this.params = params;
  }

  btnInfoClickedHandler($event: any) {
    // console.log(this.params.data);
    this.params.infoClicked(this.params.data);
  }

  btnEditClickedHandler($event: any) {
    // console.log(this.params.data);
    this.params.editClicked(this.params.data);
  }

  btnDeleteClickedHandler($event: any) {
    // console.log(this.params.data);
    this.params.deleteClicked(this.params.data);
  }
  btnEnterFormulaClickedHandler($event: any) {
    // console.log(this.params.data);
    this.params.enterFormulaClicked(this.params.data);
  }

  ngOnDestroy() {
    // no need to remove the button click handler
    // https://stackoverflow.com/questions/49083993/does-angular-automatically-remove-template-event-listeners
  }
}
