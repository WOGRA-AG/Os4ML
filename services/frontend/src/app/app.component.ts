import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import localeEn from '@angular/common/locales/en';
import localeEnExtra from '@angular/common/locales/extra/en';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from './core/components/nav-bar/nav-bar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [NavBarComponent, RouterOutlet],
})
export class AppComponent {
  constructor(translate: TranslateService) {
    registerLocaleData(localeDe, 'de', localeDeExtra);
    registerLocaleData(localeEn, 'en', localeEnExtra);
    translate.setDefaultLang('en');
    translate.use('en');
  }
}
