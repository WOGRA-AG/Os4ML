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
      {
        path: 'detail/:id',
        loadComponent: () =>
          import(
            './components/pages/solution-detail-page/solution-detail-page.component'
          ).then(mod => mod.SolutionDetailPageComponent),
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
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            './components/pages/databags-page/databags-page.component'
          ).then(mod => mod.DatabagsPageComponent),
      },
      {
        path: 'detail/:id',
        loadComponent: () =>
          import(
            './components/pages/databag-detail-page/databag-detail-page.component'
          ).then(mod => mod.DatabagDetailPageComponent),
      },
    ],
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
    path: 'transfer-learning',
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            './components/pages/transfer-learning-page/transfer-learning-page.component'
          ).then(mod => mod.TransferLearningPageComponent),
      },
      {
        path: 'detail/:id',
        loadComponent: () =>
          import(
            './components/pages/transfer-learning-detail-page/transfer-learning-detail-page.component'
          ).then(mod => mod.TransferLearningDetailPageComponent),
      },
    ],
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
      import('./components/pages/not-found-page/not-found-page.component').then(
        mod => mod.NotFoundPageComponent
      ),
  },
];
