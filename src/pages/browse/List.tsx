import React from "react";
import { useDogData } from "../../shared/hooks/useDogData";
import { Filters } from "../../widgets/filters/Filters";
import List from "../../widgets/list/List";
import s from "./List.module.scss";

export default function Browse() {
  const { dogs, isFetching, total } = useDogData();

  return (
    <div className={s.container}>
      <Filters />
      <List items={dogs} isFetching={isFetching} total={total} />
    </div>
  );
}
