import { useState } from "react";
import { requestClan } from "src/services/request";
import { NetworkResponse } from "src/types/request.types";
import { useAppDispatch } from "../useReduxHooks";
import { updateUserProfileData } from "src/services/redux/slices/auth";

const useRate = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const rateUser = async (
    data: {
      note: string;
      recipientid: number;
      rating: number;
    },
    cb = () => {},
  ): Promise<NetworkResponse> => {
    setLoading(true);
    const request: NetworkResponse = await requestClan({
      route: `/reviews`,
      type: "POST",
      data,
      toastTitle: "Rating",
    });
    cb();
    setLoading(false);
    if (request.code === 202) dispatch(updateUserProfileData(request.data));
    return request;
  };

  return {
    loading,
    rateUser,
  };
};

export default useRate;
