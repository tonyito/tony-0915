import { PriceData, Side } from "../../utilities/PriceData";
import { Row } from "./row/Row";

import "./Body.scss";
import Labels from "./row/Labels";

type Props = {
  isMobile: boolean;
  priceDataState: PriceData;
};

export const Body = ({ isMobile, priceDataState }: Props) => {
  const { allBids, allAsks } = priceDataState;

  const bidsArr = Array.from(allBids).slice(0, PriceData.MAX_ROWS);
  const asksArr = Array.from(allAsks).slice(0, PriceData.MAX_ROWS);
  //Takes the larger total size to determine which one to scale to
  //when creating the colored bars
  const largerTotal = Math.max(
    bidsArr.reduce((acc, curr) => acc + curr[1], 0),
    asksArr.reduce((acc, curr) => acc + curr[1], 0)
  );

  let bidTotal = 0;
  const bidRows = bidsArr.map((bid) => {
    const [price, size] = bid;
    bidTotal += size;
    const total = bidTotal;
    const rowProps = {
      largerTotal,
      isMobile,
      price,
      side: Side.BID,
      size,
      total,
    };
    return <Row {...rowProps} />;
  });

  let askTotal = 0;
  const askRows = asksArr.map((ask) => {
    const [price, size] = ask;
    askTotal += size;
    const total = askTotal;
    const rowProps = {
      largerTotal,
      isMobile,
      price,
      side: Side.ASK,
      size,
      total,
    };
    return <Row {...rowProps} />;
  });
  return (
    <>
      {!isMobile && (
        <div className="body_wrapper">
          <div className="column">
            <Labels side={Side.BID} />
            <div className="row_wrapper">{bidRows}</div>
          </div>
          <div className="column">
            <Labels side={Side.ASK} />
            <div className="row_wrapper">{askRows}</div>
          </div>
        </div>
      )}
    </>
  );
};
