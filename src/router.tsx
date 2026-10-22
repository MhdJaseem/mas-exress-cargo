import { createBrowserRouter, Navigate, type RouteObject } from 'react-router';
import RootLayout from './components/layout/RootLayout';
import HomePage from './pages/HomePage';
import ServicePage from './pages/ServicePage';
import SolutionPage from './pages/SolutionPage';
import AboutPage from './pages/AboutPage';
import TeamPage from './pages/TeamPage';
import BranchesPage from './pages/BranchesPage';
import CareersPage from './pages/CareersPage';
import NotFoundPage from './pages/NotFoundPage';
import { services } from './data/services';
import { solutions } from './data/solutions';

/* ------------------------------------------------------------------
   All site routes. Every page renders inside RootLayout (header, footer, WhatsApp widget).

   /                      Home
   /air-freight …         one route per entry in data/services.ts
   /solution/<slug>       one route per entry in data/solutions.ts (same paths as the live site)
   /about /our-team /our-branches /careers
   *                      404

   Old ".html" addresses from the previous multi-page build redirect to the clean URLs.
   ------------------------------------------------------------------ */

const companyRoutes: RouteObject[] = [
  { path: 'about', element: <AboutPage /> },
  { path: 'our-team', element: <TeamPage /> },
  { path: 'our-branches', element: <BranchesPage /> },
  { path: 'careers', element: <CareersPage /> },
];

const serviceRoutes: RouteObject[] = services.map((s) => ({
  path: s.slug,
  element: <ServicePage service={s} />,
}));

const solutionRoutes: RouteObject[] = solutions.map((s) => ({
  path: `solution/${s.slug}`,
  element: <SolutionPage solution={s} />,
}));

const legacyRedirects: RouteObject[] = [
  { path: 'index.html', element: <Navigate to="/" replace /> },
  ...[...serviceRoutes, ...companyRoutes].map((r) => ({
    path: `${r.path}.html`,
    element: <Navigate to={`/${r.path}`} replace />,
  })),
];

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      ...serviceRoutes,
      ...solutionRoutes,
      ...companyRoutes,
      ...legacyRedirects,
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
