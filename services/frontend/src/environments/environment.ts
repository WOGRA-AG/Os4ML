// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
};
export const databagsWebsocketPath = '/apis/v1beta1/model-manager/databags';
export const solutionWebsocketPath = '/apis/v1beta1/model-manager/solutions';
export const predictionsWebsocketPath =
  '/apis/v1beta1/model-manager/predictions';
export const transferLearningWebsocketPath =
  '/apis/v1beta1/model-manager/transfer-learning-models';

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
