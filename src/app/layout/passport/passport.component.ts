import { Component } from '@angular/core';
import { SettingsService } from '@delon/theme';

@Component({
  selector: 'layout-passport',
  templateUrl: './passport.component.html',
  styleUrls: ['./passport.component.less'],
})
export class LayoutPassportComponent {
  appName = '';
  description = '';

  links = [
    {
      title: 'Digital ID',
      href: '',
    },
    {
      title: 'Savis',
      href: '',
    },
    {
      title: 'Trust CA',
      href: '',
    },
  ];

  constructor(private settingService: SettingsService) {
    this.appName = settingService.app.name;
    this.description = settingService.app.description;
  }
}
