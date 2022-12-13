const { default: axios } = require("axios");
const config = require('./config.json');
const HOUR = 3600;
const DAY = 24;
const WEEK = 7;
const MONTH = 30;
const YEAR = 365;


/**
 * @param {string} coin
 * @param {number} gpuHashrate  Hashes
 * @param {number} power  Watts
 * @param {number} electricityCosts  USD
 * @param {number} poolFee 0 - 1
 * @returns {object} rewards
 */
function calculateReward(coin, gpuHashrate, power, electricityCosts, poolFee = 0.1) {
    return new Promise((resolve, reject) => {
        Promise.all([axios.get(`${config.endPoint.coin}?list=${coin}`), axios.get(`${config.endPoint.binancePrice}?symbol=${coin}USDT`)])
        .then((res) => {
            let binancePrice = +res[1].data.price;
            let {reward_block, difficulty} = res[0].data[0];
            let reward = ((gpuHashrate * reward_block)/difficulty)*(1-poolFee)*HOUR;
            let rewardResponse = {
                rewardsInHour: reward,
                rewardsInDay: reward*DAY,
                rewardsInWeek: reward*DAY*WEEK,
                rewardsInMonth: reward*DAY*MONTH,
                rewardsInYear: reward*DAY*YEAR
            };

            Object.assign(rewardResponse, {
                rewardsInHourUSD: rewardResponse.rewardsInHour * binancePrice,
                rewardsInDayUSD: rewardResponse.rewardsInDay * binancePrice,
                rewardsInWeekUSD: rewardResponse.rewardsInWeek * binancePrice,
                rewardsInMonthUSD: rewardResponse.rewardsInMonth * binancePrice,
                rewardsInYearUSD: rewardResponse.rewardsInYear * binancePrice
            });
            let profitInHourUSD =  rewardResponse.rewardsInHourUSD - (power/1000)*electricityCosts;
            Object.assign(rewardResponse, {
                profitInHourUSD: profitInHourUSD,
                profitInDayUSD: profitInHourUSD*DAY,
                profitInWeekUSD: profitInHourUSD*DAY*WEEK,
                profitInMonthUSD: profitInHourUSD*DAY*MONTH,
                profitInYearUSD: profitInHourUSD*DAY*YEAR
            });
            resolve(rewardResponse);
        }).catch(error => reject(error.response.data));
    });
}

/**
 * @param {number} price
 * @param {number} profitInYearUSD 
 * @returns {Object} roi
 */
function calculateROI(price, profitInYearUSD) {
    let roi = price/profitInYearUSD
    return {
        years: Math.trunc(roi),
        months: Math.trunc((roi - Math.trunc(roi)) * 12)
    };
}


module.exports = {
    calculateReward: calculateReward,
    calculateROI: calculateROI
};