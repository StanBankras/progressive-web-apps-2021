import { cpData } from './api';
import CryptoCurrency from '../models/CryptoCurrency';


export async function getAllCoins(): Promise<CryptoCurrency[]> {
  const data: any = await cpData('/coins');
  return data.map((d: any) => new CryptoCurrency(d.id, d.symbol, d.name, d.rank));
}

export async function initializeData(): Promise<CryptoCurrency[]> {
  const coins: any = await getAllCoins();
  return coins.filter((c: CryptoCurrency) => c.rank !== 0 && c.rank <= 20);
}