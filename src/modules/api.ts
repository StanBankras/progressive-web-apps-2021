import fetch from 'node-fetch';
import CryptoCurrency from '../models/CryptoCurrency';

const cpBaseUrl = 'https://api.coinpaprika.com/v1';
let coins: CryptoCurrency[] = [];
let rateLimitPromise = Promise.resolve();

// Rate limit of 100ms, implementation idea by Alex Bankras
export async function cpData(url: string, params?: any): Promise<any> {
  return new Promise((resolve, reject) => {
    rateLimitPromise = rateLimitPromise.then(async () => {
      try {
        let string = cpBaseUrl + url;

        if(params) {
          string += '?';
          Object.keys(params).forEach((param: any, i) => {
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

export async function getAllCoins(): Promise<CryptoCurrency[]> {
  const data: any = await cpData('/coins');
  return data.map((d: any) => new CryptoCurrency(d.id, d.symbol, d.name, d.rank));
}

export async function getCoinByRank(rank: number): Promise<CryptoCurrency | undefined> {
  if (coins.length === 0) await getAllCoins();
  return coins.find(c => c.rank === rank);
}

export async function initializeData(): Promise<CryptoCurrency[]> {
  const coins: any = await getAllCoins();
  return coins.filter((c: CryptoCurrency) => c.rank !== 0 && c.rank <= 20);
}