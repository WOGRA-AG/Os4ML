import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import localeEn from '@angular/common/locales/en';
import localeEnExtra from '@angular/common/locales/extra/en';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SideNavComponent } from './shared/components/templates/side-nav/side-nav.component';
import { MaterialModule } from './shared/components/atoms/material/material.module';
import { SideNavItemComponent } from './shared/components/molecules/side-nav-item/side-nav-item.component';
import { MatDialog } from '@angular/material/dialog';
import { NewButtonComponent } from './shared/components/molecules/new-button/new-button.component';
import { ThemeToggleComponent } from './shared/components/molecules/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    RouterOutlet,
    SideNavComponent,
    RouterLink,
    MaterialModule,
    RouterLinkActive,
    TranslateModule,
    SideNavItemComponent,
    NewButtonComponent,
    ThemeToggleComponent,
  ],
})
export class AppComponent {
  constructor(private translate: TranslateService, private dialog: MatDialog) {
    registerLocaleData(localeDe, 'de', localeDeExtra);
    registerLocaleData(localeEn, 'en', localeEnExtra);
    translate.setDefaultLang('en');
    translate.use('en');
  }
}
