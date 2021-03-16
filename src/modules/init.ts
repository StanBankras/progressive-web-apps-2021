import CryptoCurrency from '../models/CryptoCurrency';
import { cpData } from './api';
export default async function () {
  console.log('Retrieving initial essential data...');
  let coins: CryptoCurrency[] = await cpData('/coins');
  coins = coins
    .map((d: any) => new CryptoCurrency(d.id, d.symbol, d.name, d.rank))
    .filter((c: CryptoCurrency) => c.rank !== 0 && c.rank <= 20);
  
  console.log('Top 20 loaded, loading more details of the top 20 now...');
  await Promise.all(coins.map(async c => c.refreshData()));

  return coins;
}