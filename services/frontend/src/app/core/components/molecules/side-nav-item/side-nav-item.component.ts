import { Component } from '@angular/core';
import { RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatRippleModule } from '@angular/material/core';

@Component({
  selector: 'app-side-nav-item',
  templateUrl: './side-nav-item.component.html',
  styleUrls: ['./side-nav-item.component.scss'],
  standalone: true,
  imports: [RouterLinkActive, MatListModule, MatRippleModule],
})
export class SideNavItemComponent {}
