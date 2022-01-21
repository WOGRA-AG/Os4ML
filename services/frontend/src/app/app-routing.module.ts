import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UploadComponent} from "./pages/upload/upload.component";
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
    component: UploadComponent,
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
