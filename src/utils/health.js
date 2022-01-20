import healthStore from '../store/Health';

export const CheckHealth = () => {
  (async () => await healthStore.loadHealth())();
};