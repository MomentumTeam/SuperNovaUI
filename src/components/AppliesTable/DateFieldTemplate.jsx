import { isDateGreater } from '../../utils/applies';

const DateFieldTemplate = (date) => {
    const isWarn = isDateGreater(date, 3);
    return <div style={{color: isWarn? 'red': 'black'}}>{date}</div>;
};

export { DateFieldTemplate };
