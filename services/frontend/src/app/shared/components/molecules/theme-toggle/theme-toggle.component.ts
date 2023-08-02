import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from 'src/app/core/services/theme.service';
import { map } from 'rxjs';
import { IconButtonComponent } from 'src/app/design/components/atoms/icon-button/icon-button.component';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule, IconButtonComponent],
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss'],
})
export class ThemeToggleComponent {
  public themeService = inject(ThemeService);
  public icon$ = this.themeService.theme$.pipe(map(theme => `${theme}_mode`));
}
