import { TanStackDevtools } from "@tanstack/react-devtools";
import { FormDevtoolsPanel } from "@tanstack/react-form-devtools";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TableDevtoolsPanel } from "@tanstack/react-table-devtools";

import PageTransition from "@/PageTransition";
const RootLayout = () => (
  <>
    <PageTransition>
      <Outlet />
    </PageTransition>
    <TanStackDevtools
      plugins={[
        {
          name: "Query",
          render: <ReactQueryDevtoolsPanel />,
        },
        {
          name: "Form",
          render: <FormDevtoolsPanel />,
        },
        {
          name: "Table",
          render: <TableDevtoolsPanel />,
        },
        {
          name: "Router",
          render: <TanStackRouterDevtoolsPanel />,
        },
      ]}
    />
  </>
);

export const Route = createRootRoute({ component: RootLayout });
