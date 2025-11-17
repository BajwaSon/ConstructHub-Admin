// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // baseUrl: "http://localhost:3000",
  // assetsUrl: "http://localhost:3000/uploads",
  // baseUrl: "https://school-panel-server.ssd.rcubinity.com",
  // assetsUrl: "https://school-panel-server.ssd.rcubinity.com/uploads",
  baseUrl: "https://demo.school-api.iras.live",
  assetsUrl: "https://demo.school-api.iras.live/uploads",
  routesUrl: "/api/web-panel/all-routes",
  cacheTimeLimit: 10, // this is in minutes
  debugMode: false,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
