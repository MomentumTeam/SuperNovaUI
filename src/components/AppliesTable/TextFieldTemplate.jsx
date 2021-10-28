import { Tooltip } from "primereact/tooltip";
import '../../assets/css/main.css';

const TextFieldTemplate = (text) => {
    const id = Math.random().toString(36).slice(2);
  return (
    <div>
      {text !== "---" && (
        <Tooltip
          target={`.text-${id}`}
          content={text}
        />
      )}
      <div className={`text-${id} cut-text`}>{text}</div>
    </div>
  );
};

export { TextFieldTemplate };
