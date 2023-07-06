import { NgClass, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
export enum ButtonTypes {
  primary = 'primary',
  secondary = 'secondary',
  text = 'text',
}
@Component({
  selector: 'app-new-button',
  templateUrl: './new-button.component.html',
  styleUrls: ['./new-button.component.scss'],
  standalone: true,
  imports: [NgIf, MatButtonModule, MatRippleModule, NgClass, MatIconModule],
})
export class NewButtonComponent {
  @Input() public type: ButtonTypes = ButtonTypes.primary;
  @Input() public size: 'small' | 'medium' | 'large' = 'medium';
  @Input() public ariaLabel?: string = '';
  @Input() public icon?: string = '';
  @Input() public disabled?: boolean = false;
}
