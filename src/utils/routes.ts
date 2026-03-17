import { createBrowserRouter } from "react-router";
import { Dashboard } from "../components/Dashboard";
import { Partners } from "../components/Partners";
import { PartnerDetail } from "../components/PartnerDetail";
import { Contracts } from "../components/Contracts";
import { ContractDetail } from "../components/ContractDetail";
import { Invoices } from "../components/Invoices";
import { Analytics } from "../components/Analytics";
import { ActivityLog } from "../components/ActivityLog";
import { Layout } from "../components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "partners", Component: Partners },
      { path: "partners/:id", Component: PartnerDetail },
      { path: "contracts", Component: Contracts },
      { path: "contracts/:id", Component: ContractDetail },
      { path: "invoices", Component: Invoices },
      { path: "analytics", Component: Analytics },
      { path: "activity", Component: ActivityLog },
    ],
  },
]);