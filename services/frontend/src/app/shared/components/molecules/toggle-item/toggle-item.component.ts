import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { Column } from '../../../../../../build/openapi/modelmanager';

@Component({
  selector: 'app-toggle-item',
  templateUrl: './toggle-item.component.html',
  styleUrls: ['./toggle-item.component.scss'],
})
export class ToggleItemComponent {
  @Input() public column: Column = {};
  @Input() public disabled = false;
  @Input() public selected = false;
  @Output() public selectedChange: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  toggleClick(e: MouseEvent): void {
    e.preventDefault();
  }

  toggleChange(e: MatSlideToggle): void {
    // Workaround because toggle() Method does not trigger change events on SlideToggle Element.
    // See https://github.com/angular/components/issues/11812 and https://github.com/angular/components/pull/11846
    // For more info
    e.toggle();
    this.selected = e.checked;
    this.selectedChange.emit(this.selected);
  }
}
