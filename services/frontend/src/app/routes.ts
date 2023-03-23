import { Routes } from '@angular/router';

export const ROUTES: Routes = [
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
