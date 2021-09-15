import { Side } from "../../../utilities/PriceData";
import "./Labels.scss";

type Props = {
  side: Side;
};

const Labels = ({ side }: Props) => {
  const labelArr = ["total", "size", "price"];
  return (
    <div className="labels">
      {(side === Side.BID ? labelArr : labelArr.reverse()).map((label) => {
        return <span className={`text ${side}`}>{label.toUpperCase()}</span>;
      })}
    </div>
  );
};

export default Labels;
