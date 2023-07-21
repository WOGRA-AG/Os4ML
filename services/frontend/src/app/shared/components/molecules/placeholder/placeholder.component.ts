import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-placeholder',
  templateUrl: './placeholder.component.html',
  styleUrls: ['./placeholder.component.scss'],
  standalone: true,
})
export class PlaceholderComponent {
  @Input() public src?: string;
  @Input() public title?: string;
  @Input() public description?: string;
}
