import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SelectComponent } from '../../molecules/select/select.component';
import { Databag } from '../../../../../../build/openapi/modelmanager';
import { ToSelectOptionPipe } from '../../../pipes/to-select-option.pipe';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-databag-filter',
  templateUrl: './databag-filter.component.html',
  styleUrls: ['./databag-filter.component.scss'],
  standalone: true,
  imports: [SelectComponent, ToSelectOptionPipe, TranslateModule],
})
export class DatabagFilterComponent {
  @Input() public databags: Databag[] = [];
  @Input() public defaultValue?: string;
  @Output() public databagChange = new EventEmitter<string>();

  onDatabagChange(databagId: string): void {
    this.databagChange.emit(databagId);
  }

  public getDatabagId(databag: Databag): string {
    return databag.id ?? '';
  }
  public getDatabagName(databag: Databag): string {
    return databag.name ?? '';
  }
}
