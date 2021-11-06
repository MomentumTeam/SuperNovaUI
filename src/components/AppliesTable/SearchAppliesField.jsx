import { useEffect, useState } from "react";
import { AutoComplete } from "primereact/autocomplete";

import { EVENT_KEY_UP_CODE_ENTER } from "../../constants/general";
import { searchTooltipMessage } from '../../constants';

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
    setSearchFields("searchQuery", null);
  }, [selectedTab]);

  return (
    <div className="autocomplete-wrap">
      <div className="p-fluid">
        <div className="p-fluid-item">
          <div className="display-flex pad0 p-field padL16 input-serch">
            <label htmlFor="autocomplete">חיפוש </label>
            <AutoComplete
              type="search"
              value={selected}
              suggestions={[]}
              onChange={(e) => {
                setSelected(e.value);
                setSearchFields("searchQuery", e.value);
              }}
              tooltip={searchTooltipMessage}
              onClear={async (e) => {
                await searchFunc(e);
              }}
              onKeyUp={async (e) => {
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
