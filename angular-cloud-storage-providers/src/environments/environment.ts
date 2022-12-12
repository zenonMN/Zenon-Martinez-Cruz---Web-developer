// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  credentials: {
    google: {
      api_key: "api_key",
      client_secret: "client_secret",
      client_id: "client_id",
      redirect_uris: ["http://localhost:4200/privacy"],
      appId : "appId"
    },
    microsoft: {
      clientId: "clientId",
      tenantId: "tenantId",
      clientSecret: "clientSecret",
      redirectUri: "",
      scopes: [
        "user.read",
        "files.readwrite"
      ]
    },
    box: {
      clientId: "clientId",
      clientSecret: "clientSecret",
      scopes: [
        "user.read",
        "files.readwrite"
      ]
    }
  }
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
