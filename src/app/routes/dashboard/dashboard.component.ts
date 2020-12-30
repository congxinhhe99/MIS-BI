import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';

import { ChartJSModel } from '@model';
import { numberWithCommas } from '@util';

import { faCoffee } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  constructor() { }
  cardHeader: any = {
    total1: 5000,
    total2: 13568,
    total3: 4650,
    total4: 25555
  };

  faCoffee = faCoffee;

  chart1: ChartJSModel = new ChartJSModel();
  chart2: ChartJSModel = new ChartJSModel();

  ngOnInit(): void {
    this.initChart1();
  }
  initChart1() {
    this.chart1.data = [
      {
        data: [85, 72, 78, 75, 77, 75],
        label: 'Line 1',
        fill: false,
        borderWidth: 2,
      },
      {
        data: [72, 56, 75, 45, 75, 95],
        label: 'Line 2',
        fill: false,
        borderWidth: 2,
      },
      {
        data: [78, 75, 77, 75, 55, 86],
        label: 'Line 3',
        fill: false,
        borderWidth: 2,
      },
    ];

    this.chart1.labels = ['01/2020', '02/2020', '03/2020', '04/2020', '05/2020', '06/2020'];

    this.chart1.options = {
      maintainAspectRatio: false,
      responsive: true,
      legend: {
        display: true,
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Line example',
      },
      tooltips: {
        mode: 'index',
        intersect: false,
      },
      hover: {
        mode: 'nearest',
        intersect: true,
      },
      scales: {
        xAxes: [
          {
            display: true,
            scaleLabel: {
              display: false,
            },
            ticks: {},
            gridLines: {
              display: false,
              color: '#556371',
            },
          },
        ],
        yAxes: [
          {
            display: true,
            scaleLabel: {
              display: false,
            },
            ticks: {
              callback: value => {
                return numberWithCommas(value);
              },
            },
            gridLines: {
              display: true,
              color: '#556371',
            },
          },
        ],
      },
    };

    this.chart1.colors = [
      {
        borderColor: 'black',
        // backgroundColor: 'rgba(255,255,0,0.28)',
      },
      {
        borderColor: 'red',
        // backgroundColor: 'rgba(255,255,0,0.28)',
      },
      {
        borderColor: 'green',
        //
      },
    ];

    this.chart1.legend = true;
    this.chart1.plugins = [];
    this.chart1.type = 'line';
    this.chart1.ready = true;
  }
}
