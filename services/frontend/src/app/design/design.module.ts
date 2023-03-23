import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './components/atoms/button/button.component';
import { IconButtonComponent } from './components/atoms/icon-button/icon-button.component';
import { BreadcrumbsComponent } from './components/molecules/breadcrumbs/breadcrumbs.component';
import { ListItemComponent } from './components/molecules/list-item/list-item.component';
import { SelectableListComponent } from './components/organisms/selectable-list/selectable-list.component';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  declarations: [
    ButtonComponent,
    IconButtonComponent,
    BreadcrumbsComponent,
    ListItemComponent,
    SelectableListComponent,
  ],
  exports: [
    ButtonComponent,
    IconButtonComponent,
    BreadcrumbsComponent,
    ListItemComponent,
    SelectableListComponent,
  ],
})
export class DesignModule {}
