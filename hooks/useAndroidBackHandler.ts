import { useEffect } from "react";
import { BackHandler } from "react-native";

interface DefaultProps {
  /** Whether the custom handler is enabled or disabled. */
  enabled: boolean;
}
interface WithCallback extends DefaultProps {
  /** Callback function to execute on back button press. Will disable default behavior. */
  handlePress: () => void;
}

interface WithDisable extends DefaultProps {
  /** Whether or not the default android back button behavior will be blocked */
  disableDefault: boolean;
}

export type AndroidBackHandlerConfig = WithCallback | WithDisable;

function isWithCallback(
  props: AndroidBackHandlerConfig,
): props is WithCallback {
  return Object.keys(props).some((key) => key === "handlePress");
}

export function useAndroidBackHandler(props: AndroidBackHandlerConfig) {
  const { enabled } = props;

  useEffect(() => {
    if (!enabled) return;

    const handler = BackHandler.addEventListener("hardwareBackPress", () => {
      if (isWithCallback(props)) {
        props.handlePress();
        return true;
      }

      return props.disableDefault;
    });

    return () => {
      handler.remove();
    };
  }, [enabled]);
}
