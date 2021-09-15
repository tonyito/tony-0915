export class WebSocketMessages {
  static readonly XBT_SUBSCRIBE = JSON.stringify({
    event: "subscribe",
    feed: "book_ui_1",
    product_ids: ["PI_XBTUSD"],
  });
  static readonly XBT_UNSUBSCRIBE = JSON.stringify({
    event: "unsubscribe",
    feed: "book_ui_1",
    product_ids: ["PI_XBTUSD"],
  });
  static readonly ETH_SUBSCRIBE = JSON.stringify({
    event: "subscribe",
    feed: "book_ui_1",
    product_ids: ["PI_ETHUSD"],
  });
  static readonly ETH_UNSUBSCRIBE = JSON.stringify({
    event: "unsubscribe",
    feed: "book_ui_1",
    product_ids: ["PI_ETHUSD"],
  });
}
