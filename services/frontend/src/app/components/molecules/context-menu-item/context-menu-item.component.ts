import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu-item.component.html',
  styleUrls: ['./context-menu-item.component.scss'],
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatMenuModule, NgClass, RouterLink],
})
export class ContextMenuItemComponent {
  @Input() public menuDescription = '';
  @Input() public menuIcon = '';
  @Input() public routerLink: string[] | string = [];
  @Input() public params = {};
  @Input() public dataTestid?: string;
}
