import {Component} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {DialogDynamicComponent} from '../../../dialog-dynamic/dialog-dynamic.component';
import {PopupDeleteComponent} from '../popup-delete/popup-delete.component';
import {UserFacade} from '../../../../user/services/user-facade.service';
import {ModelmanagerService, Solution, User} from '../../../../../../build/openapi/modelmanager';
import {PipelineStatus} from '../../../../models/pipeline-status';

@Component({
  selector: 'app-shared-setting-solution',
  templateUrl: './setting-solution.component.html',
  styleUrls: ['./setting-solution.component.scss']
})
export class SettingSolutionComponent {
  solution: Solution;
  deleting = false;
  user: User = {id: '', email: '', rawToken: ''};
  readonly pipelineStatus = PipelineStatus;

  constructor(
    private dialogRef: MatDialogRef<DialogDynamicComponent>,
    private dialog: MatDialog,
    private modelManager: ModelmanagerService,
    private userFacade: UserFacade,
    ) {
    this.solution = dialogRef.componentInstance.data.solution;
    this.userFacade.currentUser$.pipe().subscribe(
      currentUser => this.user = currentUser
    );
  }

  close(): void {
    this.dialogRef.close();
  }

  update() {
    if (!this.solution.id) {
      this.dialogRef.close('aborted');
      return;
    }
    this.modelManager.updateSolutionById(this.solution.id, this.user?.rawToken, this.solution).subscribe(() => {
      this.dialogRef.close('updated');
    });
  }

  delete() {
    const deleteDialogRef = this.dialog.open(DialogDynamicComponent, {
      data: {component: PopupDeleteComponent, solution: this.solution}
    });
    deleteDialogRef.afterClosed().subscribe((msg) => {
      if (msg === 'deleted') {
        this.dialogRef.close();
      }
    });
  }

  download() {
    if (this.solution.id) {
      this.modelManager.downloadModel(this.solution.id, this.user?.rawToken).subscribe(url => {
        const link = document.createElement('a');
        link.href = url;
        link.toggleAttribute('download');
        link.click();
        link.remove();
      });
    }
  }
}
