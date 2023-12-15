import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Databag } from '../../../../../build/openapi/modelmanager';
import { LocalizedDatePipe } from '../../../pipes/localized-date.pipe';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { IconButtonComponent } from '../../molecules/icon-button/icon-button.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { SolutionCreateButtonComponent } from '../solution-create-button/solution-create-button.component';
import { ProcessingStatusIndicatorComponent } from '../../molecules/processing-status-indicator/processing-status-indicator.component';
import { ShortStatusPipe } from '../../../pipes/short-status.pipe';
import { RuntimeIndicatorComponent } from '../../molecules/runtime-indicator/runtime-indicator.component';
import { RouterLink } from '@angular/router';
import { ContextMenuItemComponent } from '../../molecules/context-menu-item/context-menu-item.component';
import { DatabagContextMenuComponent } from '../databag-context-menu/databag-context-menu.component';
import { SolutionContextMenuComponent } from '../solution-context-menu/solution-context-menu.component';
import { NgIf } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SkeletonLoaderComponent } from '../../molecules/skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-databag-data-table',
  templateUrl: './databag-data-table.component.html',
  styleUrls: ['./databag-data-table.component.scss'],
  standalone: true,
  imports: [
    LocalizedDatePipe,
    MatTableModule,
    MatSortModule,
    IconButtonComponent,
    MatTooltipModule,
    TranslateModule,
    SolutionCreateButtonComponent,
    ProcessingStatusIndicatorComponent,
    ShortStatusPipe,
    RuntimeIndicatorComponent,
    RouterLink,
    ContextMenuItemComponent,
    DatabagContextMenuComponent,
    SolutionContextMenuComponent,
    NgIf,
    MatProgressBarModule,
    NgxSkeletonLoaderModule,
    SkeletonLoaderComponent,
  ],
})
export class DatabagDataTableComponent implements AfterViewInit {
  @Input() public isLoading = true;
  @Output() public createSolutionButton = new EventEmitter<string>();
  @ViewChild(MatSort) public sort!: MatSort;
  public dataSource: MatTableDataSource<Databag>;

  public displayedColumns: string[] = [
    'name',
    'features',
    'samples',
    'creationTime2',
    'creationTime',
    'status',
    'actions',
  ];
  private _databags: Databag[] = [];
  constructor() {
    this.dataSource = new MatTableDataSource<Databag>(new Array(3).fill({}));
  }
  get databags(): Databag[] {
    return this._databags;
  }
  @Input()
  set databags(databags: Databag[]) {
    this._databags = databags;
    this.updateDataSource();
  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }
  private updateDataSource(): void {
    if (!this.isLoading) {
      this.dataSource.data = this._databags;
    }
  }
}
