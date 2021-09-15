import { PriceData } from "../../utilities/PriceData";
import "./Header.scss";

type HeaderProps = {
  priceDataState: PriceData;
};

export const Header = ({ priceDataState }: HeaderProps) => {
  const { allAsks, allBids } = priceDataState;

  const determineSpread = (): string[] => {
    const topBid: number = allBids.keys().next().value;
    const topAsk: number = allAsks.keys().next().value;
    const spreadNum = (topAsk - topBid).toFixed(2);
    //Sort of hacky way to get the right percentage
    const spreadPct = ((topAsk / topBid - 1) * 100).toFixed(2);

    return [spreadNum, spreadPct];
  };

  const [spreadNum, spreadPct] = determineSpread();

  return (
    <div className="header">
      <span className="label">Order Book</span>
      <div className="spread">
        <span className="text">
          Spread {spreadNum} ({spreadPct}%)
        </span>
      </div>
    </div>
  );
};
