import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
})
export class BreadcrumbsComponent {
  @Input() public breadcrumbs: Breadcrumb[] = [];
}

export interface Breadcrumb {
  label: string;
  link?: string;
}
