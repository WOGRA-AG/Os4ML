import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Databag } from '../../../../../../build/openapi/modelmanager';
import { LocalizedDatePipe } from '../../../pipes/localized-date.pipe';
import { MatTableModule } from '@angular/material/table';
import { IconButtonComponent } from '../../../../design/components/atoms/icon-button/icon-button.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { SolutionCreateButtonComponent } from '../solution-create-button/solution-create-button.component';
import { ProcessingStatusIndicatorComponent } from '../../molecules/processing-status-indicator/processing-status-indicator.component';
import { ShortStatusPipe } from '../../../pipes/short-status.pipe';
import {RuntimeIndicatorComponent} from "../../molecules/runtime-indicator/runtime-indicator.component";

@Component({
  selector: 'app-databag-data-table',
  templateUrl: './databag-data-table.component.html',
  styleUrls: ['./databag-data-table.component.scss'],
  imports: [
    LocalizedDatePipe,
    MatTableModule,
    IconButtonComponent,
    MatTooltipModule,
    TranslateModule,
    SolutionCreateButtonComponent,
    ProcessingStatusIndicatorComponent,
    ShortStatusPipe,
    RuntimeIndicatorComponent,
  ],
  standalone: true,
})
export class DatabagDataTableComponent {
  @Input() public databags: Databag[] = [];
  @Output() public settingButton = new EventEmitter<Databag>();
  @Output() public createSolutionButton = new EventEmitter<string>();

  public displayedColumns: string[] = [
    'databagName',
    'databagType',
    'features',
    'samples',
    'creationTime',
    'creation',
    'status',
    'actions',
  ];
}
