import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LoaderSpinningPlanetComponent } from '../../molecules/loader-spinning-planet/loader-spinning-planet.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DocumentationHintTextComponent } from '../../molecules/documentation-hint-text/documentation-hint-text.component';
import { NewButtonComponent } from '../../molecules/new-button/new-button.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-uploading-files',
  templateUrl: './uploading-files.component.html',
  styleUrls: ['./uploading-files.component.scss'],
  standalone: true,
  imports: [
    LoaderSpinningPlanetComponent,
    MatProgressBarModule,
    DocumentationHintTextComponent,
    NewButtonComponent,
    TranslateModule,
    NgIf,
  ],
})
export class UploadingFilesComponent {
  @Input() public fileName = '';
  @Input() public progress = 0;
  @Input() public uploadDone = false;
  @Output() public finishUpload = new EventEmitter<void>();
  @Output() public cancelUpload = new EventEmitter<void>();
}
