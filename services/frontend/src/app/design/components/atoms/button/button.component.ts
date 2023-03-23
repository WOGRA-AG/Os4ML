import { Component, Input } from '@angular/core';
import {
  ButtonSize,
  ButtonType,
  ButtonVariant,
  ColorPalette,
} from 'src/app/shared/lib/types/button-types';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
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
