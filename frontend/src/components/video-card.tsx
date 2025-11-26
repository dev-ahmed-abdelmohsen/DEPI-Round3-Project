import Image from "next/image";
import { Card, CardHeader } from "@/components/ui/card";
import type { Video } from "@/lib/types";

export function VideoCard({ video }: { video: Video; }) {
  return (
    <a 
      href={`https://www.youtube.com/watch?v=${video.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      <Card className="overflow-hidden transition-all group-hover:shadow-lg group-hover:-translate-y-1">
        <div className="relative aspect-video">
          <Image
            src={video.thumbnail}
            alt={`Thumbnail for ${video.title}`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>
        <CardHeader>
          <p className="line-clamp-2 text-sm font-medium">{video.title}</p>
        </CardHeader>
      </Card>
    </a>
  );
}
