const { Spot } = require('@binance/connector');
const config = require('./config.json');
const client = new Spot(config.prod.aKey, config.prod.sKey, { baseURL: config.prod.baseurl});
const { default: axios } = require("axios");

function testCloudFunction() {
    return new Promise((resolve, reject) => {
        axios.get(`${config.prod.cloudFunction}`).then((res) => {
            console.log("Response: ", res.data);
            resolve(rewardResponse);
        }).catch(error => {
            console.log("Error: ", error.response.data);
            reject(error.response.data);
        });
    });
}

function getWithdrawMin(coin) {
    return new Promise((resolve, reject) => {
        client.coinInfo({recvWindow: 10000}).then((response) => {
            let withdrawMin;
            if(response.data.length > 0)
                withdrawMin = response.data.find(x => x.coin === coin);

            if(withdrawMin) {
             let network = withdrawMin.networkList.find(x => x.isDefault);
             if(network)
                resolve(network.withdrawMin);
            }
            else 
                reject({code: 000, msg: "Coin not available"});
        }).catch((error) => {
            console.log(error);
            if(error.response)
            reject(error.response.data);
            else 
            reject({code: 000, msg: "Error data not available"});
        });
    });
}

//Retorna todas las monedas

function returnCoins(coins) {
    let coinsArray = [];
    return new Promise((resolve, reject) => {
        client.coinInfo({recvWindow: 10000}).then((response) => {
            // console.log("Coin info: ", response.data);
            if(response.data.length > 0) {
                response.data.forEach((coin) => {
                    let coinData = {};
                    if(coins.includes(coin.coin)) {
                        // console.log("Coin info: ", coin);
                        coinData = {
                            coin: coin.coin, 
                            name: coin.name,
                            balance: coin.free
                        };

                        let network = coin.networkList.find(x => x.isDefault);
                        if(network){
                            Object.assign(coinData,{
                                network: network.network,
                                networkDescription: network.name,
                                addressRegex: network.addressRegex,
                                withdrawFee: network.withdrawFee,
                                withdrawMin: network.withdrawMin,
                                withdrawMax: network.withdrawMax 
                            });
                        }
                        coinsArray.push(coinData);
                    }
                });
                
            }
            resolve(coinsArray);
        }).catch((error) => {
            reject(error.response.data);
        });
    });
}

/**
 * Todos los métodos retornan una promesa
 */

//Return return a promise
function getAccountInformation() {
    return new Promise((resolve, reject) => {
        client.account({ recvWindow: 10000 }).then(((response) => {
            resolve(response.data);
        })).catch((error) => {
            reject(error.response.data);
        });
    }); 
}

/**
 * Solicita una cotización para el  intercambio del activo de cotización (activo de venta) para el activo base (activo de compra)
 * 
 * baseAsset = USDT
 * quoteAsset = ETH
 * @param {number} quoteQty 
 * return a promise
 * Example
 * {
    "quoteAsset": "USDT",
    "baseAsset": "BUSD",
    "quoteQty": 300000,
    "baseQty": 299975,
    "price": 1.00008334,
    "slippage": 0.00007245,
    "fee": 120
    }
 */
function requestQuoteSwap(quoteQty) {
    return new Promise((resolve, reject) => {
        client.bswapRequestQuote(config.swap.quoteAsset, config.swap.baseAsset, quoteQty, {recvWindow: 20000, timestamp: Date.now()})
        .then((response) => resolve(response.data))
        .catch((error) => reject(error.response.data));
    });
}

/**
 * Cambia quoteAsset por baseAsset.
 * 
 * baseAsset = USDT
 * quoteAsset = ETH
 * @param {number} quoteQty 
 * @returns promise
 */
function swapETHUSDT(quoteQty) {
    return new Promise((resolve, reject) => {
        client.bswapSwap(config.swap.quoteAsset, config.swap.baseAsset, quoteQty, {recvWindow: 20000, timestamp: Date.now()})
        .then((response) => resolve(response.data))
        .catch((error) => reject(error.response.data));
    });
}

/**
 * 
 * @param {string} swapId 
 * @returns promise
 */
function swapHistory(swapId) {
    return new Promise((resolve, reject) => {
        client.bswapSwapHistory({swapId: swapId}).then((response) => resolve(response.data)).catch((error) => reject(error.response.data));
    });
}

/**
 *  @param {string} from
 *  @param {string} to
 *  @param {number} amount
 *  @return promise
 */
 function convertCurrencies(from, to, amount) {
    return new Promise((resolve, reject) => {
        client.newOrder(from+to, 'SELL', "MARKET", {quantity: amount, recvWindow: 20000, timestamp: Date.now()}).then((response) => resolve(response.data)).catch((error) => reject(error.response.data));
    });
 }

/**
 * Envía una solicitud de retiro
 * 
 * network = ETH - Ethereum (ERC20)
 * walletType = 0 - spot wallet
 * @param {string} address
 * @param {number} amount
 * @returns promise
 */
function withdrawCryptocurrency(address, amount) {
    return new Promise((resolve, reject) => {
        client.withdraw ("ETH", address, amount, {recvWindow: 20000, timestamp: Date.now()})
        .then((response) => resolve(response.data))
        .catch((error) => reject(error.response.data));
    });
}

/**
 * Retorna el los detalles de una transacción
 * @param {string} withdrawOrderId
 * @returns promise
 */
function withdrawHistory(withdrawOrderId) {
    return new Promise((resolve, reject) => {
        client.withdrawHistory({recvWindow: 20000, timestamp: Date.now()})
        .then((response) => {
            let withdraw = response.data.find(x => x.id === withdrawOrderId);
            resolve(withdraw);
        })
        .catch((error) => reject(error.response.data));
    });
}

function latestPrice(coin) {
    return new Promise((resolve, reject) => {
        client.tickerPrice(coin)
        .then((response) => {
            resolve(response.data["price"]);
        })
        .catch((error) => reject(error.response.data));
    });
}

function CurrentAveragePrice(coin) {
    return new Promise((resolve, reject) => {
        client.avgPrice(coin)
        .then((response) => {
            resolve(response.data["price"]);
        })
        .catch((error) => reject(error.response.data));
    });
}

module.exports = {
    getAccountInformation: getAccountInformation,
    requestQuoteSwap: requestQuoteSwap,
    swapETHUSDT: swapETHUSDT,
    convertCurrencies: convertCurrencies,
    withdrawCryptocurrency: withdrawCryptocurrency,
    swapHistory: swapHistory,
    withdrawHistory: withdrawHistory,
    returnCoins:returnCoins,
    getWithdrawMin: getWithdrawMin,
    latestPrice:latestPrice,
    CurrentAveragePrice: CurrentAveragePrice,
    testCloudFunction: testCloudFunction
};