import { Side } from "../../../utilities/PriceData";
import { Price } from "../column/Price";
import { Size } from "../column/Size";
import { Total } from "../column/Total";

import "./Row.scss";

type Props = {
  largerTotal: number;
  isMobile: boolean;
  price: number;
  side: Side;
  size: number;
  total: number;
};

export const Row = ({
  largerTotal,
  isMobile,
  price,
  side,
  size,
  total,
}: Props) => {
  return (
    <div className="body_row_wrapper">
      <div
        className={`color_bar ${side}`}
        style={{
          width: `${(100 * total) / largerTotal}%`, //Depth width calculation
        }}
      />
      <div className={`body_row ${side}`}>
        {side === Side.ASK || isMobile ? (
          <Price price={price} side={side} />
        ) : (
          <Total side={side} total={total} />
        )}
        <Size side={side} size={size} />
        {side === Side.ASK || isMobile ? (
          <Total side={side} total={total} />
        ) : (
          <Price price={price} side={side} />
        )}
      </div>
    </div>
  );
};
