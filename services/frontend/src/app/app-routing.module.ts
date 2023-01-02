import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardPageComponent} from './pages/dashboard-page/dashboard-page.component';
import {SettingsPageComponent} from './pages/settings-page/settings-page.component';
import {UserPageComponent} from './pages/user-page/user-page.component';
import {DatabagTemplateComponent} from './templates/databag-template/databag-template.component';
import {NotFoundTemplateComponent} from './templates/not-found-template/not-found-template.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardPageComponent,
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'databag',
    component: DatabagTemplateComponent,
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'settings',
    component: SettingsPageComponent,
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'user',
    component: UserPageComponent,
    runGuardsAndResolvers: 'always'
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: NotFoundTemplateComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
