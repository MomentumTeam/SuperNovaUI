import { Dropdown } from "primereact/dropdown";
import { useEffect, useState } from "react";
import { TYPES } from "../../constants";

const FilterAppliesField = ({ selectedTab, setSearchFields, getData }) => {
  const [filter, setFilter] = useState(null);
  const typeOptions = Object.entries(TYPES).map(([key, value]) => {
    return { label: value, value: key };
  });

  const filterFunc = async () => {
    try {
      await getData({ saveToStore: true, reset: true, append: false });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setFilter(null);
    setSearchFields("type", null);
  }, [selectedTab]);

  useEffect(async() => {
    await filterFunc();
  }, [filter])
  
  return (
    <div className="p-fluid">
      <div className="p-fluid-item">
        <div className="display-flex pad0 p-field">
          <label htmlFor="6010">סנן לפי </label>
          <Dropdown
            className="dropdown-options"
            inputId="6010"
            showClear
            value={filter}
            options={typeOptions}
            onChange={async (e) => {
              setFilter(e.value);
              setSearchFields("type", e.value);
            }}
            placeholder="סוג בקשה"
          />
        </div>
      </div>
    </div>
  );
};

export { FilterAppliesField };
