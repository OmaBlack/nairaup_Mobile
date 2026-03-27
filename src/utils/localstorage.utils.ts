import AsyncStorage from '@react-native-async-storage/async-storage';

const SAVED_JOBS_KEY = 'nairaup_saved_jobs';
const SAVED_JOBS_TIMESTAMP_KEY = 'nairaup_saved_jobs_timestamp';

interface LocalSavedJob {
  jobid: number;
  jobpost: any;
  profileid: number;
  createdat: string;
}

export const localStorageUtils = {
  // Save job to local storage
  async saveJobLocally(jobid: number, jobpost: any, profileid: number) {
    try {
      const savedJobs = await this.getSavedJobsLocally(profileid);
      
      // Check if job already exists
      const exists = savedJobs.some(job => job.jobid === jobid);
      if (exists) return;
      
      const newJob: LocalSavedJob = {
        jobid,
        jobpost,
        profileid,
        createdat: new Date().toISOString(),
      };
      
      savedJobs.push(newJob);
      await AsyncStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(savedJobs));
      await AsyncStorage.setItem(SAVED_JOBS_TIMESTAMP_KEY, new Date().toISOString());
    } catch (error) {
      console.error('Error saving job to localStorage:', error);
    }
  },

  // Get all saved jobs from local storage for a profile
  async getSavedJobsLocally(profileid: number): Promise<LocalSavedJob[]> {
    try {
      const data = await AsyncStorage.getItem(SAVED_JOBS_KEY);
      if (!data) return [];
      
      const allSavedJobs: LocalSavedJob[] = JSON.parse(data);
      return allSavedJobs.filter(job => job.profileid === profileid);
    } catch (error) {
      console.error('Error getting saved jobs from localStorage:', error);
      return [];
    }
  },

  // Clear all saved jobs from local storage
  async clearSavedJobsLocally() {
    try {
      await AsyncStorage.removeItem(SAVED_JOBS_KEY);
      await AsyncStorage.removeItem(SAVED_JOBS_TIMESTAMP_KEY);
    } catch (error) {
      console.error('Error clearing saved jobs from localStorage:', error);
    }
  },

  // Remove a specific saved job from local storage
  async removeSavedJobLocally(jobid: number, profileid: number) {
    try {
      const savedJobs = await this.getSavedJobsLocally(profileid);
      const filtered = savedJobs.filter(job => job.jobid !== jobid);
      await AsyncStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error removing saved job from localStorage:', error);
    }
  },
};
