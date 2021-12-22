import moment from 'moment';

class DatesUtil {
  format;
  mask;
  lowerFormat; 
  formatWithTime;

  constructor() {
    this.format = "DD/MM/YYYY";
    this.formatWithTime = "DD/MM/YYYY, HH:mm";
    this.mask = "99/99/9999";
    this.lowerFormat = "dd/mm/yy";
  }

  formattedDateTime = (date) => {
    return moment(date).format('MMM D, YYYY, HH:mm');
  };

  formattedDate = (date, withTime = false) => {
    return moment(date).format(withTime? this.formatWithTime: this.format);
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