import { useEffect, useState } from "react";
import {
  FeedValues,
  InitialPriceData,
  PriceData,
  PriceDeltas,
} from "../utilities/PriceData";
import { Body } from "./body/Body";
import { Header } from "./header/Header";

import "./Main.scss";

export const Main = () => {
  const [priceDataState, setPriceDataState] = useState<PriceData>(
    new PriceData()
  );
  const [isMobile, setIsMobile] = useState<boolean>(false);

  //Detect connection
  const shouldThrottle = false;

  useEffect(() => {
    const socket = new WebSocket("wss://www.cryptofacilities.com/ws/v1");
    let priceData: InitialPriceData = new InitialPriceData();

    //Throttler to adjust for slower devices / connections
    let throttler: NodeJS.Timeout;
    if (shouldThrottle) {
      throttler = setInterval(() => {
        setPriceDataState({ ...priceData });
      }, 500);
    }

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

    //Dangling reference cleanup
    return () => {
      clearInterval(throttler);
      socket.close(1000, "Unmounting component.");
    };
  }, []);

  return (
    <div className="main_wrapper">
      <Header />
      <Body isMobile={isMobile} priceDataState={priceDataState} />
    </div>
  );
};
