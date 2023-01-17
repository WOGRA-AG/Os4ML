import { NgModule } from '@angular/core';
import { DatabagsModule } from '../databags/databags.module';
import { SolutionsModule } from '../solutions/solutions.module';
import { GettingStartedStepperComponent } from './getting-started-stepper/getting-started-stepper.component';
import { SupportComponent } from './support/support.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material/material.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { httpLoaderFactory, SharedModule } from '../shared/shared.module';
import { HttpClient } from '@angular/common/http';



@NgModule({
  declarations: [
    GettingStartedStepperComponent,
    SupportComponent,
    NavBarComponent,
  ],
  imports: [
    DatabagsModule,
    SolutionsModule,
    RouterModule,
    MaterialModule,
    TranslateModule.forRoot({
    loader: {
      provide: TranslateLoader,
      useFactory: httpLoaderFactory,
      deps: [HttpClient]
      }
    }),
    SharedModule
  ],
  exports: [
    NavBarComponent,
  ]
})
export class NavModule { }
