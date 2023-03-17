import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material/material.module';
import {
  ApiModule as ModelmanagerApi,
  Configuration as ModelmanagerApiConfig,
} from '../../build/openapi/modelmanager';
import { DatabagsModule } from './databags/databags.module';
import { SharedModule } from './shared/shared.module';
import { SolutionsModule } from './solutions/solutions.module';
import { CoreModule } from './core/core.module';
import { DatabagsPageComponent } from './templates/pages/databags-page/databags-page.component';
import { NotFoundPageComponent } from './templates/pages/not-found-page/not-found-page.component';
import { SolutionsPageComponent } from './templates/pages/solutions-page/solutions-page.component';
import { CreateDatabagStepperComponent } from './templates/dialogs/create-databag-stepper/create-databag-stepper.component';
import { CreateSolutionStepperComponent } from './templates/dialogs/create-solution-stepper/create-solution-stepper.component';
import { GettingStartedStepperComponent } from './templates/dialogs/getting-started-stepper/getting-started-stepper.component';
import { CreatePredictionStepperComponent } from './templates/dialogs/create-prediction-stepper/create-prediction-stepper.component';
import { PredictionsModule } from './predictions/predictions.module';

@NgModule({
  declarations: [
    AppComponent,
    // pages
    DatabagsPageComponent,
    SolutionsPageComponent,
    NotFoundPageComponent,
    // dialogs
    CreateDatabagStepperComponent,
    CreateSolutionStepperComponent,
    GettingStartedStepperComponent,
    CreatePredictionStepperComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ModelmanagerApi.forRoot(
      () =>
        new ModelmanagerApiConfig({
          basePath: '',
        })
    ),
    MaterialModule,
    DatabagsModule,
    SolutionsModule,
    SharedModule,
    CoreModule,
    PredictionsModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
