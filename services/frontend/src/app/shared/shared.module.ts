import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormatNumberPipe } from './pipes/format-number.pipe';
import { LocalizedDatePipe } from './pipes/localized-date.pipe';
import { ShortStatusPipe } from './pipes/short-status.pipe';
import { MaterialModule } from '../material/material.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HasElementsPipe } from './pipes/has-elements.pipe';
import { AddButtonComponent } from './components/atoms/add-button/add-button.component';
import { CloseButtonComponent } from './components/atoms/close-button/close-button.component';
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
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { StatusSpinnerComponent } from './components/molecules/status-spinner/status-spinner.component';
import { SelectableListComponent } from './components/organisms/selectable-list/selectable-list.component';
import { ListItemComponent } from './components/molecules/list-item/list-item.component';
import { PopupConfirmComponent } from './components/organisms/popup-confirm/popup-confirm.component';
import { FormatTimeDiffPipe } from './pipes/format-time-diff';
import { BreadcrumbsComponent } from './components/molecules/breadcrumbs/breadcrumbs.component';
import { DatasetUploadComponent } from './components/organisms/dataset-upload/dataset-upload.component';
import { PlaceholderComponent } from './components/molecules/placeholder/placeholder.component';

export const httpLoaderFactory = (http: HttpClient): TranslateHttpLoader =>
  new TranslateHttpLoader(http, './assets/i18n/', '.json');

@NgModule({
  declarations: [
    // atoms
    AddButtonComponent,
    CloseButtonComponent,
    ElementDividerComponent,
    StarComponent,
    // molecules
    DialogHeaderComponent,
    DialogSectionComponent,
    StarRatingComponent,
    ToggleItemComponent,
    UploadFieldComponent,
    StatusSpinnerComponent,
    ListItemComponent,
    BreadcrumbsComponent,
    PlaceholderComponent,
    // organisms
    PopupConfirmComponent,
    SelectableListComponent,
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
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  exports: [
    // atoms
    AddButtonComponent,
    CloseButtonComponent,
    ElementDividerComponent,
    StarComponent,
    ListItemComponent,
    // molecules
    DialogHeaderComponent,
    DialogSectionComponent,
    StarRatingComponent,
    ToggleItemComponent,
    UploadFieldComponent,
    StatusSpinnerComponent,
    BreadcrumbsComponent,
    PlaceholderComponent,
    // organisms
    SelectableListComponent,
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
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  providers: [ShortStatusPipe],
})
export class SharedModule {}
