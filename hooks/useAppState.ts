import { useCallback, useEffect } from "react";
import { AppState, AppStateStatus } from "react-native";

interface Config {
  onForeground?: () => void;
  onBackground?: () => void;
}

export function useAppState({ onForeground, onBackground }: Config) {
  const handleAppStateChange = useCallback(
    (state: AppStateStatus) => {
      if (state.match(/background|inactive/)) onBackground?.();
      if (state === "active") onForeground?.();
    },
    [onBackground, onForeground],
  );

  useEffect(() => {
    const event = AppState.addEventListener("change", handleAppStateChange);
    return event.remove;
  }, [handleAppStateChange]);
}
