import { useEffect, useState } from "react";
import { useAppSelector } from "../redux/hooks";
import { selectConfigData } from "../redux/config/configSlice";

export interface AppConfiguration {
  clientId: string;
  authApiBaseUrl: string;
  notificationApiBaseUrl: string;
  videoApiBaseUrl: string;
  pubnubPublishKey: string;
  pubnubSubscribeKey: string;
  notificationChannelUuid: string;
  chatChannelUuid: string;
  vonageApiKey: string;
}

const useConfig = () => {
  const [config, setConfig] = useState<AppConfiguration>(
    {} as AppConfiguration
  );
  const configData = useAppSelector(selectConfigData);

  useEffect(() => {
    if (configData) {
      const newConfig: AppConfiguration = {
        ...configData,
      };
      setConfig({ ...newConfig });
    }
  }, [configData]);

  return { config };
};

export default useConfig;
