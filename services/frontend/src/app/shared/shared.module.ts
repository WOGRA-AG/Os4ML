import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormatNumberPipe } from './pipes/format-number.pipe';
import { LocalizedDatePipe } from './pipes/localized-date.pipe';
import { ShortStatusPipe } from './pipes/short-status.pipe';
import { MaterialModule } from '../material/material.module';
import { HasElementsPipe } from './pipes/has-elements.pipe';
import { ElementDividerComponent } from './components/atoms/element-divider/element-divider.component';
import { StarComponent } from './components/atoms/star/star.component';
import { DialogHeaderComponent } from './components/molecules/dialog-header/dialog-header.component';
import { DialogSectionComponent } from './components/molecules/dialog-section/dialog-section.component';
import { StarRatingComponent } from './components/molecules/star-rating/star-rating.component';
import { ToggleItemComponent } from './components/molecules/toggle-item/toggle-item.component';
import { UploadFieldComponent } from './components/molecules/upload-field/upload-field.component';
import { DragAndDropDirective } from './directives/drag-and-drop.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StatusSpinnerComponent } from './components/molecules/status-spinner/status-spinner.component';
import { PopupConfirmComponent } from './components/organisms/popup-confirm/popup-confirm.component';
import { FormatTimeDiffPipe } from './pipes/format-time-diff';
import { DatasetUploadComponent } from './components/organisms/dataset-upload/dataset-upload.component';
import { PlaceholderComponent } from './components/molecules/placeholder/placeholder.component';
import { TranslateModule } from '@ngx-translate/core';
import { DesignModule } from '../design/design.module';

@NgModule({
  declarations: [
    // atoms
    ElementDividerComponent,
    StarComponent,
    // molecules
    DialogHeaderComponent,
    DialogSectionComponent,
    StarRatingComponent,
    ToggleItemComponent,
    UploadFieldComponent,
    StatusSpinnerComponent,
    PlaceholderComponent,
    // organisms
    PopupConfirmComponent,
    DatasetUploadComponent,
    // directives
    DragAndDropDirective,
    // pipes
    FormatTimeDiffPipe,
    FormatNumberPipe,
    LocalizedDatePipe,
    ShortStatusPipe,
    HasElementsPipe,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    DesignModule,
  ],
  exports: [
    // atoms
    ElementDividerComponent,
    StarComponent,
    // molecules
    DialogHeaderComponent,
    DialogSectionComponent,
    StarRatingComponent,
    ToggleItemComponent,
    UploadFieldComponent,
    StatusSpinnerComponent,
    PlaceholderComponent,
    // organisms
    DatasetUploadComponent,
    // directives
    DragAndDropDirective,
    // pipes
    FormatTimeDiffPipe,
    FormatNumberPipe,
    LocalizedDatePipe,
    ShortStatusPipe,
    HasElementsPipe,
    // modules
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    DesignModule,
  ],
  providers: [ShortStatusPipe],
})
export class SharedModule {}
