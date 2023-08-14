import { Component, Input } from '@angular/core';
import {
  ButtonSize,
  ButtonType,
  ButtonVariant,
  ColorPalette,
} from 'src/app/lib/types/button-types';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  NgSwitch,
  NgSwitchDefault,
  NgIf,
  NgTemplateOutlet,
  NgSwitchCase,
} from '@angular/common';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  standalone: true,
  imports: [
    NgSwitch,
    NgSwitchDefault,
    MatButtonModule,
    NgIf,
    MatIconModule,
    NgTemplateOutlet,
    NgSwitchCase,
  ],
})
export class ButtonComponent {
  @Input() public color: ColorPalette = 'primary';
  @Input() public type: ButtonType = 'button';
  @Input() public size: ButtonSize = 'medium';
  @Input() public variant: ButtonVariant = 'raised';
  @Input() public icon = '';
  @Input() public disabled = false;
  @Input() public disableRipple = false;
  @Input() public form: string | undefined = undefined;
}
