"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  Clock,
  VideoIcon,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
}

type VideoStatus = "completed" | "dismissed" | "pending" | null;
type Markers = { [videoId: string]: VideoStatus };

export function VideosGrid({
  channelId,
  initialVideos,
}: {
  channelId: string;
  initialVideos: Video[];
}) {
  const [videos, setVideos] = useState<Video[]>(initialVideos);
  const [isLoading, setIsLoading] = useState(false); // Data is already loaded
  const { toast } = useToast();
  const storageKey = `videoMarkers-${channelId}`;

  const [markers, setMarkers] = useState<Markers>(() => {
    try {
      const savedMarkers = localStorage.getItem(storageKey);
      return savedMarkers ? JSON.parse(savedMarkers) : {};
    } catch (error) {
      console.error("Failed to parse markers from localStorage", error);
      return {};
    }
  });

  // Save markers to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(markers));
    } catch (error) {
      console.error("Failed to save markers to localStorage", error);
    }
  }, [markers, storageKey]);

  // If initialVideos change, update the state
  useEffect(() => {
    setVideos(initialVideos);
  }, [initialVideos]);

  // If channelId changes, load the markers from localStorage
  useEffect(() => {
    const savedMarkers = localStorage.getItem(storageKey);
    setMarkers(savedMarkers ? JSON.parse(savedMarkers) : {});
  }, [channelId, storageKey]);

  const handleStatusChange = (
    e: React.MouseEvent,
    videoId: string,
    status: VideoStatus
  ) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation(); // Stop event bubbling

    setMarkers((prev) => {
      const newMarkers = { ...prev };
      // If the current status is the same, clear it. Otherwise, set the new status.
      if (newMarkers[videoId] === status) {
        delete newMarkers[videoId];
      } else {
        newMarkers[videoId] = status;
      }
      return newMarkers;
    });
  };

  const statusStyles: {
    [key in NonNullable<VideoStatus>]: {
      borderColor: string;
      icon: React.ReactNode;
    };
  } = {
    completed: {
      borderColor: "border-green-500",
      icon: <Check className="h-8 w-8 text-white" />,
    },
    dismissed: {
      borderColor: "border-red-500",
      icon: <X className="h-8 w-8 text-white" />,
    },
    pending: {
      borderColor: "border-yellow-500",
      icon: <Clock className="h-8 w-8 text-white" />,
    },
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="mb-6 flex flex-col items-center justify-center rounded-lg border border-dashed border-yellow-500/50 bg-yellow-500/10 p-6 text-center">
          <div className="text-yellow-500 animate-spin h-6 w-6 mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-green-700 dark:text-green-300">
            Fetching Videos...
          </h3>
          <p className="text-lg text-green-600 dark:text-green-400">
            اغرسلك نخلة في الجنة : سبحان الله وبحمده سبحان الله العظيم
          </p>
        </div>
      );
    }

    if (videos.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-24 text-center">
          <VideoIcon className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-semibold">No Videos Found</h3>
          <p className="text-sm text-muted-foreground">
            Could not find any uploaded videos for this channel, or the server
            took too long to respond.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {videos.map((video, index) => {
          const status = markers[video.id] ?? null;
          const cardBorder = status
            ? statusStyles[status].borderColor
            : "border-border";

          return (
            <div key={video.id} className="relative group">
              <div
                className={cn(
                  "absolute top-2 right-2 z-20 flex space-x-1",
                  "transition-opacity opacity-0 group-hover:opacity-100"
                )}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 bg-black/50 hover:bg-green-600"
                  onClick={(e) => handleStatusChange(e, video.id, "completed")}
                >
                  <Check className="h-4 w-4 text-white" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 bg-black/50 hover:bg-yellow-600"
                  onClick={(e) => handleStatusChange(e, video.id, "pending")}
                >
                  <Clock className="h-4 w-4 text-white" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 bg-black/50 hover:bg-red-600"
                  onClick={(e) => handleStatusChange(e, video.id, "dismissed")}
                >
                  <X className="h-4 w-4 text-white" />
                </Button>
              </div>

              <Link
                href={`/video/${video.id}?channelId=${encodeURIComponent(
                  channelId
                )}`}
              >
                <div
                  className={cn(
                    "border-4 rounded-lg overflow-hidden cursor-pointer transition-all h-full flex flex-col",
                    cardBorder
                  )}
                >
                  <div className="relative aspect-video">
                    {status && (
                      <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center">
                        {statusStyles[status].icon}
                      </div>
                    )}
                    <Image
                      src={video.thumbnail}
                      alt={video.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform group-hover:scale-105"
                      priority={index < 4}
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-medium text-foreground line-clamp-2 flex-grow">
                      {video.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {new Date(video.publishedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Channel Videos
        </h1>
        <p className="mt-2 text-muted-foreground break-all">
          Showing videos for:{" "}
          <span className="font-medium text-primary">{channelId}</span>
        </p>
        <div className="mt-6">
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              New Search
            </Button>
          </Link>
        </div>
      </div>
      {renderContent()}
    </>
  );
}
