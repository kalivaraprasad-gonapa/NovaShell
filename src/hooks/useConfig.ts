// hooks/useConfig.ts
import { useCallback, useEffect, useState } from "react";
import { IConfigProvider } from "../core/interfaces/ICommand";

export function useConfig<T>(
  configProvider: IConfigProvider<T>,
): [T, (config: Partial<T>) => Promise<void>] {
  const [config, setConfigState] = useState<T | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadConfig = async () => {
      const config = await configProvider.getConfig();
      if (isMounted) {
        setConfigState(config);
      }
    };

    loadConfig();

    const unsubscribe = configProvider.onChange((updatedConfig) => {
      if (isMounted) {
        setConfigState(updatedConfig);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [configProvider]);

  const updateConfig = useCallback(
    async (partialConfig: Partial<T>) => {
      await configProvider.setConfig(partialConfig);
    },
    [configProvider],
  );

  return [config!, updateConfig];
}
