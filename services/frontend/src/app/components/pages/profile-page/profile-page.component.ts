import { Component } from '@angular/core';
import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';
import { NewButtonComponent } from '../../molecules/new-button/new-button.component';
import { Os4mlDefaultTemplateComponent } from '../../templates/os4ml-default-template/os4ml-default-template.component';
import { PredictionCreateButtonComponent } from '../../organisms/prediction-create-button/prediction-create-button.component';
import { ShortStatusPipe } from '../../../pipes/short-status.pipe';
import { SolutionCreateButtonComponent } from '../../organisms/solution-create-button/solution-create-button.component';
import { SolutionDetailDeleteSolutionComponent } from '../../organisms/solution-detail-delete-solution/solution-detail-delete-solution.component';
import { SolutionDetailDependenciesComponent } from '../../organisms/solution-detail-dependencies/solution-detail-dependencies.component';
import { SolutionDetailDownloadModelComponent } from '../../organisms/solution-detail-download-model/solution-detail-download-model.component';
import { SolutionDetailInputComponent } from '../../organisms/solution-detail-input/solution-detail-input.component';
import { SolutionDetailOutputComponent } from '../../organisms/solution-detail-output/solution-detail-output.component';
import { SolutionDetailPipelineStatusComponent } from '../../organisms/solution-detail-pipeline-status/solution-detail-pipeline-status.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AvatarIconComponent } from '../../molecules/avatar-icon/avatar-icon.component';
import { UserService } from '../../../services/user.service';
import { Observable } from 'rxjs';
import { User } from '../../../../../build/openapi/modelmanager';
import { MatIconModule } from '@angular/material/icon';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
  standalone: true,
  imports: [
    AsyncPipe,
    NewButtonComponent,
    NgIf,
    Os4mlDefaultTemplateComponent,
    PredictionCreateButtonComponent,
    ShortStatusPipe,
    SolutionCreateButtonComponent,
    SolutionDetailDeleteSolutionComponent,
    SolutionDetailDependenciesComponent,
    SolutionDetailDownloadModelComponent,
    SolutionDetailInputComponent,
    SolutionDetailOutputComponent,
    SolutionDetailPipelineStatusComponent,
    TranslateModule,
    AvatarIconComponent,
    JsonPipe,
    MatIconModule,
    ClipboardModule,
  ],
})
export class ProfilePageComponent {
  public currentUser$: Observable<User>;
  constructor(
    private snackBar: MatSnackBar,
    private userService: UserService,
    private translateService: TranslateService
  ) {
    this.currentUser$ = this.userService.currentUser$;
  }
  onCopySuccess(): void {
    this.snackBar.open(
      this.translateService.instant('pages.profile_page.snackbar.copy_user_id'),
      undefined,
      {
        duration: 5000,
      }
    );
  }
  logout(): void {
    this.userService.logout();
  }
}
