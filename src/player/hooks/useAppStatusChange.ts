import { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';

const useAppStatusChange = (handler: (status: AppStateStatus) => any) => {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', status => {
      handler(status);
    });

    return () => {
      subscription.remove();
    };
  }, []);
};

export default useAppStatusChange;
