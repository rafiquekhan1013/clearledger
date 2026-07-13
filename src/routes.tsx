import type { RouteObject } from "react-router";
import GuestGuard from "./components/GuestGuard";
import AuthGuard from "./components/AuthGuard";
import PageLayout from "./components/PageLayout";
import { Content } from "./components/Content";
import Support from "./components/Support";
import ForgotPassword from "./pages/login/ForgotPassword";
import ResetPassword from "./pages/login/ResetPassword";
import Account from "./pages/account/Account";
import Home from "./pages/Home";
import Terms from "./pages/Terms";
import Survey from "./pages/survey/Survey";
import Studies from "./pages/Studies";

const routes: RouteObject[] = [
  { path: "/", element: <Home /> },
  {
    path: "/forgot-password",
    element: (
      <PageLayout maxWidth="md">
        <GuestGuard>
          <ForgotPassword />
        </GuestGuard>
      </PageLayout>
    ),
  },
  {
    path: "/reset-password/:token",
    element: (
      <PageLayout maxWidth="md">
        <GuestGuard>
          <ResetPassword />
        </GuestGuard>
      </PageLayout>
    ),
  },
  {
    path: "/account",
    element: (
      <PageLayout maxWidth="md">
        <AuthGuard>
          <Account />
        </AuthGuard>
      </PageLayout>
    ),
  },
  {
    path: "/support",
    element: (
      <PageLayout>
        <Support />
      </PageLayout>
    ),
  },
  {
    path: "/terms",
    element: (
      <PageLayout>
        <Terms />
      </PageLayout>
    ),
  },
  {
    path: "/survey",
    element: (
      <PageLayout>
        <Survey />
      </PageLayout>
    ),
  },
  {
    path: "/survey/:id",
    element: (
      <PageLayout>
        <Survey />
      </PageLayout>
    ),
  },
  {
    path: "/studies",
    element: (
      <PageLayout>
        <Studies />
      </PageLayout>
    ),
  },
  {
    path: "/:first/:second?/:third?",
    element: (
      <PageLayout>
        <Content />
      </PageLayout>
    ),
  },
];

export default routes;
