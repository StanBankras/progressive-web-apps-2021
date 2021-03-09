import fetch from 'node-fetch';

const cpBaseUrl = 'https://api.coinpaprika.com/v1';
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