import { useState } from "react";
import { requestClan } from "src/services/request";
import { ProfileObjectType } from "src/types/app.types";
import { NetworkResponse } from "src/types/request.types";
import { useAppDispatch, useAppSelector } from "../useReduxHooks";
import {
  logout,
  updateUserData,
  updateUserProfileData,
} from "src/services/redux/slices/auth";

const useUser = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const updateProfile = async (
    data: Partial<ProfileObjectType> & {
      resumeurl?: string;
      portfoliourls?: string;
      mobile?: string;
    },
    hideToast?: boolean,
    cb = () => {},
  ): Promise<NetworkResponse> => {
    setLoading(true);
    const request: NetworkResponse = await requestClan({
      route: `/users`,
      type: "PATCH",
      data,
      toastTitle: "Update Profile",
      showToast: !hideToast,
    });
    cb();
    setLoading(false);
    if (request.code === 202) {
      if (data.mobile) {
        dispatch(
          updateUserData({
            ...user,
            mobile: data.mobile,
            profile: request.data,
          }),
        );
      } else dispatch(updateUserProfileData(request.data));
    }
    return request;
  };

  const deleteMyAccount = async (cb = () => {}): Promise<NetworkResponse> => {
    setLoading(true);
    const request: NetworkResponse = await requestClan({
      route: `/users`,
      type: "DELETE",
      toastTitle: "Delete Profile",
    });
    cb();
    setLoading(false);
    if (request.code === 200) dispatch(logout());
    return request;
  };

  return {
    loading,
    updateProfile,
    deleteMyAccount,
  };
};

export default useUser;
