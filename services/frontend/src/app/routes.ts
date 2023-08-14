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
            './components/pages/solutions-page/solutions-page.component'
          ).then(mod => mod.SolutionsPageComponent),
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
      import(
        './components/pages/databags-page/databags-page.component'
      ).then(mod => mod.DatabagsPageComponent),
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'predictions',
    loadComponent: () =>
      import(
        './components/pages/predictions-page/predictions-page.component'
      ).then(mod => mod.PredictionsPageComponent),
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'typo',
    loadComponent: () =>
      import(
        './components/pages/typography-demo-page/typography-demo-page.component'
      ).then(mod => mod.TypographyDemoPageComponent),
  },
  {
    path: '**',
    loadComponent: () =>
      import(
        './components/pages/not-found-page/not-found-page.component'
      ).then(mod => mod.NotFoundPageComponent),
  },
];
