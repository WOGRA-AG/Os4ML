import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatabagTemplateComponent } from './templates/databag-template/databag-template.component';
import { NotFoundTemplateComponent } from './templates/not-found-template/not-found-template.component';
import { DashboardTemplateComponent } from './templates/dashboard-template/dashboard-template.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardTemplateComponent,
    runGuardsAndResolvers: 'always',
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'databag',
    component: DatabagTemplateComponent,
    runGuardsAndResolvers: 'always',
  },
  {
    path: '**',
    component: NotFoundTemplateComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'reload',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
