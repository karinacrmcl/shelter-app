import React, { Suspense } from "react";
import { Outlet, useRoutes } from "react-router";
import { Path } from "../shared/constants/routes";
import { PageLayout } from "../shared/layouts/page/PageLayout";
import User from "./user/User";
import Auth from "./auth/Auth";
import Header from "../widgets/header/Header";
import Browse from "./browse/List";
import { PrivateLayout } from "../shared/layouts/private/PrivateLayout";
import { PublicLayout } from "../shared/layouts/public/PublicLayout";
import Favourites from "./favourites/Favourites";
// import Header from "../widgets/header/Header";

type RouteType = {
  path?: Path | "*";
  element: React.ReactElement;
  children?: RouteType[];
};

export default function Routing() {
  const routes: RouteType = {
    element: (
      <>
        {/* <ModalRoot /> */}
        <PrivateLayout>
          <PageLayout>
            {/* <Websocket /> */}
            <Header />
            <Outlet />
          </PageLayout>
        </PrivateLayout>
      </>
    ),
    children: [
      { path: Path.LIST, element: <Browse /> },
      { path: Path.USER, element: <User /> },
      { path: Path.FAVOURITES, element: <Favourites /> },
    ],
  };

  const routesNoAuth: RouteType = {
    element: (
      <>
        {/* <ModalRoot /> */}
        <PublicLayout>
          <PageLayout>
            {/* <Websocket /> */}
            {/* <Header /> */}
            <Outlet />
          </PageLayout>
        </PublicLayout>
      </>
    ),
    children: [{ path: Path.AUTH, element: <Auth /> }],
  };

  const routing = useRoutes([routes, routesNoAuth]);

  return (
    <Suspense
    // fallback={<PreviewLoader />}
    >
      {routing}
    </Suspense>
  );
}
