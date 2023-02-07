import { useEffect, useState } from "react";
import { BackHandler, NativeEventSubscription } from "react-native";

export interface AndroidBackHandlerConfig {
  /** Optional callback function to execute on back button press */
  handlePress?: () => void;
  /** Whether or not the default android back button behavior will be blocked */
  disableBack: boolean;
}

export function useAndroidBackHandler(config: AndroidBackHandlerConfig) {
  const { handlePress, disableBack } = config;
  const [handler, setHandler] = useState<NativeEventSubscription>();

  /** Enable custom back handler */
  function enable() {
    const handler = BackHandler.addEventListener("hardwareBackPress", () => {
      handlePress?.();
      return !!handlePress || disableBack;
    });

    setHandler(handler);
  }

  /** Disable custom back handler */
  function remove() {
    handler?.remove();
  }

  return { enable, remove };
}
