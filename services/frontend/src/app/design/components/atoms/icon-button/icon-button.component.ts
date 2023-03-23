import { Component, Input } from '@angular/core';
import {
  ButtonSize,
  ButtonType,
  ColorPalette,
} from 'src/app/shared/lib/types/button-types';

@Component({
  selector: 'app-icon-button',
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.scss'],
})
export class IconButtonComponent {
  @Input() public color: ColorPalette = 'primary';
  @Input() public type: ButtonType = 'button';
  @Input() public size: ButtonSize = 'medium';
  @Input() public icon = '';
}
