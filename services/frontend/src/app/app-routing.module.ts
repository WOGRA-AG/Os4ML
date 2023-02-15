import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardPageComponent } from './templates/pages/dashboard-page/dashboard-page.component';
import { DatabagPageComponent } from './templates/pages/databag-page/databag-page.component';
import { NotFoundPageComponent } from './templates/pages/not-found-page/not-found-page.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardPageComponent,
    runGuardsAndResolvers: 'always',
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'databag',
    component: DatabagPageComponent,
    runGuardsAndResolvers: 'always',
  },
  {
    path: '**',
    component: NotFoundPageComponent,
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
