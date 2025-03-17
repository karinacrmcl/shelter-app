import React, { PropsWithChildren, useEffect } from "react";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

export function PrivateLayout({
  children,
}: PropsWithChildren<Record<string, unknown>>) {
  const { isLoading, isError } = useGetCurrentUserQuery();
  const isAuth = useSelector(selectIsAuth);
  const navigate = useNavigate();

  if (isLoading) return <Loader styles={centeredLoader} size={150} />;
  if (isError || !isAuth) {
    navigate("/signin");
    return null;
  }

  return <>{children}</>;
}
