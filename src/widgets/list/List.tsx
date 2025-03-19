import React, { useEffect, useState } from "react";
import { Chip, IconButton, Pagination } from "@mui/material";
import CardLayout from "../../shared/layouts/card/CardLayout";
import { DogInfoObj } from "../../shared/types/CardObj";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import PetsOutlinedIcon from "@mui/icons-material/PetsOutlined";
import s from "./List.module.scss";
import BrowseSkeleton from "../../shared/layouts/skeleton/BrowseSkeleton";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useFetchDogsMutation } from "../../store/api/dogApi";
import { useAppSelector, useDispatch } from "../../store/assets/hooks";
import {
  addFavourite,
  removeFavourite,
} from "../../store/slices/favouritesSlice";
import { selectFavourites } from "../../store/assets/selectors";
import { setFrom } from "../../store/slices/filtersSlice";
import { useMediaQuery } from "react-responsive";
import SearchOffIcon from "@mui/icons-material/SearchOff";

type Props = {
  items: DogInfoObj[];
  isFetching?: boolean;
  total?: number;
};

export default function List({ items, total, isFetching }: Props) {
  const totalPages = Math.ceil((total || 0) / 20); // 20 dogs per page
  const [updateDogFav] = useFetchDogsMutation();
  const dispatch = useDispatch();
  const { favouriteDogIds } = useAppSelector(selectFavourites);
  const [currentPage, setCurrentPage] = useState(1);
  const isMobile = useMediaQuery({ maxWidth: "760px" });
  const handleAddFavourite = (id: string) => {
    dispatch(addFavourite(id));
  };

  const handleRemoveFavourite = (id: string) => {
    dispatch(removeFavourite(id));
  };

  useEffect(() => {
    updateDogFav(favouriteDogIds);
  }, [favouriteDogIds]);

  const handleChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
    dispatch(setFrom(value * 20));
  };

  if (!items.length && !isFetching) {
    return (
      <div className={s.fallback}>
        <SearchOffIcon />
        <h2>Nothing found</h2>
        <p>No matching results found with your applied filters</p>
      </div>
    );
  }

  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        {isFetching && <BrowseSkeleton />}
        {!isFetching &&
          items?.map((item) => {
            return (
              <CardLayout key={item.id} className={s.card}>
                <IconButton
                  className={s.fav_button}
                  aria-label="favourite"
                  onClick={() => {
                    favouriteDogIds.includes(item.id)
                      ? handleRemoveFavourite(item.id)
                      : handleAddFavourite(item.id);
                  }}
                >
                  {favouriteDogIds.includes(item.id) ? (
                    <DeleteOutlineIcon />
                  ) : (
                    <FavoriteBorderIcon />
                  )}
                </IconButton>
                <img src={item.img} alt="dog-preview" />

                <div className={s.header}>
                  <h4>{item.name}</h4>
                  <p>
                    {item.age < 1
                      ? "A few months"
                      : `${item.age} year${item.age > 1 ? "s" : ""}`}
                  </p>
                </div>
                <div className={s.card_footer}>
                  <Chip
                    className={s.label}
                    icon={<PlaceOutlinedIcon />}
                    label={item.zip_code}
                  />
                  <Chip
                    className={s.label}
                    icon={<PetsOutlinedIcon />}
                    label={item.breed}
                  />
                </div>
              </CardLayout>
            );
          })}
      </div>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handleChange}
        color="primary"
        className={s.pagination}
        siblingCount={isMobile ? 0 : undefined}
      />
    </div>
  );
}
