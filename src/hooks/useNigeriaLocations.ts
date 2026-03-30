import { useMemo } from "react";
import STATES_LGAS from "src/constants/states.lgas.constants";
import { CITIES_IN_NIGERIA } from "src/constants/location.constants";

/**
 * Hook to get Nigeria states
 */
export const useGetNigeriaStates = () => {
  const statesData = useMemo(() => {
    return STATES_LGAS.map((state, index) => ({
      id: String(index + 1), // Generate id starting from 1
      name: state.state,
      alias: state.alias,
      label: state.state,
      value: String(index + 1),
    }));
  }, []);

  return {
    isLoading: false,
    isFetching: false,
    data: {
      code: 200,
      status: "success",
      message: "Success",
      data: statesData,
    },
  };
};

/**
 * Hook to get cities based on selected state
 */
export const useGetNigeriaCities = (stateName?: string) => {
  const citiesData = useMemo(() => {
    if (!stateName) {
      return [];
    }

    // Find the state and get cities for it
    const citiesForState = CITIES_IN_NIGERIA.filter(
      (city) => city.state === stateName
    ).map((city) => ({
      id: city.value || city.city,
      name: city.city,
      label: city.city,
      value: city.city,
      state: city.state,
    }));

    return citiesForState;
  }, [stateName]);

  return {
    isFetching: false,
    isLoading: false,
    data: {
      code: 200,
      status: "success",
      message: "Success",
      data: citiesData,
    },
  };
};

/**
 * Get state name by ID
 */
export const getStateNameById = (stateId: string): string => {
  const index = parseInt(stateId) - 1; // IDs start from 1
  if (index >= 0 && index < STATES_LGAS.length) {
    return STATES_LGAS[index].state;
  }
  return "";
};
