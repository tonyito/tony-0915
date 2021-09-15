import { Side } from "../../../utilities/PriceData";
import "./Labels.scss";

type LabelsProps = {
  side: Side;
};

const Labels = ({ side }: LabelsProps) => {
  const labelArr = ["total", "size", "price"];
  return (
    <div className="labels">
      {(side === Side.BID ? labelArr : labelArr.reverse()).map((label, idx) => {
        return (
          <span key={`${label}_${side}`} className={`text ${side}`}>
            {label.toUpperCase()}
          </span>
        );
      })}
    </div>
  );
};

export default Labels;
