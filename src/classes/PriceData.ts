export class PriceData {
  allBids: Map<number, number>;
  allAsks: Map<number, number>;
  constructor(public bids: number[][] = [], public asks: number[][] = []) {
    this.allBids = new Map();
    this.allAsks = new Map();
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

  calculateNewPriceData(priceData: InitialPriceData): InitialPriceData {
    const { allBids, allAsks } = priceData;
    this.bids.map((bid) => {
      const [price, size] = bid;
      if (!size) allBids.delete(price);
      else allBids.set(price, size);
    });
    this.asks.map((ask) => {
      const [price, size] = ask;
      if (!size) allAsks.delete(price);
      else allAsks.set(price, size);
    });
    priceData.allBids = allBids;
    priceData.allAsks = allAsks;
    return priceData;
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
    super(feed, product_id, bids, asks);
    this.allBids = new Map(bids.map((pair) => [pair[0], pair[1]]));
    this.allAsks = new Map(asks.map((pair) => [pair[0], pair[1]]));
  }
}

export enum FeedValues {
  INITIAL = "book_ui_1",
  SNAPSHOT = "book_ui_1_snapshot",
}
