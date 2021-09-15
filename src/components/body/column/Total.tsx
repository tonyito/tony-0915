import { Side } from "../../../utilities/PriceData";
import "./Column.scss";

type Props = {
  side: Side;
  total: number;
};

export const Total = ({ side, total }: Props) => {
  return (
    <div className="column_wrapper">
      <span className={`text ${side}`}>{total}</span>
    </div>
  );
};
