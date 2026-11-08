import PageTransition from "@/PageTransition";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { FormDevtoolsPanel } from "@tanstack/react-form-devtools";
import { TableDevtoolsPanel } from "@tanstack/react-table-devtools";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
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
