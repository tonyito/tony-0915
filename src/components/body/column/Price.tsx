import { Side } from "../../../utilities/PriceData";

import "./Column.scss";

type Props = {
  price: number;
  side: Side;
};

export const Price = ({ price, side }: Props) => {
  return (
    <div className={`column_wrapper ${side}`}>
      <span className={`text ${side} ${side}_color`}>{price.toFixed(2)}</span>
    </div>
  );
};
