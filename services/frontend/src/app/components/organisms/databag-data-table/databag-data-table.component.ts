import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Databag } from '../../../../../build/openapi/modelmanager';
import { LocalizedDatePipe } from '../../../pipes/localized-date.pipe';
import { MatTableModule } from '@angular/material/table';
import { IconButtonComponent } from '../../molecules/icon-button/icon-button.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { SolutionCreateButtonComponent } from '../solution-create-button/solution-create-button.component';
import { ProcessingStatusIndicatorComponent } from '../../molecules/processing-status-indicator/processing-status-indicator.component';
import { ShortStatusPipe } from '../../../pipes/short-status.pipe';
import { RuntimeIndicatorComponent } from '../../molecules/runtime-indicator/runtime-indicator.component';
import { ContextMenuItemComponent } from '../../molecules/context-menu-item/context-menu-item.component';
import { DatabagContextMenuComponent } from '../databag-context-menu/databag-context-menu.component';

@Component({
  selector: 'app-databag-data-table',
  templateUrl: './databag-data-table.component.html',
  styleUrls: ['./databag-data-table.component.scss'],
  standalone: true,
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
    ContextMenuItemComponent,
    DatabagContextMenuComponent,
  ],
})
export class DatabagDataTableComponent {
  @Input() public databags: Databag[] = [];
  @Output() public settingButton = new EventEmitter<Databag>();
  @Output() public createSolutionButton = new EventEmitter<string>();

  public displayedColumns: string[] = [
    'databagName',
    'features',
    'samples',
    'creationTime',
    'creation',
    'status',
    'actions',
  ];
}
