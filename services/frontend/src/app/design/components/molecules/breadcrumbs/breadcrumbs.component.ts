import { Component, Input } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, MatIconModule, MatListModule],
})
export class BreadcrumbsComponent {
  @Input() public breadcrumbs: Breadcrumb[] = [];
}

export interface Breadcrumb {
  label: string;
  link?: string;
}
