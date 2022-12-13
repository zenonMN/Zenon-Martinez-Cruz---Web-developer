# Binance API

Recopilación de métodos para realizar las transacciones básicas con la Api de Binance.

## Métodos

- [getAccountInformation()]() - Retorna el balance y las transacciones permitidas para la billetera.
- [requestQuoteSwap(quoteQty)]() - Solicita una cotización para el  intercambio del activo de cotización (activo de venta) para el activo base (activo de compra).
- [swapETHUSDT(quoteQty)]() - Cambia quoteAsset por baseAsset.
- [withdrawCryptocurrency()]() - Envía una solicitud de retiro.

## Rétiros

La cantidad mínima de Ethereum que se puede retirar, sobre la red de Ethereum (ERC20), es de 0.01 ETH. La tárifa por retiro en la red de Ethereum (ERC20) es de 0.0016 ETH. 

## BSwap

La cantidad mínima para convertir ETH a USDT es de 0.00025 ETH, y con un límite de 10 ETH. La tarfica por conversión, actualmente es de 0.000005 ETH. Para más información ir a [Binance Swap](https://www.binance.com/en/swap).



## Installation

Instalar la dependencia [@binance/connector](https://www.npmjs.com/package/@binance/connector)

```sh
npm i @binance/connector
```