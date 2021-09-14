import { useEffect, useState } from "react";
import {
  FeedValues,
  InitialPriceData,
  PriceData,
  PriceDeltas,
} from "../classes/PriceData";
import { Header } from "./header/Header";

import "./Main.scss";

export const Main = () => {
  const [priceDataState, setPriceDataState] = useState<PriceData>(
    new PriceData()
  );

  useEffect(() => {
    const socket = new WebSocket("wss://www.cryptofacilities.com/ws/v1");
    let priceData = new InitialPriceData();
    const throttler = setInterval(() => {
      setPriceDataState({ ...priceData });
    }, 2000);

    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          event: "subscribe",
          feed: "book_ui_1",
          product_ids: ["PI_XBTUSD"],
        })
      );
    };

    socket.onmessage = (res) => {
      const message = JSON.parse(res.data);
      const { feed, event } = message;
      if (feed === FeedValues.SNAPSHOT) {
        const { feed, product_id, num_levels, bids, asks } = message;
        priceData = new InitialPriceData(
          feed,
          product_id,
          bids,
          asks,
          num_levels
        );
      }
      if (!event) {
        const { feed, product_id, bids, asks } = message;
        priceData = new PriceDeltas(
          feed,
          product_id,
          bids,
          asks
        ).calculateNewPriceData(priceData);
      }
    };

    return () => {
      clearInterval(throttler);
      socket.close(1000, "Unmounting component.");
    };
  }, []);

  return (
    <div className="main_wrapper">
      <Header />
    </div>
  );
};
