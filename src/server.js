import express from 'express';
import path from 'path';
import { initializeData } from './modules/api';

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "..", "src", "public")));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "..", "src", "views"));

(async () => {
  console.log('Retrieving initial essential data...');

  let coins = await initializeData();
  coins = coins.filter(c => c.rank <= 3)

  await Promise.all(coins.map(async c => c.refreshData()));

  setInterval(() => {
    coins.map(async c => c.refreshData())
  }, 300000);
  
  app.get('/', function(req, res) {   
    res.render('overview', { coins, public: '/' });
  });
  
  app.get('/coin/:id', function(req, res) {   
    const coin = coins.find(c => c.id === req.params.id);
    const rows = coin.markets.map(m => {
      return {
        'Exchange': m.exchange_name,
        'Pair': m.pair,
        'Name': m.base_currency_name,
        'Quote currency': m.quote_currency_name,
        '24h volume': `${m.quotes[Object.keys(m.quotes)[0]].volume_24h.toFixed(2)}`
      }
    });
    
    res.render('detail', { 
      coin,
      public: '../../',
      table: {
        headers: Object.keys(rows[0]),
        rows
      } });
  });
  
  app.listen(port, function() {
    console.log(`server is running on port ${port}`);
  });
})();
