import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-shared-databag-placeholder',
  templateUrl: './databag-placeholder.component.html',
  styleUrls: ['./databag-placeholder.component.scss']
})
export class DatabagPlaceholderComponent {
  @Output() mainButton: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();
}
