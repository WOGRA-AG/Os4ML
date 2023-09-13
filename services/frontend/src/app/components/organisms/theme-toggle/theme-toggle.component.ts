import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from 'src/app/services/theme.service';
import { Observable } from 'rxjs';
import { IconButtonComponent } from 'src/app/components/molecules/icon-button/icon-button.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { NewButtonComponent } from '../../molecules/new-button/new-button.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [
    CommonModule,
    IconButtonComponent,
    MatButtonToggleModule,
    MatIconModule,
    MatRippleModule,
    NewButtonComponent,
    TranslateModule,
  ],
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss'],
})
export class ThemeToggleComponent {
  private _themeService = inject(ThemeService);
  private _theme$ = this._themeService.theme$;

  protected get theme$(): Observable<string> {
    return this._theme$;
  }

  protected get themeService(): ThemeService {
    return this._themeService;
  }
}
