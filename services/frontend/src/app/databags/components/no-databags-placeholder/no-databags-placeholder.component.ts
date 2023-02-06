import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-no-databags-placeholder',
  templateUrl: './no-databags-placeholder.component.html',
  styleUrls: ['./no-databags-placeholder.component.scss'],
})
export class NoDatabagsPlaceholderComponent {
  @Output() addDatabagButton: EventEmitter<MouseEvent> =
    new EventEmitter<MouseEvent>();
}
