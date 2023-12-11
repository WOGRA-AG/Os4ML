import { Component, DestroyRef, HostListener, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import localeEn from '@angular/common/locales/en';
import localeEnExtra from '@angular/common/locales/extra/en';
import {
  NavigationStart,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { SideNavComponent } from './components/templates/side-nav/side-nav.component';
import { MaterialModule } from './components/atoms/material/material.module';
import { SideNavItemComponent } from './components/molecules/side-nav-item/side-nav-item.component';
import { NewButtonComponent } from './components/molecules/new-button/new-button.component';
import { ThemeToggleComponent } from './components/organisms/theme-toggle/theme-toggle.component';

import { AppSignetComponent } from './components/atoms/signet/app-signet.component';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HamburgerButtonComponent } from './components/molecules/hamburger-button/hamburger-button.component';
import { IconButtonComponent } from './components/molecules/icon-button/icon-button.component';
import { ContextMenuItemComponent } from './components/molecules/context-menu-item/context-menu-item.component';

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
    AppSignetComponent,
    HamburgerButtonComponent,
    IconButtonComponent,
    ContextMenuItemComponent,
  ],
})
export class AppComponent {
  public showSidebar = false;
  private destroyRef = inject(DestroyRef);
  constructor(
    private router: Router,
    private translate: TranslateService
  ) {
    registerLocaleData(localeDe, 'de', localeDeExtra);
    registerLocaleData(localeEn, 'en', localeEnExtra);
    translate.setDefaultLang('en');
    translate.use('en');
    this.router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.showSidebar = false;
      });
  }
  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth >= 1000) {
      this.showSidebar = false;
    }
  }
}
