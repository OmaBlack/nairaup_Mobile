import { createSlice } from "@reduxjs/toolkit";
import { produce } from "immer";

const jobs: {
  appliedIds: number[];
  savedIds: number[];
  appliedJobs: object;
} = {
  appliedIds: [],
  savedIds: [],
  appliedJobs: {},
};

export const jobsSlice = createSlice({
  name: "jobs",
  initialState: jobs,
  reducers: {
    saveAppliedJobs: (state, action) => {
      state = produce(state, (draft) => {
        draft.appliedIds = action.payload.ids;
        draft.appliedJobs = action.payload.jobs;
      });
      return state;
    },
    updateAppliedJobs: (state, action) => {
      state = produce(state, (draft) => {
        draft.appliedIds.push(...action.payload.ids);
        draft.appliedJobs = {
          ...state.appliedJobs,
          ...action.payload.jobs,
        };
      });
      return state;
    },
    saveSavedJobs: (state, action) => {
      state = produce(state, (draft) => {
        draft.savedIds = action.payload;
      });
      return state;
    },
    updateSavedJobs: (state, action) => {
      state = produce(state, (draft) => {
        draft.savedIds.push(...action.payload);
      });
      return state;
    },
  },
});

export const {
  saveAppliedJobs,
  updateAppliedJobs,
  saveSavedJobs,
  updateSavedJobs,
} = jobsSlice.actions;

export default jobsSlice.reducer;
