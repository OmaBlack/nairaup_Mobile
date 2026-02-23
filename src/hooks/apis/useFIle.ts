import { AxiosProgressEvent } from "axios";
import { useState } from "react";
import { requestClan } from "src/services/request";
import { NetworkResponse } from "src/types/request.types";

export const useFileUpload = () => {
  const [loading, setLoading] = useState(false);
  const uploadFile = async (
    data: FormData,
    hideToast?: boolean,
    onUpload = (progress: number) => {},
    cb = () => {},
  ): Promise<NetworkResponse> => {
    setLoading(true);
    const request = await requestClan({
      route: "/helpers/upload/file",
      type: "POST",
      data,
      isDefaultAuth: true,
      contentType: "multipart/form-data",
      uploadCb: (progressEvent: AxiosProgressEvent | any) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent?.total,
        );
        onUpload(percentCompleted);
      },
      showToast: !hideToast,
    });
    setLoading(false);
    cb();
    return request;
  };
  return { uploadFile, loading };
};
