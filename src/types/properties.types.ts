import { ColorValue } from "react-native";
import { ProfileObjectType } from "./app.types";

export type PropertyCategoryType = "lease" | "rent" | "sale";

export type PropertyType = "apartment" | "hotel" | "land" | "shortlet";

export type PropertyStatusType =
  | "archived"
  | "draft"
  | "listed"
  | "sold"
  | "rejected";

export type CreatePropertyDto = {
  title: string;
  description: string;
  city: string;
  state: string;
  address: string;
  landmark: string;
  geocode: string;
  price?: string;
  featuredimageurl?: string;
  imageurls?: string;
  documents: {
    title: string;
    documenturl: string;
  }[];
  category: PropertyCategoryType;
  type: PropertyType;
  featureids: number[];
  rooms?: AddPropertyRoomDto[];
  marksold?: boolean;
};

export type AddPropertyRoomDto = {
  title: string;
  description: string;
  price: string;
  featuredimageurl?: string;
  imageurls?: string;
  totalrooms: number;
  featureids: number[];
};

export type PropertyObjectType = {
  id: number;
  profileid: number;
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  landmark: string;
  geocode: string;
  price: string;
  featuredimageurl: string;
  imageurls: string;
  documents: {
    title: string;
    documenturl: string;
  }[];
  category: PropertyCategoryType;
  type: PropertyType;
  status: PropertyStatusType;
  featureids: number[];
  totalrooms: number;
  createdat: string;
  updatedat: string;
  deletedat: string | null;
  deleted: boolean;
  profile: Partial<ProfileObjectType>;
  averagerating?: number;
  averagehospitalityrating?: number;
  averagecustomerservicerating?: number;
  averagecleanlinessrating?: number;
  totalrating?: number;
  features: PropertyFeatureType[];
  propertyrooms?: AddPropertyRoomDto[];
};

export type PropertyFeatureType = {
  id: number;
  feature: string;
  slug: string;
  color: ColorValue;
  createdat?: string;
  updatedat?: string;
  deletedat?: string | null;
  deleted?: boolean;
};
