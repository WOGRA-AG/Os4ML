import {Component, OnDestroy} from '@angular/core';
import {Databag} from '../../../../build/openapi/objectstore';
import {interval, Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-databag-page',
  templateUrl: './databag-page.component.html',
  styleUrls: ['./databag-page.component.scss']
})
export class DatabagPageComponent implements OnDestroy {
  databags: Databag[] = [];
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
    });
  }

  ngOnDestroy() {
    this.intervalSub.unsubscribe();
  }
}
