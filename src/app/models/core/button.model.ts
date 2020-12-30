export class ButtonModel {
  Title: string;
  Titlei18n: string;
  Visible = true;
  Enable = true;
  GrandAccess = true;
  Click: ($event: any) => void;
}
