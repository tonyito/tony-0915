import { Side } from "../../../utilities/PriceData";
import "./Column.scss";

type TotalProps = {
  side: Side;
  total: number;
};

export const Total = ({ side, total }: TotalProps) => {
  return (
    <div className="column_wrapper">
      <span className={`text ${side}`}>{total}</span>
    </div>
  );
};
