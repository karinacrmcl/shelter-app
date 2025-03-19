import React, { PropsWithChildren, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectCurrentUser } from "../../../store/assets/selectors";
import { Path } from "../../constants/routes";

export function PrivateLayout({
  children,
}: PropsWithChildren<Record<string, unknown>>) {
  const navigate = useNavigate();
  const isLoggedIn = useSelector(selectCurrentUser);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate(Path.AUTH);
    }
  }, [isLoggedIn, navigate]);

  return <>{children}</>;
}
