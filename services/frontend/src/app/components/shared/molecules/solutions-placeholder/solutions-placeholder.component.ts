import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-solutions-placeholder',
  templateUrl: './solutions-placeholder.component.html',
  styleUrls: ['./solutions-placeholder.component.scss']
})
export class SolutionsPlaceholderComponent {
  @Output() mainButton: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();
}
