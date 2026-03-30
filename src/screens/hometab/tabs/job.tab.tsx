import React, { useCallback, useMemo, useState, useEffect } from "react";
import { ActivityIndicator, StyleSheet, View, FlatList } from "react-native";
import { RootStackScreenProps } from "src/types/navigation.types";
import { ScrollView, Text, TouchableText } from "src/components/themed.components";
import layoutConstants from "src/constants/layout.constants";
import fontUtils from "src/utils/font.utils";
import { Input, SelectInput } from "src/components/inputs.components";
import { Feather } from "@expo/vector-icons";
import { JobListingHorizontalItem } from "src/components/jobs.components";
import { Button } from "src/components/buttons.components";
import { colorPrimary, colorWhite } from "src/constants/colors.constants";
import { JobObjectType } from "src/types/jobs.types";
import { AppRefreshControl } from "src/components/refreshcontrol.component";
import { useDebounce } from "use-debounce";
import { PAGE_FILTERS, PRICE_RANGES } from "src/constants/app.constants";
import {
  useGetJobsQuery,
  useGetJobTypesAndModesQuery,
} from "src/services/redux/apis/unauth.api.requests";
import {
  useGetNigeriaStates,
  useGetNigeriaCities,
  getStateNameById,
} from "src/hooks/useNigeriaLocations";
import { usePage } from "src/providers/page.provider";

export default function JobsTabScreen({
  navigation,
  route,
  withSearch = true,
}: RootStackScreenProps<"HomeTabNavigator" | "ExploreTabNavigator"> & {
  withSearch?: boolean;
}) {
  const [searchText, setSearchText] = useState("");
  const [pageFilter, setPageFilter] = useState("jobs");
  const [searchValue] = useDebounce(searchText, 1000);
  const [worktype, setWorkType] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState(""); // No default state selection
  const [range, setRange] = useState("");

  // Get states data from local constants
  const { isLoading: loadingStates, data: statesData } = useGetNigeriaStates();
  
  // Get state name for cities query
  const selectedStateName = getStateNameById(state);
  
  // Get cities based on selected state
  const { isFetching: fetchingCities, data: citiesData } = useGetNigeriaCities(selectedStateName);

  // Clear all filters
  const clearFilters = () => {
    setState("");
    setCity("");
    setWorkType("");
    setRange("");
  };

  const { data: jobTypesAndModesData, isLoading: loadingTypes } =
    useGetJobTypesAndModesQuery(null);

  const jobTypes = useMemo(() => {
    return jobTypesAndModesData?.data?.types || [];
  }, [jobTypesAndModesData]);

  const { isFetching, data, refetch } = useGetJobsQuery({
    role: searchValue !== "" ? searchValue : undefined,
    featured: 0,
    //@ts-ignore
    worktype: worktype !== "" ? worktype : undefined,
    minsalary: range !== "" ? range : undefined,
    city: city.length > 0 ? city : undefined,
  });

  const {
    isFetching: fetchingFeatured,
    data: featuredJobs,
    refetch: fetchFeatured,
  } = useGetJobsQuery({
    role: searchValue !== "" ? searchValue : undefined,
    featured: 1,
    //@ts-ignore
    worktype: worktype !== "" ? worktype : undefined,
    minsalary: range !== "" ? range : undefined,
    city: city !== "" ? city : undefined,
  });

  const onRefresh = () => {
    refetch();
    fetchFeatured();
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <AppRefreshControl
          refreshing={isFetching || fetchingFeatured}
          onRefresh={onRefresh}
        />
      }
    >
      {withSearch ? (
        <Input
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search for jobs"
          leftIcon={
            <Feather
              name="search"
              style={{ marginLeft: fontUtils.w(15) }}
              size={fontUtils.h(20)}
              color={"rgba(0, 0, 0, 0.5)"}
            />
          }
          inputHeight={fontUtils.h(40)}
          rightIcon={
            isFetching || fetchingFeatured ? (
              <ActivityIndicator color={colorPrimary} />
            ) : undefined
          }
        />
      ) : (
        <View>
          <View style={styles.headerViewStyle}>
            <View
              style={[
                layoutConstants.styles.rowView,
                layoutConstants.styles.justifyContentBetween,
                { alignItems: "center" },
              ]}
            >
              <Text
                fontFamily={fontUtils.manrope_semibold}
                size={fontUtils.h(15)}
              >
                Explore
              </Text>
              {(state !== "" || city !== "" || worktype !== "" || range !== "") && (
                <TouchableText
                  onPress={clearFilters}
                  style={{
                    paddingHorizontal: fontUtils.w(10),
                    paddingVertical: fontUtils.h(5),
                  }}
                >
                  <Text
                    fontFamily={fontUtils.manrope_semibold}
                    size={fontUtils.h(12)}
                    color={colorPrimary}
                  >
                    Clear filters
                  </Text>
                </TouchableText>
              )}

              <SelectInput
                items={PAGE_FILTERS}
                value={pageFilter}
                onSelectItem={(e: any) => setPageFilter(e?.value)}
                placeholder="Jobs"
                listMode="MODAL"
                wrapperStyle={{
                  width: fontUtils.w(160),
                  zIndex: 4,
                }}
              />
            </View>
            <View style={styles.filtersViewStyle}>
              <SelectInput
                items={jobTypes}
                value={worktype}
                onSelectItem={(e: any) => setWorkType(e?.value)}
                placeholder="Job type"
                listMode="MODAL"
                wrapperStyle={{
                  marginBottom: fontUtils.h(10),
                  zIndex: 3,
                }}
              />
              <View style={[layoutConstants.styles.rowView]}>
                <SelectInput
                  items={statesData?.data || []}
                  value={state}
                  loading={loadingStates}
                  schema={{
                    id: "id",
                    value: "id",
                    label: "name",
                  }}
                  onSelectItem={(e: any) => setState(e.id)}
                  placeholder="State"
                  listMode="MODAL"
                  searchable
                  searchPlaceholder="State"
                  labelProps={{
                    numberOfLines: 1,
                  }}
                  wrapperStyle={{
                    flex: 1,
                    marginRight: fontUtils.w(5),
                    zIndex: 2,
                  }}
                />
                <SelectInput
                  items={citiesData?.data || []}
                  value={city}
                  loading={fetchingCities}
                  schema={{
                    id: "id",
                    value: "name",
                    label: "name",
                  }}
                  onSelectItem={(e: any) => setCity(e.name)}
                  placeholder="City"
                  listMode="MODAL"
                  searchable
                  searchPlaceholder="City"
                  labelProps={{
                    numberOfLines: 1,
                  }}
                  wrapperStyle={{
                    flex: 1,
                    marginRight: fontUtils.w(5),
                    zIndex: 2,
                  }}
                />
              </View>
              <SelectInput
                items={PRICE_RANGES.jobs_salary_range}
                value={range}
                onSelectItem={(e: any) => setRange(e.value)}
                placeholder="Salary range"
                listMode="MODAL"
                wrapperStyle={{
                  zIndex: 2,
                  marginTop: fontUtils.h(10),
                }}
              />
            </View>
          </View>
          <Button
            title={"Search"}
            icon={
              <Feather
                name="search"
                size={fontUtils.h(18)}
                color={colorWhite}
              />
            }
            buttonHeight={fontUtils.h(40)}
            titleStyle={{
              fontFamily: fontUtils.manrope_regular,
              fontSize: fontUtils.h(12),
            }}
            wrapperStyle={{
              alignSelf: "center",
              width: fontUtils.w(130),
              marginBottom: fontUtils.h(20),
            }}
          />
        </View>
      )}
      <Text
        size={fontUtils.h(12)}
        fontFamily={fontUtils.manrope_bold}
        mb={fontUtils.h(15)}
      >
        Featured Jobs
      </Text>
      {/* <Text mb={fontUtils.h(15)} size={fontUtils.h(10)}>
        Lagos, Nigeria
      </Text> */}
      {(featuredJobs?.data || []).map((item: JobObjectType, index: number) => (
        <JobListingHorizontalItem key={`featured-${index}`} {...item} />
      ))}
      <Text
        size={fontUtils.h(12)}
        fontFamily={fontUtils.manrope_bold}
        mb={fontUtils.h(15)}
        mt={fontUtils.h(30)}
      >
        Top Jobs for You
      </Text>
      {(data?.data || []).map((item: JobObjectType, index: number) => (
        <JobListingHorizontalItem key={`job-${index}`} {...item} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: layoutConstants.mainViewHorizontalPadding,
  },
  headerViewStyle: {
    marginTop: fontUtils.h(40),
    marginBottom: fontUtils.h(20),
  },
  filtersViewStyle: {
    marginTop: fontUtils.h(20),
  },
});
