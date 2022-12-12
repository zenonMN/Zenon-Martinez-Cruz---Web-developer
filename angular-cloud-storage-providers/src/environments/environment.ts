// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  credentials: {
    google: {
      api_key: "AIzaSyBUqjlhZAAptNgAFv5pBPLWtrb77wT6JoQ",
      client_secret: "pv4SyGln8wtXRBjwuSSrlRjJ",
      client_id: "328373111744-7ur7vphuqs81rakmbvtl1d1quho2puu8.apps.googleusercontent.com",
      redirect_uris: ["http://localhost:4200/privacy"],
      appId : "328373111744"
    },
    microsoft: {
      clientId: "216c003b-7ff7-4ed6-9981-1c73add7bb82",
      tenantId: "28f40336-c9da-4377-9084-a723fb05e12e",
      clientSecret: "74589865-0a08-467c-90ab-4d8d267d8d5a",
      redirectUri: "",
      scopes: [
        "user.read",
        "files.readwrite"
      ]
    },
    box: {
      clientId: "ohl4dllucignkquxj82mrsaun9xk7795",
      clientSecret: "eEHIFQHNFqpdWorjx9cruriqbyafCcJr",
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
