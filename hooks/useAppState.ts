import { useCallback, useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';

interface Config {
  onForeground?: () => void;
  onBackground?: () => void;
}

export function useAppState({ onForeground, onBackground }: Config) {
  const handleAppStateChange = useCallback(
    (state: AppStateStatus) => {
      if (state.match(/background|inactive/) && onBackground) {
        onBackground();
      }

      if (state === 'active' && onForeground) {
        onForeground();
      }
    },
    [onBackground, onForeground],
  );

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, [handleAppStateChange]);
}
