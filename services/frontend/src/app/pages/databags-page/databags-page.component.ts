import {Component, OnDestroy} from '@angular/core';
import {Databag, ObjectstoreService} from '../../../../build/openapi/objectstore';
import {interval, Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {
  DialogDynamicComponent
} from '../../components/dialog-dynamic/dialog-dynamic.component';
import {
  CreateDatabagComponent
} from '../../components/shared/organisms/create-databag/create-databag.component';
import {UserFacade} from '../../user/services/user-facade.service';
import {User} from '../../../../build/openapi/jobmanager';

@Component({
  selector: 'app-databags-page',
  templateUrl: './databags-page.component.html',
  styleUrls: ['./databags-page.component.scss']
})

export class DatabagsPageComponent implements OnDestroy {
  databags: Databag[] = [];
  intervalSub: Subscription;
  userSub: Subscription;
  user: User = {id: '', email: '', rawToken: ''};

  constructor(
    private activatedRoute: ActivatedRoute,
    private objectstore: ObjectstoreService,
    public dialog: MatDialog,
    private userFacade: UserFacade,
  ) {
    this.intervalSub = interval(10000).subscribe(x => {
      this.userFacade.refresh();
    });
    this.userSub = this.userFacade.currentUser$.pipe().subscribe(currentUser => {
        this.user = currentUser;
        this.objectstore.getAllDatabags(currentUser?.rawToken).subscribe(
          databags => this.databags = databags
        );
      }
    );
  }

  addDatabag() {
    const dialogRef = this.dialog.open(DialogDynamicComponent, {
      data: {component: CreateDatabagComponent}
    });
    dialogRef.afterClosed().subscribe(() => {
    });
  }

  ngOnDestroy() {
    this.intervalSub.unsubscribe();
    this.userSub.unsubscribe();
  }
}
