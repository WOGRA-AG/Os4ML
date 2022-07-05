import {
  AfterViewInit,
  Component,
  Input,
  ViewChild
} from '@angular/core';
import {Databag} from '../../../../build/openapi/objectstore';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {
  DialogDynamicComponent
} from '../dialog-dynamic/dialog-dynamic.component';
import {interval, Subscription} from 'rxjs';
import {
  DialogAddDatabagComponent
} from '../dialog-add-databag/dialog-add-databag.component';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {DialogEditDatabagComponent} from '../dialog-edit-databag/dialog-edit-databag.component';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-databag-table',
  templateUrl: './databag-table.component.html',
  styleUrls: ['./databag-table.component.scss']
})
export class DatabagTableComponent implements AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator | null | undefined;
  @ViewChild(MatSort) sort: MatSort | null | undefined;
  @Input() databags: Databag[] = [];

  dataSource: MatTableDataSource<Databag> = new MatTableDataSource<Databag>();

  filterValue = '';
  intervalSub: Subscription;
  displayedColumns: string[] = [
    'databagName', 'fileName', 'datasetType', 'numberColumns', 'numberRows',
    'creationTime', 'actions'
  ];

  constructor(public dialog: MatDialog, private router: Router, private activatedRoute: ActivatedRoute) {
    this.intervalSub = interval(10000).subscribe(() => {
      router.navigate(['.'], {relativeTo: activatedRoute}).then(() => {
        this.refreshDatasource();
        this.applyFilter();
      });
    });
  }

  ngAfterViewInit() {
    this.refreshDatasource();
  }

  refreshDatasource() {
    this.dataSource = new MatTableDataSource(this.databags);
    // TODO: Remove diabled linter
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.dataSource.paginator = this.paginator!;
    // TODO: Remove diabled linter
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.dataSource.sort = this.sort!;
  }

  updateAndApplyFilterValue(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.applyFilter();
  }

  applyFilter() {
    this.dataSource.filter = this.filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(DialogDynamicComponent, {
      data: {component: DialogAddDatabagComponent}
    });
    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['.'], {relativeTo: this.activatedRoute}).then(() => this.refreshDatasource());
    });
  }

  openEditDialog(databag: Databag) {
    const uuid: string | undefined = databag.bucketName;
    const dialogRef = this.dialog.open(DialogDynamicComponent, {
      data: {
        component: DialogEditDatabagComponent,
        uuid,
        databag
      }
    });
    dialogRef.beforeClosed().subscribe(() => {
      this.router.navigate(['.'], {relativeTo: this.activatedRoute}).then(() => this.refreshDatasource());
    });
  }
}
