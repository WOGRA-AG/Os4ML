import {Component, OnDestroy} from '@angular/core';
import {interval, Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {
  DialogDynamicComponent
} from '../../components/dialog-dynamic/dialog-dynamic.component';
import {
  CreateDatabagComponent
} from '../../components/shared/organisms/create-databag/create-databag.component';
import {UserFacade} from '../../user/services/user-facade.service';
import {Databag, ModelmanagerService, User} from '../../../../build/openapi/modelmanager';

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
    private modelManger: ModelmanagerService,
    public dialog: MatDialog,
    private userFacade: UserFacade,
  ) {
    this.intervalSub = interval(10000).subscribe(x => {
      this.userFacade.refresh();
    });
    this.userSub = this.userFacade.currentUser$.pipe().subscribe(currentUser => {
        this.user = currentUser;
        this.modelManger.getDatabags(currentUser?.rawToken).subscribe(
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
