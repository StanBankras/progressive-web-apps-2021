import express from 'express';
import path from 'path';
import crypto from 'crypto';
import ejs from 'ejs';
import compression from 'compression';
require('dotenv').config();

import CryptoCurrency from './models/CryptoCurrency';
import init from './modules/init';

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(compression());
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, path) => {
    const hashRegExp = new RegExp('\\-[0-9a-z]{32}\\.');

    if(hashRegExp.test(path)) {
      res.setHeader('Cache-Control', 'max-age=31536000');
    }
  }
}));

(async () => {
  let coins = await init();

  setInterval(async () => {
    coins = await init();
  }, 900000);
  
  app.get('/', async (req, res) => {
    const html = await ejs.renderFile(path.join(__dirname, 'views', 'overview.ejs'), { coins });
    const hash = crypto.createHash('md5').update(html).digest('hex');

    const contentHash: any = req.headers['etag'];
    if (contentHash && contentHash === hash) return res.sendStatus(304);

    res.set('ETag', hash).send(html);
  });
  
  app.get('/coin/:id', async (req, res) => {
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
    const html = await ejs.renderFile(path.join(__dirname, 'views', 'detail.ejs'), { coin, table });
    const hash = crypto.createHash('md5').update(html).digest('hex');

    const contentHash: any = req.headers['etag'];
    if (contentHash && contentHash === hash) return res.sendStatus(304);

    res.set('ETag', hash).send(html);
  });

  app.get('/offline', (req, res) => {
    res.render('offline');
  })
  
  app.listen(port, () => {
    console.log(`server is running on port ${port}`);
  });

})();
