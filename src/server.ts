import express from 'express';
import path from 'path';
require('dotenv').config();

import { initializeData } from './modules/api';
import CryptoCurrency from './models/CryptoCurrency';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '..', 'src', 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'src', 'views'));

(async () => {

  console.log('Retrieving initial essential data...');
  let topCoins: CryptoCurrency[] = await initializeData();

  console.log('Top 20 loaded, loading more details of the top 20 now...');
  await Promise.all(topCoins.map(async c => c.refreshData()));
  
  app.get('/', function(req, res) {   
    res.render('overview', { coins: topCoins, public: '/' });
  });
  
  app.get('/coin/:id', function(req, res) {   
    const coin: CryptoCurrency | undefined = topCoins.find(c => c.id === req.params.id);
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

    res.render('detail', { 
      coin,
      table,
      public: '../../'
    });
  });
  
  app.listen(port, function() {
    console.log(`server is running on port ${port}`);
  });

})();
