import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SupportComponent } from '../support/support.component';
import { MatIconModule } from '@angular/material/icon';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
  standalone: true,
  imports: [
    MatSidenavModule,
    MatListModule,
    RouterLinkActive,
    RouterLink,
    MatIconModule,
    SupportComponent,
    TranslateModule,
  ],
})
export class NavBarComponent {}
