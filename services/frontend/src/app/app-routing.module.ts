import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'solutions',
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            './templates/pages/solutions-page/solutions-page.component'
          ).then(mod => mod.SolutionsPageComponent),
      },
      {
        path: ':solutionId/predictions',
        loadComponent: () =>
          import(
            './templates/pages/predictions-page/predictions-page.component'
          ).then(mod => mod.PredictionsPageComponent),
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
    loadComponent: () =>
      import('./templates/pages/databags-page/databags-page.component').then(
        mod => mod.DatabagsPageComponent
      ),
    runGuardsAndResolvers: 'always',
  },
  {
    path: '**',
    loadComponent: () =>
      import('./templates/pages/not-found-page/not-found-page.component').then(
        mod => mod.NotFoundPageComponent
      ),
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
