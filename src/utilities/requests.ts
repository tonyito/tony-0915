import { message } from "antd";
import { Dispatch, SetStateAction } from "react";
import {
  FeedValues,
  InitialPriceData,
  PriceData,
  PriceDeltas,
} from "./PriceData";
import { WebSocketMessages } from "./WebSocketMessages";

const SOCKET_URL = "wss://www.cryptofacilities.com/ws/v1";

export let socket = new WebSocket(SOCKET_URL);

export const reconnect = () => {
  socket = new WebSocket(SOCKET_URL);
};
export const receiveData = (
  shouldThrottle: boolean,
  setPriceDataState: Dispatch<SetStateAction<PriceData>>
) => {
  let priceData: InitialPriceData = new InitialPriceData();

  //Throttler to adjust for slower devices / connections
  let throttler: null | NodeJS.Timeout = null;
  if (shouldThrottle) {
    throttler = setInterval(() => {
      setPriceDataState({ ...priceData });
    }, 100);
  }
  try {
    socket.onopen = () => {
      //Initialize with XBT feed
      socket.send(WebSocketMessages.XBT_SUBSCRIBE);
    };

    socket.onmessage = (res) => {
      const message = JSON.parse(res.data);
      const { feed, event } = message;
      //Initialize data with the snapshot
      if (feed === FeedValues.SNAPSHOT) {
        const { feed, product_id, num_levels, bids, asks } =
          message as InitialPriceData;
        priceData = new InitialPriceData(
          feed,
          product_id,
          bids,
          asks,
          num_levels
        );
      }
      //Event key is missing in deltas, easy way to identify them
      if (!event) {
        const { feed, product_id, bids, asks } = message as PriceDeltas;
        new PriceDeltas(feed, product_id, bids, asks).calculateNewPriceData(
          priceData
        );
        if (!shouldThrottle) setPriceDataState({ ...priceData });
      }
    };
  } catch (err) {
    message.error("An error occured acquiring price data.");
    socket.close(1006, "Error with socket connection.");
  }
  return throttler;
};
