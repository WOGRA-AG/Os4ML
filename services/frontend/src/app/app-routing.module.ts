import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SolutionsPageComponent } from './templates/pages/solutions-page/solutions-page.component';
import { DatabagsPageComponent } from './templates/pages/databags-page/databags-page.component';
import { NotFoundPageComponent } from './templates/pages/not-found-page/not-found-page.component';
import { PredictionsPageComponent } from './templates/pages/predictions-page/predictions-page.component';

const routes: Routes = [
  {
    path: 'solutions',
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: '',
        component: SolutionsPageComponent,
      },
      {
        path: ':solutionId/predictions',
        component: PredictionsPageComponent,
      },
    ],
  },
  {
    path: '',
    redirectTo: '/solutions',
    pathMatch: 'full',
  },
  {
    path: 'databags',
    component: DatabagsPageComponent,
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
      useHash: true,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
