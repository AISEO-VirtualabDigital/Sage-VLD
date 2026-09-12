"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DashboardShell, type ViewId } from "./dashboard-shell";
import { useSites } from "./hooks/use-dashboard-data";
import { OverviewView } from "./views/overview-view";
import { RankingsView } from "./views/rankings-view";
import { CitationsView } from "./views/citations-view";
import { AuditsView } from "./views/audits-view";
import { ContentView } from "./views/content-view";
import { ChangesView } from "./views/changes-view";
import { BrandBrainView } from "./views/brandbrain-view";
import { AnalyticsView } from "./views/analytics-view";
import { ApiKeysView } from "./views/apikeys-view";
import { BillingView } from "./views/billing-view";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

interface DashboardAppProps {
  onExit: () => void;
}

export function DashboardApp({ onExit }: DashboardAppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <DashboardInner onExit={onExit} />
    </QueryClientProvider>
  );
}

function DashboardInner({ onExit }: { onExit: () => void }) {
  const [view, setView] = React.useState<ViewId>("overview");
  const [siteId, setSiteId] = React.useState<string | null>(null);

  // Auto-select first site when sites load
  const { data: sites } = useSites();
  React.useEffect(() => {
    if (!siteId && sites && sites.length > 0) {
      // Prefer Acme Labs (has full seed data), otherwise first
      const acme = sites.find((s) => s.name === "Acme Labs");
      setSiteId((acme || sites[0]).id);
    }
  }, [sites, siteId]);

  return (
    <DashboardShell
      view={view}
      onViewChange={setView}
      siteId={siteId}
      onSiteChange={setSiteId}
      onExit={onExit}
    >
      {!siteId ? (
        <div className="text-center py-12 text-sm text-muted-foreground">
          No site selected. Connect a site via the dropdown in the top bar.
        </div>
      ) : (
        <>
          {view === "overview" && <OverviewView siteId={siteId} onView={(v) => setView(v as ViewId)} />}
          {view === "rankings" && <RankingsView siteId={siteId} />}
          {view === "citations" && <CitationsView siteId={siteId} />}
          {view === "content" && <ContentView siteId={siteId} />}
          {view === "audits" && <AuditsView siteId={siteId} />}
          {view === "changes" && <ChangesView siteId={siteId} />}
          {view === "brandbrain" && <BrandBrainView siteId={siteId} />}
          {view === "analytics" && <AnalyticsView siteId={siteId} />}
          {view === "billing" && <BillingView />}
          {view === "apikeys" && <ApiKeysView />}
        </>
      )}
    </DashboardShell>
  );
}
