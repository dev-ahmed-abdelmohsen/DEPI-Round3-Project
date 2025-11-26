import { VideosGrid } from "@/components/videos-grid";
import { fetchUploads } from "@/lib/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Video } from "@/lib/types";

interface PageParams {
  channelId: string;
}

export default async function ChannelPage({
                                            params: {channelId},
                                          }: {
  params: PageParams;
}) {
  const channelIdentifier = channelId ? decodeURIComponent(channelId) : "";
  console.log("[DEBUG] Identifier received on page:", channelIdentifier);

  // @ts-ignore
  let videos = [];
  let error: string | null = null;

  try {
    videos = await fetchUploads(channelIdentifier);
  } catch (err) {
    error =
      err instanceof Error ? err.message : "An unknown error occurred while fetching videos.";
    console.error("[ERROR] Failed to fetch videos in ChannelPage:", error);
  }

  // @ts-ignore
  return (
    <div className="container mx-auto min-h-screen max-w-7xl p-4 sm:p-6 lg:p-8">
      <main>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <VideosGrid channelId={channelIdentifier} initialVideos={videos} />
      </main>
    </div>
  );
}
