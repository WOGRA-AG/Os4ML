import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UploadPageComponent} from "./pages/upload-page/upload-page.component";
import {ReportPageComponent} from "./pages/report-page/report-page.component";
import {MainPageComponent} from "./pages/main-page/main-page.component";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    runGuardsAndResolvers: 'always',
    component: MainPageComponent,
  },
  {
    path: 'upload',
    component: UploadPageComponent,
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'report',
    component: ReportPageComponent,
    runGuardsAndResolvers: 'always',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
