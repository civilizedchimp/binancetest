import { CACHE_MODULE_OPTIONS, Injectable } from '@nestjs/common';
import * as request from 'request';
import * as crypto from 'crypto';
import { SellOrderDto } from './dto/sell-order.dto';
import { BuyOrderDto } from './dto/buy-order.dto';
import { EmailService } from './email/email.service';
import { clearConfigCache } from 'prettier';
const Binance = require('node-binance-api');
const BinanceExt = require('node-binance-api-ext');

@Injectable()
export class AppService {
    arr1 = [];
    arr2 = [];
    placedOrders = [];
    constructor(private readonly emailService: EmailService) { }

    binance = new Binance().options({
        APIKEY: 'VmkYulGvWiHgzyTxrqcq9hZ9ms90YsLHBO0tGv7tLrn61HV2DglvwDpdHQOcIjK2',
        APISECRET: 'znXOu9u8glb1wBrmFeOnLk4QBmwbxSrOmWc8SX1ZkVwi0hm2o9sxZxJ9xx8aqTlf'
    });
    binanceext = new BinanceExt({
        APIKEY: 'VmkYulGvWiHgzyTxrqcq9hZ9ms90YsLHBO0tGv7tLrn61HV2DglvwDpdHQOcIjK2',
        APISECRET: 'znXOu9u8glb1wBrmFeOnLk4QBmwbxSrOmWc8SX1ZkVwi0hm2o9sxZxJ9xx8aqTlf'
    });
    depth() {
        const $headers = {
            'Content-Type': 'application/json; charset=utf-8',
        };
        const options = {
            uri: 'https://api.binance.com/api/v1/depth',
            method: 'GET',
            qs: {
                symbol: 'BTCUSDT',
                limit: 3
            },
            headers: $headers,
        };
        return new Promise((resolve, reject) => {
            request(options, (error, response, body) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(JSON.parse(body));
                }
            });
        });
    }

    trades() {
        const $headers = {
            'Content-Type': 'application/json; charset=utf-8',
        };
        const options = {
            uri: 'https://api.binance.com/api/v1/trades',
            method: 'GET',
            qs: {
                symbol: 'BTCUSDT',
                limit: 3
            },
            headers: $headers,
        };
        return new Promise((resolve, reject) => {
            request(options, (error, response, body) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(JSON.parse(body));
                }
            });
        });
    }

    klines() {
        const $headers = {
            'Content-Type': 'application/json; charset=utf-8',
        };
        const options = {
            uri: 'https://api.binance.com/api/v1/klines',
            method: 'GET',
            qs: {
                symbol: 'BTCUSDT',
                interval: '15m',
                limit: 3
            },
            headers: $headers,
        };
        return new Promise((resolve, reject) => {
            request(options, (error, response, body) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(JSON.parse(body));
                }
            });
        });
    }

    tickerPriceStatistics() {
        const $headers = {
            'Content-Type': 'application/json; charset=utf-8',
        };
        const options = {
            uri: 'https://api.binance.com/api/v1/ticker/24hr',
            method: 'GET',
            qs: {
                symbol: 'BTCUSDT'
            },
            headers: $headers,
        };
        return new Promise((resolve, reject) => {
            request(options, (error, response, body) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(JSON.parse(body));
                }
            });
        });
    }

    //SIGNED APIs.....................

    account() {
        const $headers = {
            'Content-Type': 'application/json; charset=utf-8',
            'X-MBX-APIKEY': 'Gmg4rGFbaPlzNomMNwDbDsjUr9lm30DCUGzcxtcQhck2ymFrod2PfjJdVbSrS1N3'
        };

        const signature = crypto.createHmac('SHA256', '4QtHUWSNUExbYiFMJQbIvPReoH9vDybFZDcHTQe5mh8NrUohvsd9xlyOk8whsLeQ').update(`recvWindow=10000&timestamp=1499827319559`).digest('hex');

        const qs: any = {
            recvWindow: 10000,
            timestamp: Date.now(),
            signature
        };

        const options = {
            uri: 'https://api.binance.com/api/v3/account',
            method: 'GET',
            headers: $headers,
            qs
        };
        console.log({ options })
        return new Promise((resolve, reject) => {
            request(options, (error, response, body) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(JSON.parse(response));
                }
            });
        });
    }

    accountInfo() {
        return new Promise((resolve, reject) => {
            this.binance.mgAccount((error, response, body) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(response);
                }
            });
        });
    }

    klineData() {
        return new Promise((resolve, reject) => {
            this.binance.candlesticks("BNBBTC", "1m", (error, ticks, symbol) => {
                console.info("candlesticks()", ticks);
                let last_tick = ticks[ticks.length - 1];
                let [time, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored] = last_tick;
                console.info(symbol + " last close: " + close);
            }, { limit: 500, endTime: 1514764800000 });
        });
    }

    futureChartpattern() {
        return new Promise((resolve, reject) => {
            const ohlc = this.binance.futuresCandlesticks("ETHUSDT", "1m", (ticks) => {
                console.log('is 1 min completed? : ', ticks.k.x);
                if (ticks.k.x == true) {
                    if (ticks.k.c < ticks.k.o ||ticks.k.c > ticks.k.o ) {
                        console.log('after 1 min');
                        // const buyOrderDto = new BuyOrderDto();
                        // buyOrderDto.price = 1196.10;
                        // buyOrderDto.quantity = 0.014;
                        // const orderResponse = this.buyOrder(buyOrderDto);
                        // console.log('orderResponse', orderResponse)

                    //    const futurebuy = this.binance.futuresMarketBuy( 'ETHUSDT', 0.014 );
                   let orders = [
                    {
                symbol:"ETHUSDT",
                side: "SELL",
                type: "STOP_LOSS",
                price: "1250" ,
                   quantity: "0.014",
                 },
                         {
                         symbol:"BNBUSDT",
                         side: "SELL",
                         type: "TAKE_PROFIT",
                         price: "1270" ,
                         quantity: "0.5",
                         }
                       ]
                       const stopandtake = this.binance.futuresMultipleOrders(orders);
                       console.log('stopandtake')
                }
            }
        }, { limit: 500 })
        });
    }
    

    Bullishpattern() {
        return new Promise((resolve, reject) => {
            this.binance.websockets.candlesticks(['ETHUSDT'], "1m", (candlesticks) => {
                let { e: eventType, E: eventTime, s: symbol, k: ticks } = candlesticks;
                let { o: open, h: high, l: low, c: close, v: volume, n: trades, i: interval, x: isFinal, q: quoteVolume, V: buyVolume, Q: quoteBuyVolume } = ticks;
                console.log('perpetual', ticks)
                if (ticks.x == true) {
                    if (ticks.c < ticks.o && this.arr2.length == 0) {
                        this.arr2.push(ticks)

                        const buyOrderDto = new BuyOrderDto();
                        buyOrderDto.price = 1190;
                        buyOrderDto.quantity = 0.014;
                        this.buyOrder(buyOrderDto);

                        // const Binance = require('node-binance-api');

                        // const binance = new Binance();
                        // CACHE_MODULE_OPTIONS
                        // // Replace these values with your own
                        // const symbol = 'ETHUSDT';
                        // const quantity = buyOrderDto.quantity;
                        // const stopPrice = 1;  // 1%
                        // const takeProfitPrice = 2;  // 2%

                        // binance.stopLossTakeProfit(symbol, quantity, stopPrice, takeProfitPrice, { usePercentage: true }, (error, response) => {
                        //     if (error) {
                        //         console.error(error);
                        //     } else {
                        //         console.log(response);
                        //     }
                        // });

                    }
                    if (this.arr2.length == 1 && ticks.c < this.arr2[0].c) {
                        this.arr2.shift();
                        this.arr2.push(ticks);
                    }
                    else if (this.arr2.length == 1 && ticks.c > this.arr2[0].o && ticks.h > this.arr2[0].h) {
                        console.log("engulfing pattern")
                        this.arr2.push(ticks);
                    }
                    else if (this.arr2.length == 1 && ticks.c >= this.arr2[0].o && ticks.h <= this.arr2[0].h) {
                        this.arr2.shift();
                    }
                    else if (this.arr2.length == 1 && ticks.c > ticks.o && ticks.c < this.arr2[0].o) {
                        this.arr2.shift();
                    }
                    else if (this.arr2.length == 1 && this.arr2[0].c <= this.arr2[1].c) {
                        this.arr2.shift();
                    }
                    else if (this.arr2.length == 1 && ticks.c == ticks.o) {
                        this.arr2.shift();
                    }
                    if (this.arr2.length == 2 && ticks.c > this.arr2[1].c && ticks.h > this.arr2[1].h) {
                        console.log("engulfing pattern with confirmation")
                        this.arr2.push(ticks);
                        console.log(this.arr2);

                        const buyOrderDto = new BuyOrderDto();
                        buyOrderDto.price = 1170;
                        buyOrderDto.quantity = 0.014;
                        this.buyOrder(buyOrderDto);
                    }
                    else if (this.arr2.length == 2 && ticks.c > this.arr2[1].c && ticks.h < this.arr2[1].h) {
                        this.arr2.pop();
                        this.arr2.shift();
                    }
                    else if (this.arr2.length == 2 && ticks.c < this.arr2[1].c) {
                        this.arr2.pop();
                        this.arr2.shift();
                        this.arr2.push(ticks);
                    }
                    else if (this.arr2.length == 2 && ticks.c == ticks.o && ticks.c == this.arr2[1].c) {
                        this.arr2.pop();
                        this.arr2.shift();
                    }
                }
            });
        });
    }

    Bearishpattern() {
        return new Promise((resolve, reject) => {
            this.binance.websockets.candlesticks(['ETHUSDT'], "1m", (candlesticks) => {
                let { e: eventType, E: eventTime, s: symbol, k: ticks } = candlesticks;
                let { o: open, h: high, l: low, c: close, v: volume, n: trades, i: interval, x: isFinal, q: quoteVolume, V: buyVolume, Q: quoteBuyVolume } = ticks;

                if (ticks.x == true) {
                    if (ticks.c > ticks.o && this.arr1.length == 0) {
                        this.arr1.push(ticks)
                    }
                    if (this.arr1.length == 1 && ticks.c > this.arr1[0].c) {
                        this.arr1.shift();
                        this.arr1.push(ticks);
                    }
                    else if (this.arr1.length == 1 && ticks.c < this.arr1[0].o && ticks.l < this.arr1[0].l) {
                        console.log("bearish engulfing pattern")
                        this.arr1.push(ticks);

                        const sellOrderDto = new SellOrderDto();
                        sellOrderDto.price = 11000;
                        sellOrderDto.quantity = 0.030;
                        this.sellOrder(sellOrderDto).then(res => { })
                    }

                    else if (this.arr1.length == 1 && ticks.c <= this.arr1[0].o && ticks.l >= this.arr1[0].l) {
                        this.arr1.shift();
                    }
                    else if (this.arr1.length == 1 && ticks.c < ticks.o && ticks.c > this.arr1[0].o) {
                        this.arr1.shift();
                    }
                    else if (this.arr1.length == 1 && this.arr1[0].c <= this.arr1[1].c) {
                        this.arr1.shift();
                    }
                    else if (this.arr1.length == 1 && ticks.c == ticks.o) {
                        this.arr1.shift();
                    }

                    if (this.arr1.length == 2 && ticks.c < this.arr1[1].c && ticks.l < this.arr1[1].l) {
                        this.arr1.push(ticks);
                    }
                    else if (this.arr1.length == 2 && ticks.c < this.arr1[1].c && ticks.l > this.arr1[1].l) {
                        this.arr1.pop();
                        this.arr1.shift();
                    }
                    else if (this.arr1.length == 2 && ticks.c > this.arr1[1].c) {
                        this.arr1.pop();
                        this.arr1.shift();
                        this.arr1.push(ticks);
                    }
                    else if (this.arr1.length == 2 && ticks.c == ticks.o || this.arr1[2].c == this.arr1[1].c) {
                        this.arr1.pop();
                        this.arr1.shift();
                    }
                }
            });
        });
    }


    openOrders() {
        return new Promise((resolve, reject) => {
            this.binance.futuresOpenOrders().then(result => {
                console.log('futuresOpenOrders', result)
                resolve(result);
            }).catch(error => {
                reject({ error })
            })
        });
    }

    buyOrder(buyOrderDto: BuyOrderDto) {
        console.log('Buy Order Api Triggered', buyOrderDto)
        try {
            return new Promise((resolve, reject) => {
                this.binance.futuresMarketBuy("ETHUSDT", buyOrderDto.quantity).then(result => {
                    console.log('Buy Order Response', result)
                    this.placedOrders.push(result)
                    this.arr2.pop();
                    this.arr2.shift();
                    console.log('Buy Order Placed Successfully')
                    console.log('placedOrders', this.placedOrders)
                    console.log('placedOrders length placedOrders length placedOrders length', this.placedOrders.length)
                    resolve(result);
                }).catch(error => {
                    reject({ error })
                })
            });
        }
        catch (e) {
            console.log('Buy Order Error:', e)
        }
    }

    cancelOrder() {
        return new Promise((resolve, reject) => {
            this.binance.cancel("BNBBTC", 1573696496).then(result => {
                resolve(result);
            }).catch(error => {
                reject({ error })
            })
        });
    }

    sellOrder(sellOrderDto: SellOrderDto) {
        console.log('Buy Order Api Triggered')
        try {
            let params = {
                symbol: 'BTCUSDT',
                quantity: sellOrderDto.quantity,
                price: sellOrderDto.price
            };
            return new Promise((resolve, reject) => {
                this.binance.sell(params, (error, response) => {
                    if (error) {
                        reject(error);
                    } else {
                        console.log('Sell Order Placed Succesfully')
                        resolve(response);
                    }
                });
            });
        }
        catch (e) {
            console.log('Sell Order Error:', e)
        }
    }

    marketBuyOrder(quantity: number) {
        let params = {
            symbol: 'BTCUSDT',
            quantity
        };
        return new Promise((resolve, reject) => {
            this.binance.marketBuy(params, (error, response) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(response);
                }
            });
        });
    }

    marketSellOrder(quantity: number) {
        let params = {
            symbol: 'BTCUSDT',
            quantity
        };
        return new Promise((resolve, reject) => {
            this.binance.marketSell(params, (error, response) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(response);
                }
            });
        });
    }

    depositHistory() {
        return new Promise((resolve, reject) => {
            this.binance.depositHistory((error, response, body) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(response);
                }
            });
        });
    }

    withdrawHistory() {
        return new Promise((resolve, reject) => {
            this.binance.withdrawHistory((error, response, body) => {
                //     if (error) {
                //         reject(error);
                //     } else {
                //         resolve(response);
                //     }
            });
        });
    }

    withdraw() {
        return new Promise((resolve, reject) => {
            //   const response =  this.binance.candlesticks("BNBBTC", "5m", (error, ticks, symbol) => {
            //         console.info("candlesticks()", ticks);
            //         let last_tick = ticks[ticks.length - 1];
            //         let [time, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored] = last_tick;
            //         console.info(symbol + " last close: " + close);
            //     }, { limit: 500, endTime: 1514764800000 });
            //     return response;
        })
    }

    sendMail(text: any) {
        return this.emailService.sendMail(text)
    }
}
