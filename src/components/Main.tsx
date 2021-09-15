import { Modal } from "antd";
import message from "antd/lib/message";
import { isNil } from "lodash";
import { useEffect, useState } from "react";
import {
  FeedValues,
  InitialPriceData,
  PriceData,
  PriceDeltas,
} from "../utilities/PriceData";
import { receiveData, reconnect, socket } from "../utilities/requests";
import { WebSocketMessages } from "../utilities/WebSocketMessages";
import { Body } from "./body/Body";
import { Footer } from "./footer/Footer";
import { Header } from "./header/Header";

import "./Main.scss";

export const Main = () => {
  //Main state variable storing all price data to be rendered
  const [priceDataState, setPriceDataState] = useState<PriceData>(
    new PriceData()
  );
  //Resposiveness flag to change layout of the feed
  const [isMobile, setIsMobile] = useState<boolean>(false);

  //Detect connection
  const shouldThrottle = false;

  useEffect(() => {
    const throttler = receiveData(shouldThrottle, setPriceDataState);

    //Dangling reference cleanup
    return () => {
      if (throttler) clearInterval(throttler);
      socket.close(1000, "Unmounting component.");
    };
  }, []);

  /** 3 types of options depending on browser support to detect status
   * of hidden tab.
   * Source: https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
   */
  const { hidden, msHidden, webkitHidden } = document as Document & {
    msHidden?: boolean;
    webkitHidden?: boolean;
  }; //Casting required due to no type defs available for these two

  const hiddenOptions = [hidden, msHidden, webkitHidden];

  //Flags whether the feed should be disconnected or not.
  //Utilize Visibility API to close connection if the user changes tabs.
  let isHidden = false;

  useEffect(() => {
    hiddenOptions.map((option) => {
      if (!isNil(option)) {
        if (option) {
          if (!isHidden) {
            socket.close(1000, "Unmounting component.");
            Modal.info({
              title: "Tab changes detected",
              content: (
                <div>
                  <p>Press "OK" to continue loading your feed.</p>
                </div>
              ),
              onOk() {
                reconnect();
                isHidden = false;
                receiveData(shouldThrottle, setPriceDataState);
              },
            });
            isHidden = true;
          }
        }
      }
    });
  }, hiddenOptions);

  return (
    <div className="main_wrapper">
      <Header />
      <Body isMobile={isMobile} priceDataState={priceDataState} />
      <Footer />
    </div>
  );
};
