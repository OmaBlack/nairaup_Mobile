import { ProfileObjectType } from "./app.types";

export type JobworkModeType = "onsite" | "remote";

export type JobworkType = "contract" | "fulltime" | "parttime";

export type JobStatusType = "draft" | "archived" | "closed" | "opened";

export type JobApplicationStatusType =
  | "accepted"
  | "cancelled"
  | "pending"
  | "rejected"
  | "viewed";

export type JobObjectType = {
  id: number;
  profileid: number;
  role: string;
  description: string;
  address: string;
  city: string;
  state: string;
  qualifications: string[];
  requirements: string[];
  company: string;
  minsalary: string;
  maxsalary: string;
  workmode: JobworkModeType;
  worktype: JobworkModeType;
  status: JobStatusType;
  openings: number;
  currency: string;
  createdat?: string;
  updatedat?: string;
  deletedat?: string | null;
  deleted?: boolean;
  profile: Partial<ProfileObjectType>;
  featured?: boolean;
  aboutcompany?: string;
};

export type CreateJobDto = {
  role: string;
  description: string;
  requirements: string[];
  qualifications: string[];
  address: string;
  city: string;
  state: string;
  company: string;
  minsalary: string;
  maxsalary: string;
  currency?: string;
  workmode: JobworkModeType;
  worktype: JobworkType;
  openings?: number;
};

export type ApplyForJobDto = {
  jobid: number;
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  address: string;
  resumeurl: string;
  coverletter?: string;
};
