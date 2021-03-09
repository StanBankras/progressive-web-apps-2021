import express from 'express';
import path from 'path';
require('dotenv').config();

import CryptoCurrency from './models/CryptoCurrency';
import { cpData } from './modules/api';

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'src', 'views'));
app.use(express.static(path.join(__dirname, '..', 'src', 'public')));

(async () => {

  console.log('Retrieving initial essential data...');
  let coins: CryptoCurrency[] = await cpData('/coins');
  coins = coins
    .map((d: any) => new CryptoCurrency(d.id, d.symbol, d.name, d.rank))
    .filter((c: CryptoCurrency) => c.rank !== 0 && c.rank <= 20);
  
  console.log('Top 20 loaded, loading more details of the top 20 now...');
  await Promise.all(coins.map(async c => c.refreshData()));
  
  app.get('/', function(req, res) {   
    res.render('overview', { coins });
  });
  
  app.get('/coin/:id', function(req, res) {   
    const coin: CryptoCurrency | undefined = coins.find(c => c.id === req.params.id);
    if (!coin) return res.sendStatus(404);

    const tr = coin.markets.map((m: any) => {
      return {
        'Exchange': m.exchange_name,
        'Pair': m.pair,
        'Name': m.base_currency_name,
        'Quote currency': m.quote_currency_name,
        '24h volume': `${m.quotes[Object.keys(m.quotes)[0]].volume_24h.toFixed(2)}`
      };
    });

    const th = Object.keys(tr[0]);
    const table = { headers: th, rows: tr };

    res.render('detail', { coin, table });
  });
  
  app.listen(port, function() {
    console.log(`server is running on port ${port}`);
  });

})();
