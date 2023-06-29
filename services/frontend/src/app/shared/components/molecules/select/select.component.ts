import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { SelectOption } from '../../../pipes/to-select-option.pipe';
import { NgForOf } from '@angular/common';
@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  standalone: true,
  imports: [MatSelectModule, TranslateModule, NgForOf],
})
export class SelectComponent {
  @Input() public label = '';
  @Input() public options: SelectOption[] = [];
  @Input() public defaultValue?: string;
  @Output() public selectionChange: EventEmitter<string> =
    new EventEmitter<string>();
}
