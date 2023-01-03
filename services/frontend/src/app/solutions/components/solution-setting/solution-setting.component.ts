import {Component, Renderer2} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Solution} from '../../../../../build/openapi/modelmanager';
import {PipelineStatus} from '../../../models/pipeline-status';
import {PopupDeleteComponent} from '../../../shared/components/organisms/popup-delete/popup-delete.component';
import {SolutionService} from '../../services/solution.service';
import {DialogDynamicComponent} from '../../../shared/components/dialog/dialog-dynamic/dialog-dynamic.component';

@Component({
  selector: 'app-solution-setting',
  templateUrl: './solution-setting.component.html',
  styleUrls: ['./solution-setting.component.scss']
})
export class SolutionSettingComponent {
  solution: Solution;
  deleting = false;
  readonly pipelineStatus = PipelineStatus;

  constructor(
    private dialogRef: MatDialogRef<DialogDynamicComponent>,
    private dialog: MatDialog,
    private solutionService: SolutionService,
    private renderer: Renderer2
  ) {
    this.solution = dialogRef.componentInstance.data.solution;
  }

  close(): void {
    this.dialogRef.close();
  }

  update() {
    if (!this.solution.id) {
      this.dialogRef.close('aborted');
      return;
    }
    this.solutionService.updateSolutionById(this.solution.id, this.solution).subscribe(() => {
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
      this.solutionService.downloadModel(this.solution.id).subscribe(url => {
        const link = this.renderer.createElement('a');
        link.target = '_blank';
        link.href = url;
        link.dowload = 'model.zip';
        link.click();
        link.remove();
      });
    }
  }
}
