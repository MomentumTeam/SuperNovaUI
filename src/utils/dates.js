import moment from 'moment';

class DatesUtil {
  format;

  constructor() {
    this.format = 'MM/DD/YYYY';
  }

  formattedDateTime = (date) => {
    return moment(date).format('MMM D, YYYY, HH:mm');
  };

  formattedDate = (date) => {
    return moment(date).format('DD/MM/YYYY');
  };

  timeSince = (date) => {
    return moment(date).fromNow(false);
  };

  absoluteDate = (date) => {
    return this.formattedDate(date).toString();
  };

  moment = (date) => {
    return moment(date, this.format);
  };
}

export default new DatesUtil();