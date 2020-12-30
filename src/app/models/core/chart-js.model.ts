import { Component } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';

export class ChartJSModel {
  title: string;
  data: ChartDataSets[];
  labels: Label[];
  options: any;
  colors: Color[];
  legend: boolean;
  plugins: any[];
  type: string;
  dataOrigin: any;
  ready = false;
  [key: string]: any;
}
