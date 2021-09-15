import { Modal } from "antd";
import { isNil } from "lodash";
import { useEffect, useState } from "react";
import { Currency, PriceData } from "../utilities/PriceData";
import { receiveData, reconnect, socket } from "../utilities/requests";
import { Body } from "./body/Body";
import { Footer } from "./footer/Footer";
import { Header } from "./header/Header";

import "./Main.scss";

export const Main = () => {
  //Main state variable storing all price data to be rendered
  const [priceDataState, setPriceDataState] = useState<PriceData>(
    new PriceData()
  );

  /* Resposiveness flag to change layout of the feed
   * I've implemented some of this, but since it's not a hard requirement,
   * I'll mark it as a todo.
   *
   * @TODO: Implement responsiveness either by grabbing screen size via
   * window object, or component dimensions via useRef hook.
   */
  //@ts-ignore
  const [isMobile, setIsMobile] = useState<boolean>(false);

  //Current feed for selected currency. Toggled via button.
  const [currency, setCurrency] = useState<Currency>(Currency.XBT);

  /* Flag to allow throttling. A more intricate method of determining whether
   * or not to throttle can be created by utilizing the performance API.
   * Although it is in the success crieteria, for this activity, I'm going
   * to consider the detection implementation out-of scope.
   */

  const shouldThrottle = false;

  let throttler: NodeJS.Timeout | null;

  useEffect(() => {
    throttler = receiveData(shouldThrottle, setPriceDataState);

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
                //Re-open the connection once the user comes back
                //Be sure if throttler is enabled, to clear it so there aren't two of them running
                if (throttler) clearInterval(throttler);
                reconnect();
                isHidden = false;
                throttler = receiveData(shouldThrottle, setPriceDataState);
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
      <Header priceDataState={priceDataState} />
      <Body isMobile={isMobile} priceDataState={priceDataState} />
      <Footer currency={currency} setCurrency={setCurrency} />
    </div>
  );
};
