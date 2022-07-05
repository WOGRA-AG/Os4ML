import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(translate: TranslateService) {
    registerLocaleData(localeDe, 'de', localeDeExtra);
    translate.setDefaultLang('de');
    translate.use('de');
  }
}
