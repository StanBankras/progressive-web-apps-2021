import { cpData } from '../modules/api';
import { getLatestItemByDate } from '../modules/utils';

export default class CryptoCurrency {

  constructor(id, symbol, name, rank) {
    this.id = id;
    this.symbol = symbol;
    this.name = name;
    this.rank = rank;
  }

  async refreshData() {
    this.tweets = await this.getCoinTwitterTimeline();
    this.events = await this.getCoinEvents();
  }
  
  async getCoinTwitterTimeline() {
    let data = await cpData(`/coins/${this.id}/twitter`) || [];
    data = data.filter(d => !d.is_retweet);
    
    if(data && data.length > 0) {
      this.recentTweet = this.getMostRecentTweet(data);
    }
  
    return data;
  }

  getMostRecentTweet(tweets) {
    return getLatestItemByDate(tweets, 'date');
  }

  getMostRecentEvent(events) {
    return getLatestItemByDate(events, 'date');
  }

  async getCoinMarketsById() {
    const response = await cpData(`/coins/${this.id}/markets`);
    return response.slice(0, Math.min(response.length, 20));
  }

  async getCoinEvents() {
    const data = await cpData(`/coins/${this.id}/events`) || {};
    
    if(data && data.length > 0) {
      this.recentEvent = this.getMostRecentEvent(data);
    }

    return data;
  }

  async getMonthlyChartData() {
    const startDate = new Date();
    // Get the date of 30 days ago
    startDate.setDate(startDate.getDate() - 30);
    return await cpData(
      `/coins/${this.id}/ohlcv/historical`,
      { start: (startDate.getTime() / 1000).toFixed(0), end: (Date.now() / 1000).toFixed(0) }
    );
  } 

}