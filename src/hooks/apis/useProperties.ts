import { useState } from "react";
import { requestClan } from "src/services/request";
import {
  AddPropertyRoomDto,
  CreatePropertyDto,
} from "src/types/properties.types";
import { NetworkResponse } from "src/types/request.types";

const useProperties = () => {
  const [loading, setLoading] = useState(false);

  const checkTitleAvailability = async (
    data: Partial<CreatePropertyDto>,
    hideToast?: boolean,
    cb = () => {},
  ): Promise<NetworkResponse> => {
    setLoading(true);
    const request: NetworkResponse = await requestClan({
      route: `/properties/title/availabilty`,
      type: "POST",
      data,
      showToast: !hideToast,
    });
    cb();
    setLoading(false);
    return request;
  };

  const createProperty = async (
    data: CreatePropertyDto,
    cb = () => {},
  ): Promise<NetworkResponse> => {
    setLoading(true);
    const request: NetworkResponse = await requestClan({
      route: `/properties`,
      type: "POST",
      data,
    });
    cb();
    setLoading(false);
    return request;
  };

  const updateProperty = async (
    id: number,
    data: Partial<CreatePropertyDto>,
    cb = () => {},
  ): Promise<NetworkResponse> => {
    setLoading(true);
    const request: NetworkResponse = await requestClan({
      route: `/properties/${id}`,
      type: "PATCH",
      data,
    });
    cb();
    setLoading(false);
    return request;
  };

  const deleteProperty = async (
    data: {
      ids: number[];
    },
    cb = () => {},
  ): Promise<NetworkResponse> => {
    setLoading(true);
    const request: NetworkResponse = await requestClan({
      route: `/properties`,
      type: "DELETE",
      data,
    });
    cb();
    setLoading(false);
    return request;
  };

  const addRoom = async (
    data: {
      id: number;
      rooms: AddPropertyRoomDto[];
    },
    cb = () => {},
  ): Promise<NetworkResponse> => {
    setLoading(true);
    const request: NetworkResponse = await requestClan({
      route: `/properties/rooms/${data.id}`,
      type: "POST",
      data,
    });
    cb();
    setLoading(false);
    return request;
  };

  return {
    loading,
    createProperty,
    updateProperty,
    addRoom,
    checkTitleAvailability,
    deleteProperty,
  };
};

export default useProperties;
