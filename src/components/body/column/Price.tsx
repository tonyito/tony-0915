import { Side } from "../../../utilities/PriceData";

import "./Column.scss";

type PriceProps = {
  price: number;
  side: Side;
};

export const Price = ({ price, side }: PriceProps) => {
  return (
    <div className={`column_wrapper ${side}`}>
      <span className={`text ${side} ${side}_color`}>{price.toFixed(2)}</span>
    </div>
  );
};
