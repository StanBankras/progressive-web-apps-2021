import fetch from 'node-fetch';
import CryptoCurrency from '../models/CryptoCurrency';

const cpBaseUrl = 'https://api.coinpaprika.com/v1';
let coins = [];
let rateLimitPromise = Promise.resolve();

// Rate limit of 100ms, implementation idea by Alex Bankras
export async function cpData(url, params) {
  return new Promise((resolve, reject) => {
    rateLimitPromise = rateLimitPromise.then(async () => {
      try {
        let string = cpBaseUrl + url;

        if(params) {
          string += '?';
          Object.keys(params).forEach((param, i) => {
            string += `${i > 0 ? '&' : ''}${param}=${params[param]}`;
          });
        }

        const res = await fetch(string);
        const result = await res.json();
        setTimeout(() => resolve(result), 100);
      } catch(err) {
        reject(err);
      }
    });
  });

}

export async function getAllCoins() {
  return await cpData('/coins');
}

export async function getCoinByRank(rank) {
  if(coins.length === 0) await getAllCoins();
  return coins.find(c => c.rank === rank);
}

export async function initializeData() {
  const coins = await getAllCoins();
  return coins
    .map(c => new CryptoCurrency(c.id, c.symbol, c.name, c.rank))
    .filter(c => c.rank !== 0);
}