import { Component } from '@angular/core';
import { Os4mlDefaultTemplateComponent } from '../../templates/os4ml-default-template/os4ml-default-template.component';
import { NewButtonComponent } from '../../molecules/new-button/new-button.component';
import { TranslateModule } from '@ngx-translate/core';
import { DatabagCreateButtonComponent } from '../../organisms/databag-create-button/databag-create-button.component';
import { DatabagsCreateDialogComponent } from '../databags-create-dialog/databags-create-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SolutionDetailPipelineStatusComponent } from '../../organisms/solution-detail-pipeline-status/solution-detail-pipeline-status.component';
import { DatabagDetailPiplineStatusComponent } from '../../organisms/databag-detail-pipline-status/databag-detail-pipline-status.component';
import { DatabagDetailFieldSettingsComponent } from '../../organisms/databag-detail-field-settings/databag-detail-field-settings.component';
import { DatabagDetailDownloadDatabagComponent } from '../../organisms/databag-detail-download-databag/databag-detail-download-databag.component';
import { DatabagDetailDeleteDatabagComponent } from '../../organisms/databag-detail-delete-databag/databag-detail-delete-databag.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-databag-detail-page',
  templateUrl: './databag-detail-page.component.html',
  styleUrls: ['./databag-detail-page.component.scss'],
  standalone: true,
  imports: [
    Os4mlDefaultTemplateComponent,
    NewButtonComponent,
    TranslateModule,
    DatabagCreateButtonComponent,
    SolutionDetailPipelineStatusComponent,
    DatabagDetailPiplineStatusComponent,
    DatabagDetailFieldSettingsComponent,
    DatabagDetailDownloadDatabagComponent,
    DatabagDetailDeleteDatabagComponent,
  ],
})
export class DatabagDetailPageComponent {
  // public databag$: Observable<Databag | null>;
  public databagId: string;
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.databagId = this.activatedRoute.snapshot.paramMap.get('id') ?? '';
    // this.databag$ = this.reloadSubject.pipe(
    //   startWith(null),
    //   switchMap(() => this.databagService.loadDatabagById(this.databagId)),
    //   tap(console.log),
    //   catchError(() => {
    //     this.router.navigate(['**']);
    //     return of(null);
    //   })
    //);
  }
  addDatabag(): void {
    this.dialog.open(DatabagsCreateDialogComponent, {
      ariaLabelledBy: 'dialog-title',
      disableClose: true,
    });
  }
}
