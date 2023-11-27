import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { NgClass } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    NgClass,
    MatRippleModule,
  ],
})
export class ContextMenuComponent {
  @Input() public disabled = false;
  @Input() public menuDescription = '';
  @Input() public menuIcon = '';
  @Input() public variant: 'primary' | 'secondary' | 'text' | 'warn' =
    'primary';
  @Input() public size: 'small' | 'medium' | 'large' = 'medium';
}
