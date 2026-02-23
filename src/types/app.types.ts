export type themeType = "light" | "dark";

export type ReduxAuthState = {
  token: string | undefined | null;
  user: UserObjectType;
};

export type UserObjectType = {
  id: number;
  createdat: string;
  deleted: boolean;
  deletedat: string | null;
  emailverified: boolean;
  mobileverified: boolean;
  deviceid: string | null;
  biometricsloginenabled: boolean;
  mobile: string;
  email: string;
  profile: ProfileObjectType;
  status: UserStatus;
  updatedat: string;
  lastlogin: string;
};

type UserStatus = "active" | "inactive" | "pending" | "suspended" | "disabled";

export type ProfileObjectType = {
  createdat: string;
  deleted: boolean;
  deletedat: string | null;
  firstname: string;
  id: number;
  lastname: string;
  updatedat: string;
  userid: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  geolocation?: string;
  landmark?: string;
  avatarurl?: string;
  profiletype: "user";
  pushnotificationtoken?: string;
  description: string | null;
  dateofbirth: string | null;
  gender: "other" | "male" | "female";
  kyclevel: number;
  referralcode: string;
  virtualaccount: null;
  yearsofexperience?: number;
  profession?: string;
  averagerating: number;
  totalrating: number;
  verified: boolean;
};
