"use client";

import { VideoNotes } from "@/components/video-notes";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import YouTube from "react-youtube";

export default function VideoPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const videoId = params.videoId as string;
  const channelId = searchParams.get("channelId");

  const backLink = channelId
    ? `/channel/${encodeURIComponent(channelId)}`
    : "/";

  return (
    <main className="container mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <Link
          href={backLink}
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Channel
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="relative aspect-video bg-black rounded-lg">
            <YouTube
              videoId={videoId}
              opts={{
                width: "100%",
                height: "100%",
                playerVars: {
                  autoplay: 1,
                  mute: 0,
                  rel: 0,
                  modestbranding: 1,
                  playsinline: 1, // Important for iOS
                },
              }}
              className="absolute top-0 left-0 w-full h-full"
              iframeClassName="w-full h-full rounded-lg"
            />
          </div>
        </div>
        <div className="lg:col-span-1">
          <VideoNotes videoId={videoId} />
        </div>
      </div>
    </main>
  );
}
