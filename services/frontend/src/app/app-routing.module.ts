import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DatabagPageComponent} from './pages/databag-page/databag-page.component';
import {MainPageComponent} from './pages/main-page/main-page.component';
import {SettingsPageComponent} from './pages/settings-page/settings-page.component';
import {UserPageComponent} from './pages/user-page/user-page.component';
import {PageNotFoundPageComponent} from './pages/page-not-found-page/page-not-found-page.component';
import {DatabagResolver} from './resolver/databag.resolver';
import {SolutionResolver} from './resolver/solution.resolver';

const routes: Routes = [
  {
    path: 'dashboard',
    component: MainPageComponent,
    runGuardsAndResolvers: 'always',
    resolve: {
      databags: DatabagResolver,
      solutions: SolutionResolver
    }
  },
  {
    path: 'databag',
    component: DatabagPageComponent,
    runGuardsAndResolvers: 'always',
    resolve: {
      databags: DatabagResolver
    }
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
