import { Dropdown } from "primereact/dropdown";
import { useEffect, useState, useCallback } from "react";

const FilterAppliesField = ({ selectedTab, setSearchFields, getData, searchField, searchFieldDisplayName, searchOptions }) => {
  const [filter, setFilter] = useState(null);
  const typeOptions = Object.entries(searchOptions).map(([key, value]) => {
    return { label: value, value: key };
  });

  const filterFunc = useCallback(async () => {
    if (filter !== null) {
      try {
        await getData({ saveToStore: true, reset: true, append: false });
      } catch (error) {
        console.log(error);
      }
    }
  }, [filter]);

  useEffect(() => {
    setFilter(null);
    setSearchFields(searchField, null);
  }, [selectedTab]);

  useEffect(() => {
    filterFunc();
  }, [filterFunc]);

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
              setSearchFields(searchField, e.value);
            }}
            placeholder={searchFieldDisplayName}
          />
        </div>
      </div>
    </div>
  );
};

export { FilterAppliesField };
