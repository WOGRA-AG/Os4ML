import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-shared-solution-placeholder',
  templateUrl: './solution-placeholder.component.html',
  styleUrls: ['./solution-placeholder.component.scss']
})
export class SolutionPlaceholderComponent {
  @Output() mainButton: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();
}
