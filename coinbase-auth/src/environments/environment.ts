// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  //Coinbase Urls
  coinbase: {
    url: 'https://www.coinbase.com/oauth',
    client_id:
      'client_id',
    client_secret:
      'client_secret',
    scope: 'wallet:accounts:read,wallet:addresses:read,wallet:buys:read,wallet:buys:create,wallet:deposits:read,wallet:deposits:create,wallet:notifications:read,wallet:payment-methods:limits,wallet:payment-methods:read,wallet:sells:read,wallet:sells:create,wallet:transactions:read,wallet:user:read,wallet:user:email,wallet:withdrawals:read,wallet:withdrawals:create',
    token_url: 'https://api.coinbase.com/oauth/token/',
    api: 'https://api.coinbase.com'
  },
  criptos: {
    default: ["BTC", "LTC", "ETH", "BCH"]
    // default: {
    //   Bitcoin: "BTC",
    //   Litecoin: "LTC",
    //   Ethereum: "ETH",
    //   BitcoinCash: "BCH"
    // }
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
