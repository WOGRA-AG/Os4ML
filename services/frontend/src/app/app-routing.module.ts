import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DatabagsPageComponent} from './pages/databags-page/databags-page.component';
import {DashboardPageComponent} from './pages/dashboard-page/dashboard-page.component';
import {SettingsPageComponent} from './pages/settings-page/settings-page.component';
import {UserPageComponent} from './pages/user-page/user-page.component';
import {PageNotFoundPageComponent} from './pages/page-not-found-page/page-not-found-page.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardPageComponent,
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'databag',
    component: DatabagsPageComponent,
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
    component: PageNotFoundPageComponent
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
