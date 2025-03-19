import React, { PropsWithChildren, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../store/assets/hooks";
import { selectCurrentUser } from "../../../store/assets/selectors";
import { Path } from "../../constants/routes";

export function PublicLayout({
  children,
}: PropsWithChildren<Record<string, unknown>>) {
  const navigate = useNavigate();
  const isLoggedIn = useAppSelector(selectCurrentUser);

  useEffect(() => {
    if (isLoggedIn) {
      navigate(Path.LIST);
    }
  }, [isLoggedIn, navigate]);

  return <>{children}</>;
}
