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
    return moment(date).format(this.format);
  };

  timeSince = (date) => {
    return moment(date).fromNow(false);
  };

  absoluteDate = (date) => {
    return this.formattedDate(date).toString();
  };

  now = () => {
    return moment().format(this.format);
  }

  moment = (date) => {
    return moment(date, this.format);
  };

  getTime = (date) => {
    return new Date(date).getTime()
  }
}

export default new DatesUtil();