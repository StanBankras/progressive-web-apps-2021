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
  coins = coins.filter(c => c.rank <= 20)

  await Promise.all(coins.map(async c => c.refreshData()));

  setInterval(() => {
    coins.map(async c => c.refreshData())
  }, 300000);
  
  app.get('/', function(req, res) {   
    res.render('overview', { coins, public: '/' });
  });
  
  app.get('/coin/:id', function(req, res) {   
    const coin = coins.find(c => c.id === req.params.id);
    res.render('detail', { coin, public: '../../' });
  });
  
  app.listen(port, function() {
    console.log(`server is running on port ${port}`);
  });
})();
