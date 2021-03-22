# Coinevents - Progressive web apps

The goal of this project is to refactor the [web app](https://github.com/StanBankras/web-app-from-scratch-2021) I built from scratch from client side to server side render. 

I plan to use NodeJS with Express and EJS to achieve this. 

During this project I also want to practice using Typescript.

## Table of contents
* [Coinpaprika API](https://github.com/StanBankras/progressive-web-apps-2021#coinpaprika-api)
* [Concept](https://github.com/StanBankras/progressive-web-apps-2021#concept)
* [Features](https://github.com/StanBankras/progressive-web-apps-2021#features)
* [Installation](https://github.com/StanBankras/progressive-web-apps-2021#installation)
* [Resources](https://github.com/StanBankras/progressive-web-apps-2021#resources)
* [License](https://github.com/StanBankras/progressive-web-apps-2021#features)

## :sweet_potato: Coinpaprika API
I have chosen to work with the [Coinpaprika API](https://api.coinpaprika.com/). It's an API that has data of all live cryptocurrencies, ranked based on marketcap. The API is open, always free to use and very friendly to use. Using the API I can retrieve data per coin like on which exchanges it is listed, tweets related to the coin and upcoming events for the coin.

**Base URL**

The base URL of this API is `https://api.coinpaprika.com/v1/`.

**Endpoints used in this project**:
* `/coins` - Retrieve all coins listed on Coinpaprika as object with their corresponding coin-id
* `/coins/${id}/ohlcv/historical` - Retrieve day to day historical price data from a coin
* `/coins/${id}/markets` - Retrieve trading markets that are active for this coin
* `/coins/${id}/twitter` & `/coins/${id}/events` - Retrieve latest Tweets & events by this coin's project

**Rate limit**

Coinpaprika limits the amount of requests per IP to [10 per second](https://api.coinpaprika.com/#section/Rate-limit). Make sure to handle this when using the API.

## :pencil2: Concept
The concept is to make an alternative to [Coinpaprika](https://coinpaprika.com/) where I show upcoming events and most recent tweets of a project, instead of raw data. This could help a normal person to better understand what is about to happen to the project that is behind the coin.

## :rocket: Features
:heavy_check_mark: Most recent tweet of all top 20 cryptos

:heavy_check_mark: Most latest event of all top 20 cryptos

:heavy_check_mark: Monthly price chart per coin

:heavy_check_mark: Find out which pairs the coin is traded against and where

## :gear: Installation
to do

## TODO
- [ ] "Refresh page to see new content", if new content was found
- [ ] Catch app install event, make custom installation popup
- [ ] Clientside javascript encode/minify
- [ ] Offline page show cached pages

## Resources
* [TSConfig docs](https://www.typescriptlang.org/tsconfig)
* [Options for compiling TS](https://medium.com/@lucksp_22012/3-options-to-compile-typescript-to-js-rollup-tsc-babel-3319977a6946)
* [ESLint docs](https://eslint.org/)
* [Converting JS to TS](https://dev.to/animo/convert-an-express-nodejs-app-from-javascript-to-typescript-302l)
* [NPM run all](https://dev.to/danywalls/how-to-run-multiple-npm-scripts-with-npm-run-all-3ad2)
* [Getting started with Serviceworkers](https://developers.google.com/web/fundamentals/primers/service-workers)
* [Expiration date for cache](https://gomakethings.com/how-to-set-an-expiration-date-for-items-in-a-service-worker-cache/)

## License
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
