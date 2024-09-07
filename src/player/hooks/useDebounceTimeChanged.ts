import { useInterval } from './useInterval';

const useDebounceTimeChanged = (handle: (time: number) => any, active: boolean, time: number | undefined, delay: number | null = 4000) => {
  const notifyTimeChanged = () => {
    if (time) {
      handle(time);
    }
  };
  useInterval(() => notifyTimeChanged(), active ? delay : null);
};

export default useDebounceTimeChanged;
