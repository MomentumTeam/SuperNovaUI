import { useMatomo } from '@datapunt/matomo-tracker-react';

export const clickSendAction = (name) => {
  // const result = actionList.find(({ id }) => id === name);
  useMatomo.trackEvent({
    category: 'פעולות',
    action: `שליחת בקשה ל${name}`,
  });
};
