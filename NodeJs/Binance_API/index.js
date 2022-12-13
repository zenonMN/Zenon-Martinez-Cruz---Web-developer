const {
  getAccountInformation,
  requestQuoteSwap,
  swapETHUSDT,
  convertCurrencies,
  withdrawCryptocurrency,
  swapHistory,
  withdrawHistory,
  returnCoins,
  getWithdrawMin,
  latestPrice,
  CurrentAveragePrice,
  testCloudFunction
} = require("./binance");
const bitsoAddress = "0xbc9ffb1787175a5db878f85b57558113f763a48e"; //ETH
const coinbaseAddress = "0xA920a521C9818811f51c7F4458EDE39a84259275"; //ETH
const COINS = ["ETH", "ETC", "CTXC", "ERG", "ZCL", "FIRO", "RVN", "CFX", "SERO", "VEIL"];
init();

function init() {
  console.log("================= testCloudFunction ==========");
  testCloudFunction();
  // latestPrice("ETHUSDT").then((withdrawMin) => {
  //   console.log("Response: ", withdrawMin);
  // }).catch(eeror => {
  //   console.log(eeror);
  // });

  // CurrentAveragePrice("ETHUSDT").then((withdrawMin) => {
  //   console.log("Response: ", withdrawMin);
  // }).catch(eeror => {
  //   console.log(eeror);
  // });


  //get coin min

  // getWithdrawMin("ZCL").then((withdrawMin) => {
  //   console.log("Response: ", withdrawMin);
  // }).catch(eeror => {
  //   console.log(eeror);
  // });
  
  //Get coin information
  // returnCoins(COINS).then((coins) => {
  //   console.log("Response: ", coins);
  // });
  
  //Market order
  // convertCurrencies("ETH", "USDT", 0.008)
  //   .then((data) => {
  //     console.log("Market order: ", data);
  //   })
  //   .catch((error) => console.log("Error: ", error));

  //1.- Get Account information
  // console.log("============== Account information ==========");
  // getAccountInformation()
  // .then(data => {
  //     console.log("Account information: ", data);
  // })
  // .catch(error => console.log("Error: ", error));

  // requestQuoteSwap(0.00025).then(data => {
  //     console.log("Quote swap: ", data);
  // }).catch(error => console.log("Error: ", error));

  // console.log("============== Swap ETH USDT ==========");
  // swapETHUSDT(0.00025).then(data => {
  //     console.log("Swap ETH USDT: ", data);
  // }).catch(error => {
  //     console.log("Error: ", error);
  // });

  // swapHistory(156150654).then(data => {
  //     console.log("Swap History: ", data);
  // }).catch(error => {
  //     console.log("Error: ", error);
  // });

  // console.log("============== Withdraw ==========");
  // withdrawCryptocurrency(coinbaseAddress, 0.01).then(data => {
  //     console.log("Withdraw: ", data);
  // }).catch(error => {
  //     console.log("Error: ", error);
  // });

  // console.log("============== Withdraw History ==========");

  // withdrawHistory("70ec4e5edcd04f76bf8968859b1e9ed5").then(data => {
  //     console.log("Withdraw history: ", data);
  // }).catch(error => {
  //     console.log("Error: ", error);
  // });
}
