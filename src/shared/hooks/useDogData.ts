import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  useFetchDogsMutation,
  useSearchDogsQuery,
} from "../../store/api/dogApi";
import { selectFilters } from "../../store/assets/selectors";
import { DogInfoObj } from "../types/CardObj";

const TOTAL_FROM = 10000;
const PAGE_TOTAL = 20;

export const useDogData = () => {
  const { selectedBreeds, radius, ageRange, sortBy, zipCode, from } =
    useSelector(selectFilters);

  // **Fetch dog IDs based on filters**
  const {
    data: dogIds,
    isFetching,
    isLoading,
  } = useSearchDogsQuery({
    breeds: selectedBreeds.length > 0 ? selectedBreeds : undefined,
    // zipCodes: zipCode ? [zipCode] : undefined,
    ageMin: ageRange[0],
    ageMax: ageRange[1],
    size: 50, // Fetch 50 dogs per request
    from: from
      ? from < TOTAL_FROM
        ? from?.toString()
        : (from - PAGE_TOTAL).toString()
      : undefined,
    sort:
      sortBy === "name-a-z"
        ? "name:asc"
        : sortBy === "name-z-a"
        ? "name:desc"
        : sortBy === "age-asc"
        ? "age:asc"
        : "age:desc",
  });

  const [fetchDogs] = useFetchDogsMutation();
  const [dogs, setDogs] = useState<DogInfoObj[]>([]);

  // Fetch full dog details when dog IDs are available
  useEffect(() => {
    const fetchDogDetails = async () => {
      if (!dogIds?.resultIds.length) {
        setDogs([]);
        return;
      }

      try {
        const fullDogs = await fetchDogs(dogIds.resultIds).unwrap();
        setDogs(fullDogs);
      } catch (error) {
        console.error("Error fetching dog details:", error);
      }
    };

    fetchDogDetails();
  }, [dogIds, fetchDogs]);

  return { dogs, isFetching: isFetching || isLoading, total: dogIds?.total };
};
