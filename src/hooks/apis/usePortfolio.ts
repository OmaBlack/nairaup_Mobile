import { useState } from "react";
import { requestClan } from "src/services/request";
import { NetworkResponse } from "src/types/request.types";

const usePortfolio = () => {
  const [loading, setLoading] = useState(false);

  const deletePortolio = async (
    data: {
      ids: number[];
    },
    cb = () => {},
  ): Promise<NetworkResponse> => {
    setLoading(true);
    const request: NetworkResponse = await requestClan({
      route: `/portfolios`,
      type: "DELETE",
      data,
      toastTitle: "Delete Portolio Item(s)",
    });
    cb();
    setLoading(false);
    return request;
  };

  return {
    loading,
    deletePortolio,
  };
};

export default usePortfolio;
