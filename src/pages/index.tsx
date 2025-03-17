import React, { Suspense } from "react";
import { Outlet, useRoutes } from "react-router";
import { Path } from "../shared/constants/routes";
import { PageLayout } from "../shared/layouts/page/PageLayout";
import List from "./browse/List";
import User from "./user/User";
import Auth from "./auth/Auth";
// import Header from "../widgets/header/Header";

type RouteType = {
  path?: Path | "*";
  element: React.ReactElement;
  children?: RouteType[];
};

export default function Routing() {
  const routes: RouteType[] = [
    {
      element: (
        <>
          {/* <ModalRoot /> */}
          <PageLayout>
            {/* <Websocket /> */}
            {/* <Header /> */}
            <Outlet />
          </PageLayout>
        </>
      ),
      children: [
        { path: Path.LIST, element: <List /> },
        { path: Path.USER, element: <User /> },
        { path: Path.AUTH, element: <Auth /> },
      ],
    },
  ];

  const routing = useRoutes(routes);

  return (
    <Suspense
    // fallback={<PreviewLoader />}
    >
      {routing}
    </Suspense>
  );
}
