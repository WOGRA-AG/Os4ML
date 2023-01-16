import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormatNumberPipe} from './pipes/format-number.pipe';
import {LocalizedDatePipe} from './pipes/localized-date.pipe';
import {ShortStatusPipe} from './pipes/short-status.pipe';
import {MaterialModule} from '../material/material.module';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HasElementsPipe} from './pipes/has-elements.pipe';
import {AddButtonComponent} from './components/atoms/add-button/add-button.component';
import {CloseButtonComponent} from './components/atoms/close-button/close-button.component';
import {ElementDividerComponent} from './components/atoms/element-divider/element-divider.component';
import {StarComponent} from './components/atoms/star/star.component';
import {DialogHeaderComponent} from './components/molecules/dialog-header/dialog-header.component';
import {DialogSectionComponent} from './components/molecules/dialog-section/dialog-section.component';
import {StarRatingComponent} from './components/molecules/star-rating/star-rating.component';
import {ToggleItemComponent} from './components/molecules/toggle-item/toggle-item.component';
import {UploadFieldComponent} from './components/molecules/upload-field/upload-field.component';
import {PopupDeleteComponent} from './components/organisms/popup-delete/popup-delete.component';
import {DragAndDropDirective} from './directives/drag-and-drop.directive';
import {MatTooltipModule} from '@angular/material/tooltip';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DialogDynamicComponent} from './components/dialog/dialog-dynamic/dialog-dynamic.component';
import {ListItemComponent} from './components/atoms/list-item/list-item.component';
import {RouterModule} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { StatusSpinnerComponent } from './components/molecules/status-spinner/status-spinner.component';

export const httpLoaderFactory = (http: HttpClient) => new TranslateHttpLoader(http, './assets/i18n/', '.json');

@NgModule({
  declarations: [
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
    // organisms
    PopupDeleteComponent,
    //dialogs
    DialogDynamicComponent,
    // directives
    DragAndDropDirective,
    // pipes
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
        deps: [HttpClient]
      }
    }),
    MatTooltipModule,
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
        // organisms
        PopupDeleteComponent,
        // directives
        DragAndDropDirective,
        // pipes
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
    ],
  providers: [
    ShortStatusPipe
  ]
})
export class SharedModule {
}
