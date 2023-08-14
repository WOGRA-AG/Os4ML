import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from 'src/app/services/theme.service';
import { map, Observable } from 'rxjs';
import { IconButtonComponent } from 'src/app/components/molecules/icon-button/icon-button.component';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule, IconButtonComponent],
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss'],
})
export class ThemeToggleComponent {
  private _themeService = inject(ThemeService);
  private _icon$ = this._themeService.theme$.pipe(
    map(theme => `${theme}_mode`)
  );

  protected get icon$(): Observable<string> {
    return this._icon$;
  }

  protected get themeService(): ThemeService {
    return this._themeService;
  }
}
