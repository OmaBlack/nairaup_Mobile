import { useState } from "react";
import { requestClan } from "src/services/request";
import { ApplyForJobDto, CreateJobDto } from "src/types/jobs.types";
import { NetworkResponse } from "src/types/request.types";
import { useAppDispatch, useAppSelector } from "../useReduxHooks";
import { reduxApiRequests } from "src/services/redux/apis";
import {
  updateAppliedJobs,
  updateSavedJobs,
} from "src/services/redux/slices/jobs";

const useJobs = () => {
  const dispatch = useAppDispatch();
  const { profile } = useAppSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);

  const createJob = async (
    data: CreateJobDto,
    cb = () => {},
  ): Promise<NetworkResponse> => {
    setLoading(true);
    const request: NetworkResponse = await requestClan({
      route: `/jobs`,
      type: "POST",
      data,
    });
    cb();
    setLoading(false);
    return request;
  };

  const applyForJob = async (
    data: ApplyForJobDto,
    cb = () => {},
  ): Promise<NetworkResponse> => {
    setLoading(true);
    const request: NetworkResponse = await requestClan({
      route: `/jobs/applications`,
      type: "POST",
      data,
    });
    cb();
    setLoading(false);
    if (request.code === 201) {
      const jobid = data.jobid;
      dispatch(
        updateAppliedJobs({
          ids: [jobid],
          jobs: [
            {
              [jobid]: request.data,
            },
          ],
        }),
      );
      dispatch(
        reduxApiRequests.endpoints.getJobsApplications.initiate(
          {
            jobid: `${data.jobid}`,
            profileid: `${profile.id}`,
          },
          {
            forceRefetch: true,
            subscribe: true,
          },
        ),
      );
    }
    return request;
  };

  const saveJob = async (
    id: number,
    cb = () => {},
  ): Promise<NetworkResponse> => {
    setLoading(true);
    const request: NetworkResponse = await requestClan({
      route: `/jobs/save`,
      type: "POST",
      data: {
        id,
      },
    });
    cb();
    setLoading(false);
    if (request.code === 201) {
      dispatch(updateSavedJobs([id]));
      dispatch(
        reduxApiRequests.endpoints.getSavedJobs.initiate(
          {
            id: `${id}`,
            profileid: `${profile.id}`,
          },
          {
            forceRefetch: true,
            subscribe: true,
          },
        ),
      );
    }
    return request;
  };

  return {
    loading,
    createJob,
    applyForJob,
    saveJob,
  };
};

export default useJobs;
