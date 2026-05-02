import { useMemo } from "react";

const SUPER_SPLAT_BASE_URL = "https://superspl.at/editor";
const PUBLIC_SPLAT_URL = "https://theredds.eu/splats/resized.ply";

export default function CareerSplatPage() {
  const viewerUrl = useMemo(() => {
    const params = new URLSearchParams({ load: PUBLIC_SPLAT_URL });

    return `${SUPER_SPLAT_BASE_URL}?${params.toString()}`;
  }, []);

  return (
    <main className="min-h-screen bg-black">
      <iframe
        title="CAREER Gaussian Splat Viewer"
        src={viewerUrl}
        className="block h-screen w-screen border-0"
        allow="fullscreen; xr-spatial-tracking"
      />
    </main>
  );
}
