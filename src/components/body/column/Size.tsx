import { Side } from "../../../utilities/PriceData";
import "./Column.scss";

type SizeProps = {
  side: Side;
  size: number;
};

export const Size = ({ size, side }: SizeProps) => {
  return (
    <div className="column_wrapper">
      <span className={`text ${side}`}>{size}</span>
    </div>
  );
};
