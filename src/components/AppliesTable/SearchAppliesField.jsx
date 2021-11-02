import { useEffect, useState } from "react";
import { AutoComplete } from "primereact/autocomplete";

import { EVENT_KEY_UP_CODE_ENTER } from "../../constants/general";

const SearchAppliesField = ({ selectedTab, setSearchFields, getData }) => {
  const [selected, setSelected] = useState(null);

  const searchFunc = async () => {
    try {
      await getData({ saveToStore: true, reset: true, append: false });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setSelected(null)
    setSearchFields("displayName", null);
  }, [selectedTab]);

  return (
    <div className="autocomplete-wrap">
      <div className="p-fluid">
        <div className="p-fluid-item">
          <div className="display-flex pad0 p-field padL16 input-serch">
            <label htmlFor="autocomplete">חיפוש </label>
            <AutoComplete
              type="serch"
              value={selected}
              suggestions={[]}
              onChange={(e) => {
                setSelected(e.value)
                setSearchFields("displayName", e.value);
              }}
              onKeyUp={async(e) => {
                if (e.code === EVENT_KEY_UP_CODE_ENTER) await searchFunc(e);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export { SearchAppliesField };
