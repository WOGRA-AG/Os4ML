import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-no-solutions-placeholder',
  templateUrl: './no-solutions-placeholder.component.html',
  styleUrls: ['./no-solutions-placeholder.component.scss'],
})
export class NoSolutionsPlaceholderComponent {
  @Output() public addSolutionButton: EventEmitter<MouseEvent> =
    new EventEmitter<MouseEvent>();
}
