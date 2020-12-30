import { QueryFilerModel } from '@model';

export const ROLE_SYS_ADMIN = 'SYS_ADMIN';

export const listStatus = [
  { id: true, code: true, name: 'Hoạt động' },
  { id: false, code: false, name: 'Không hoạt động' },
];

export const listNumberCode = [
  { id: true, code: true, name: 'Có' },
  { id: false, code: false, name: 'Không' },
];

export const listUnitType = [
  { id: 1, code: 'KDVT1', name: 'Đơn vị tính nội dung' },
  { id: 2, code: 'HDVT2', name: 'Đơn vị tính thuộc tính' },
  { id: 3, code: 'KDVT3', name: 'Đơn vị tính biểu' },
];

export const queryFilerDefault: QueryFilerModel = {
  pageNumber: 1,
  pageSize: 20,
  textSearch: null,
};

export const pageSizeOptionsDefault = [5, 10, 20, 50];

export const excelStyles = [
  {
    id: 'greenBackground',
    interior: {
      color: '#b5e6b5',
      pattern: 'Solid',
    },
  },
  {
    id: 'redFont',
    font: {
      fontName: 'Calibri Light',
      underline: 'Single',
      italic: true,
      color: '#ff0000',
    },
  },
  {
    id: 'darkGreyBackground',
    interior: {
      color: '#888888',
      pattern: 'Solid',
    },
    font: {
      fontName: 'Calibri Light',
      color: '#ffffff',
    },
  },
  {
    id: 'boldBorders',
    borders: {
      borderBottom: {
        color: '#000000',
        lineStyle: 'Continuous',
        weight: 3,
      },
      borderLeft: {
        color: '#000000',
        lineStyle: 'Continuous',
        weight: 3,
      },
      borderRight: {
        color: '#000000',
        lineStyle: 'Continuous',
        weight: 3,
      },
      borderTop: {
        color: '#000000',
        lineStyle: 'Continuous',
        weight: 3,
      },
    },
  },
  {
    id: 'header',
    interior: {
      color: '#CCCCCC',
      pattern: 'Solid',
    },
    alignment: {
      vertical: 'Center',
      horizontal: 'Center',
    },
    font: {
      bold: true,
      fontName: 'Calibri',
    },
    borders: {
      borderBottom: {
        color: '#5687f5',
        lineStyle: 'Continuous',
        weight: 1,
      },
      borderLeft: {
        color: '#5687f5',
        lineStyle: 'Continuous',
        weight: 1,
      },
      borderRight: {
        color: '#5687f5',
        lineStyle: 'Continuous',
        weight: 1,
      },
      borderTop: {
        color: '#5687f5',
        lineStyle: 'Continuous',
        weight: 1,
      },
    },
  },
  {
    id: 'dateFormat',
    dataType: 'dateTime',
    numberFormat: { format: 'mm/dd/yyyy;@' },
  },
  {
    id: 'twoDecimalPlaces',
    numberFormat: { format: '#,##0.00' },
  },
  {
    id: 'textFormat',
    dataType: 'string',
  },
  {
    id: 'bigHeader',
    font: { size: 25 },
  },
];
export const overlayLoadingTemplate = '<span class="ag-overlay-loading-center">Đang tải dữ liệu, vui lòng chờ!</span>';
export const overlayNoRowsTemplate =
  '<span style="padding: 10px; border: 2px solid #444; background: lightgoldenrodyellow;">Không có dữ liệu!</span>';
