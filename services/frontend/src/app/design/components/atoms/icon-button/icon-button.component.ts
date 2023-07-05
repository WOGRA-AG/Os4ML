import { Component, Input } from '@angular/core';
import {
  ButtonSize,
  ButtonType,
  ColorPalette,
} from 'src/app/shared/lib/types/button-types';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-icon-button',
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.scss'],
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
})
export class IconButtonComponent {
  @Input() public disabled = false;
  @Input() public color: ColorPalette = 'primary';
  @Input() public type: ButtonType = 'button';
  @Input() public size: ButtonSize = 'medium';
  @Input() public icon = '';
}
