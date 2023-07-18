import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import localeEn from '@angular/common/locales/en';
import localeEnExtra from '@angular/common/locales/extra/en';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NavBarComponent } from './core/components/nav-bar/nav-bar.component';
import { SideNavComponent } from './shared/components/templates/side-nav/side-nav.component';
import { MaterialModule } from './material/material.module';
import { SideNavItemComponent } from './shared/components/molecules/side-nav-item/side-nav-item.component';
import { SupportComponent } from './core/components/support/support.component';
import { MatDialog } from '@angular/material/dialog';
import { GettingStartedStepperComponent } from './pages/dialogs/getting-started-stepper/getting-started-stepper.component';
import { NewButtonComponent } from './shared/components/molecules/new-button/new-button.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    NavBarComponent,
    RouterOutlet,
    SideNavComponent,
    RouterLink,
    MaterialModule,
    RouterLinkActive,
    TranslateModule,
    SideNavItemComponent,
    SupportComponent,
    NewButtonComponent,
  ],
})
export class AppComponent {
  constructor(private translate: TranslateService, private dialog: MatDialog) {
    registerLocaleData(localeDe, 'de', localeDeExtra);
    registerLocaleData(localeEn, 'en', localeEnExtra);
    translate.setDefaultLang('en');
    translate.use('en');
  }
  openGettingStartedDialog(): void {
    this.dialog.open(GettingStartedStepperComponent, {
      panelClass: 'getting-started-dialog',
    });
  }
}
