import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProcessingStatusIndicatorComponent } from '../../molecules/processing-status-indicator/processing-status-indicator.component';
import { ShortStatusPipe } from '../../../pipes/short-status.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Column } from '../../../../../build/openapi/modelmanager';
import { MlTypes } from '../../../models/ml-types';

@Component({
  selector: 'app-databag-detail-field-settings',
  templateUrl: './databag-detail-field-settings.component.html',
  styleUrls: ['./databag-detail-field-settings.component.scss'],
  standalone: true,
  imports: [
    ProcessingStatusIndicatorComponent,
    ShortStatusPipe,
    TranslateModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    NgForOf,
    ReactiveFormsModule,
    FormsModule,
    NgClass,
    NgIf,
  ],
})
export class DatabagDetailFieldSettingsComponent {
  @Output() public updateDatabagColumns = new EventEmitter<Column[]>();
  @Input() public columns: Column[] | undefined | null = [];
  public mlTypesArray = Object.keys(MlTypes);

  updateColumn(columnName: string | undefined, newType: string): void {
    this.changeColumnType(columnName!, newType);
    this.updateDatabagColumns.emit(this.columns!);
  }
  changeColumnType(columnName: string, newType: string): void {
    const column = this.columns!.find(c => c.name === columnName);
    if (column) {
      column.type = newType;
    }
  }
}
