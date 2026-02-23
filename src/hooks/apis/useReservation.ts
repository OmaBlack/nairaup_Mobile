import { useState } from "react";
import { requestClan } from "src/services/request";
import { NetworkResponse } from "src/types/request.types";
import { MakeReservationType } from "src/types/reservation.types";
import { useAppDispatch } from "../useReduxHooks";
import { reduxApiRequests } from "src/services/redux/apis";

const useReservation = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const makeReservation = async (
    data: MakeReservationType,
    cb = () => {},
  ): Promise<NetworkResponse> => {
    setLoading(true);
    const request: NetworkResponse = await requestClan({
      route: `/reservations`,
      type: "POST",
      data,
    });
    cb();
    setLoading(false);
    return request;
  };

  const checkInOut = async (
    id: number,
    data: {
      type: "checkin" | "checkout";
    },
    propertyId: number,
    cb = () => {},
  ): Promise<NetworkResponse> => {
    setLoading(true);
    const request: NetworkResponse = await requestClan({
      route: `/reservations/checkinout/${id}`,
      type: "PATCH",
      data,
    });
    cb();
    dispatch(
      reduxApiRequests.endpoints.getActiveReservation.initiate(propertyId, {
        forceRefetch: true,
        subscribe: true,
      }),
    );
    setLoading(false);
    return request;
  };

  return {
    loading,
    makeReservation,
    checkInOut,
  };
};

export default useReservation;
