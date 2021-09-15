export class PriceData {
  //Maximum amount of rows we want displayed in the order book
  static readonly MAX_ROWS = 16;
  allBids: Map<number, number>;
  allAsks: Map<number, number>;
  constructor(public bids: number[][] = [], public asks: number[][] = []) {
    this.allBids = new Map<number, number>();
    this.allAsks = new Map<number, number>();
  }
}

export class PriceDeltas extends PriceData {
  constructor(
    public feed: string = "",
    public product_id: string = "",
    bids: number[][] = [],
    asks: number[][] = []
  ) {
    super(bids, asks);
  }
  //Get rid of order if size equals 0, adds the rest
  calculateNewPriceData(priceData: InitialPriceData): void {
    const { allBids, allAsks } = priceData;
    this.bids.map((bid) => {
      const [price, size] = bid;
      if (!size) allBids.delete(price);
      else allBids.set(price, size);
      return;
    });
    this.asks.map((ask) => {
      const [price, size] = ask;
      if (!size) allAsks.delete(price);
      else allAsks.set(price, size);
      return;
    });
    this.truncatePriceData(priceData);
  }
  /** We want the orders for bids and asks to be in reverse order so
   * the highest price is at the top for bids, and reverse for asks
   */
  protected truncatePriceData(priceData: InitialPriceData): void {
    const { allBids, allAsks } = priceData;
    const allBidsArr = Array.from(allBids);
    allBidsArr.sort((a, b) => {
      return b[0] - a[0];
    });
    priceData.allBids = new Map<number, number>(
      allBidsArr.map((pair) => [pair[0], pair[1]])
    );
    const allAsksArr = Array.from(allAsks);
    allAsksArr.sort((a, b) => a[0] - b[0]);
    priceData.allAsks = new Map<number, number>(
      allAsksArr.map((pair) => [pair[0], pair[1]])
    );
  }
}

export class InitialPriceData extends PriceDeltas {
  constructor(
    feed: string = "",
    product_id: string = "",
    bids: number[][] = [],
    asks: number[][] = [],
    public num_levels: number = 0
  ) {
    //Don't really need to store snapshot bid/asks after instantiation
    super(feed, product_id);
    this.allBids = new Map<number, number>(
      bids.map((pair) => [pair[0], pair[1]])
    );
    this.allAsks = new Map<number, number>(
      asks.map((pair) => [pair[0], pair[1]])
    );
    this.truncatePriceData(this);
  }
}

export enum FeedValues {
  INITIAL = "book_ui_1",
  SNAPSHOT = "book_ui_1_snapshot",
}

export enum Side {
  BID = "bid",
  ASK = "ask",
}

export enum Currency {
  XBT = "XBT",
  ETH = "ETH",
}
