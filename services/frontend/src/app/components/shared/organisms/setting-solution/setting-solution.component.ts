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
  solutionName: string;
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
    this.solutionName = this.trimSolutionName(this.solution.name);
    this.userFacade.currentUser$.pipe().subscribe(
      currentUser => this.user = currentUser
    );
  }

  trimSolutionName(name: string | undefined): string {
    if (!name) {
      return '';
    }
    const uuidIndex = name.indexOf('_');
    return name.substring(uuidIndex + 1);
  }

  close(): void {
    this.dialogRef.close();
  }

  update() {
    const oldName: string = this.solution.name || '';
    this.solution.name = oldName.replace(this.trimSolutionName(oldName), this.solutionName);
    this.modelManager.updateSolutionByName(oldName, this.user?.rawToken, this.solution).subscribe(() => {
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
    if (this.solution.name) {
      this.modelManager.downloadModel(this.solution.name, this.user?.rawToken).subscribe(url => {
        const link = document.createElement('a');
        link.href = url;
        link.toggleAttribute('download');
        link.click();
        link.remove();
      });
    }
  }
}
