import { useState } from "react";
import { requestClan } from "src/services/request";
import { NetworkResponse } from "src/types/request.types";

const useNotifications = () => {
  const [loading, setLoading] = useState(false);

  const markNotificationsRead = async (
    ids: number[],
    cb = () => {},
  ): Promise<NetworkResponse> => {
    setLoading(true);
    const request: NetworkResponse = await requestClan({
      route: `/notifications`,
      type: "PATCH",
      data: {
        ids,
      },
      showToast: false,
    });
    cb();
    setLoading(false);
    return request;
  };

  return {
    loading,
    markNotificationsRead,
  };
};

export default useNotifications;
