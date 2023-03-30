import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SupportComponent } from '../support/support.component';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { MaterialModule } from 'src/app/material/material.module';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
  standalone: true,
  imports: [
    MaterialModule,
    RouterLinkActive,
    RouterLink,
    SupportComponent,
    TranslateModule,
  ],
})
export class NavBarComponent {}
