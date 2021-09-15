import { message } from "antd";
import { useState } from "react";
import { Currency } from "../../utilities/PriceData";
import { socket } from "../../utilities/requests";
import { WebSocketMessages } from "../../utilities/WebSocketMessages";

import "./Footer.scss";

export const Footer = () => {
  const [currency, setCurrency] = useState<Currency>(Currency.XBT);

  const toggleCurrency = () => {
    try {
      switch (currency) {
        case Currency.XBT:
          socket.send(WebSocketMessages.XBT_UNSUBSCRIBE);
          socket.send(WebSocketMessages.ETH_SUBSCRIBE);
          setCurrency(Currency.ETH);
          break;
        case Currency.ETH:
          socket.send(WebSocketMessages.ETH_UNSUBSCRIBE);
          socket.send(WebSocketMessages.XBT_SUBSCRIBE);
          setCurrency(Currency.XBT);
          break;
      }
    } catch (err) {
      socket.close(1000, "Unmounting component.");
      message.error("An error occured toggling feed.");
    }
  };

  return (
    <div className="footer">
      <button className="toggle_button" onClick={() => toggleCurrency()}>
        Toggle Feed
      </button>
    </div>
  );
};
