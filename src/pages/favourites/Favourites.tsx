import { useAppSelector } from "../../store/assets/hooks";
import { selectFavourites } from "../../store/assets/selectors";
import List from "../../widgets/list/List";
import MatchNudge from "../../widgets/match-nudge/MatchNudge";
import s from "./Favourites.module.scss";

export default function Favourites() {
  const { favouriteDogIds, favouriteDogs } = useAppSelector(selectFavourites);

  return (
    <div className={s.container}>
      <MatchNudge />
      <List
        items={favouriteDogs?.filter((d) => favouriteDogIds.includes(d.id))}
        className={s.list}
      />
    </div>
  );
}
