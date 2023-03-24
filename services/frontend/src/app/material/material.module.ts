import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import {
  MatFormFieldModule,
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
} from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';

export const MATERIAL_MODULES: (typeof MatInputModule)[] = [
  MatButtonModule,
  MatToolbarModule,
  MatSnackBarModule,
  MatSidenavModule,
  MatListModule,
  MatIconModule,
  MatExpansionModule,
  MatDialogModule,
  MatInputModule,
  MatFormFieldModule,
  MatProgressBarModule,
  MatSelectModule,
  MatOptionModule,
  MatProgressSpinnerModule,
  MatSlideToggleModule,
  MatChipsModule,
  MatTableModule,
  MatSortModule,
  MatPaginatorModule,
  MatStepperModule,
  MatTooltipModule,
];

@NgModule({
  declarations: [],
  imports: [CommonModule, ...MATERIAL_MODULES],
  exports: [...MATERIAL_MODULES],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
  ],
})
export class MaterialModule {}
