import { Component, DestroyRef, HostListener, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {AsyncPipe, NgIf, registerLocaleData} from '@angular/common';
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
import {filter, Observable} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HamburgerButtonComponent } from './components/molecules/hamburger-button/hamburger-button.component';
import { IconButtonComponent } from './components/molecules/icon-button/icon-button.component';
import { ContextMenuItemComponent } from './components/molecules/context-menu-item/context-menu-item.component';
import { SignetMobileComponent } from './components/atoms/signet-mobile/signet-mobile.component';
import { AvatarIconComponent } from './components/molecules/avatar-icon/avatar-icon.component';
import {User} from "../../build/openapi/modelmanager";
import {UserService} from "./services/user.service";
import {
  Os4mlDefaultTemplateComponent
} from "./components/templates/os4ml-default-template/os4ml-default-template.component";

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
    SignetMobileComponent,
    AvatarIconComponent,
    AsyncPipe,
    NgIf,
    Os4mlDefaultTemplateComponent,
  ],
})
export class AppComponent {
  public showSidebar = false;
  public currentUser$: Observable<User>;
  private destroyRef = inject(DestroyRef);
  constructor(
    private router: Router,
    private userService: UserService,
    private translate: TranslateService
  ) {
    this.currentUser$ = this.userService.currentUser$;
    registerLocaleData(localeDe, 'de', localeDeExtra);
    registerLocaleData(localeEn, 'en', localeEnExtra);
    this.translate.setDefaultLang('en');
    this.translate.use('en');
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
