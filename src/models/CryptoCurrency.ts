import { cpData } from '../modules/api';
import { getLatestItemByDate } from '../modules/utils';
import Tweet from './Tweet';
import Event from './Event';

export default class CryptoCurrency {

  public id: string;
  public symbol: string;
  public name: string;
  public rank: number;
  private tweets: Tweet[];
  private events: Event[];
  public recentTweet: Tweet;
  public recentEvent: Event;
  public markets: any[];
  public monthlyData: any[];

  constructor(id: string, symbol: string, name: string, rank: number) {
    this.id = id;
    this.symbol = symbol;
    this.name = name;
    this.rank = rank;
    this.tweets = [];
    this.events = [];
    this.recentTweet = '';
    this.recentEvent = '';
    this.markets = [];
    this.monthlyData = [];
  }

  async refreshData() {
    this.tweets = await this.getCoinTwitterTimeline();
    this.markets = await this.getCoinMarketsById();
    this.events = await this.getCoinEvents();
    this.monthlyData = await this.getMonthlyChartData();
  }
  
  async getCoinTwitterTimeline(): Promise<Tweet[]> {
    let data = await cpData(`/coins/${this.id}/twitter`) || [];
    data = data.filter((d: any) => !d.is_retweet);
    
    if(data && data.length > 0) {
      this.recentTweet = this.getMostRecentTweet(data);
    }
  
    return data;
  }

  getMostRecentTweet(tweets: Tweet[]): Tweet {
    return getLatestItemByDate(tweets as [], 'date');
  }

  getMostRecentEvent(events: Tweet[]): Tweet {
    return getLatestItemByDate(events as [], 'date');
  }

  async getCoinMarketsById() {
    const response = await cpData(`/coins/${this.id}/markets`);
    return response.slice(0, Math.min(response.length, 20));
  }

  async getCoinEvents(): Promise<Event[]> {
    const data = await cpData(`/coins/${this.id}/events`) || [];
    
    if(data && data.length > 0) {
      this.recentEvent = this.getMostRecentEvent(data);
    }

    return data;
  }

  async getMonthlyChartData() {
    const startDate: Date = new Date();
    // Get the date of 30 days ago
    startDate.setDate(startDate.getDate() - 30);
    return await cpData(
      `/coins/${this.id}/ohlcv/historical`,
      { start: (startDate.getTime() / 1000).toFixed(0), end: (Date.now() / 1000).toFixed(0) }
    );
  } 

}