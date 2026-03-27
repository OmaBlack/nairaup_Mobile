import { useEffect, useState } from 'react';
import { useGetSavedJobsQuery } from 'src/services/redux/apis';
import { localStorageUtils } from 'src/utils/localstorage.utils';
import { NetworkResponse } from 'src/types/request.types';

export const useGetSavedJobsHybrid = (profileid: string) => {
  const { data: apiData, isFetching, refetch } = useGetSavedJobsQuery({
    profileid,
  });
  const [hybridData, setHybridData] = useState<NetworkResponse | undefined>(apiData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadHybridData = async () => {
      setLoading(true);
      try {
        // Get localStorage data
        const localData = await localStorageUtils.getSavedJobsLocally(
          parseInt(profileid),
        );

        // Merge API data with localStorage
        const apiIds = new Set(
          apiData?.data?.map((item: any) => item.jobid) || [],
        );
        const localOnlyJobs = localData.filter(
          (job: any) => !apiIds.has(job.jobid),
        );

        const merged: NetworkResponse = {
          code: apiData?.code || 200,
          status: apiData?.status || 'Ok',
          message: apiData?.message || 'Saved Jobs returned successfully',
          data: [
            ...(apiData?.data || []),
            ...localOnlyJobs.map((job: any) => ({
              jobid: job.jobid,
              jobpost: job.jobpost,
              profileid: job.profileid,
              createdat: job.createdat,
            })),
          ],
          meta: apiData?.meta,
        };

        setHybridData(merged);
      } catch (error) {
        console.error('Error loading hybrid data:', error);
        setHybridData(apiData);
      } finally {
        setLoading(false);
      }
    };

    loadHybridData();
  }, [apiData, profileid]);

  return {
    data: hybridData,
    isFetching: isFetching || loading,
    refetch,
  };
};
