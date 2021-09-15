import { Side } from "../../../utilities/PriceData";
import "./Column.scss";

type Props = {
  side: Side;
  size: number;
};

export const Size = ({ size, side }: Props) => {
  return (
    <div className="column_wrapper">
      <span className={`text ${side}`}>{size}</span>
    </div>
  );
};
