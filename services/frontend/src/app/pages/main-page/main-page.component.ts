import {Component, OnDestroy} from '@angular/core';
import {
  Databag,
} from '../../../../build/openapi/objectstore';
import {interval, Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {
  DialogDynamicComponent
} from '../../components/dialog-dynamic/dialog-dynamic.component';
import {
  PopupUploadComponent
} from '../../components/shared/organisms/popup-upload/popup-upload.component';
import {Solution} from '../../../../build/openapi/jobmanager';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnDestroy {
  databags: Databag[] = [];
  solutions: Solution[] = [];
  selectedDatabag: Databag = {};
  intervalSub: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.intervalSub = interval(10000).subscribe(x => {
      router.navigate(['.'], {relativeTo: activatedRoute});
    });
    activatedRoute.data.subscribe(data => {
      this.databags = data['databags'];
      this.solutions = data['solutions'];
    });
  }

  addDatabag() {
    const dialogRef = this.dialog.open(DialogDynamicComponent, {
      data: {component: PopupUploadComponent}
    });
    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['.'], {relativeTo: this.activatedRoute});
    });
  }

  ngOnDestroy() {
    this.intervalSub.unsubscribe();
  }
}
