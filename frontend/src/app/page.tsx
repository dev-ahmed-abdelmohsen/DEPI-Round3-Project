"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Youtube, Upload, Download } from "lucide-react";
import Link from "next/link";
import { SavedLinks } from "@/components/saved-links";
import { useToast } from "@/hooks/use-toast";

// Define the interface for SavedLink, matching the one in saved-links.tsx
interface SavedLink {
  id: string;
  name: string;
  url: string;
}

// Define the combined data structure for export/import
interface ExportData {
  savedLinks: SavedLink[];
  videoNotes: { [videoId: string]: string };
  videoMarkers?: { [channelId: string]: { [videoId: string]: "completed" | "dismissed" | "pending" | null } };
}

export default function HomePage() {
  const [channelInput, setChannelInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [importTrigger, setImportTrigger] = useState(0); // State to force SavedLinks re-render
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const savedLinksStorageKey = "savedVideoLinks";
  const videoNotesPrefix = "video-notes-";
  const YOUTUBE_URL_REGEX =
    /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)[\w-]{11}$/;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!channelInput.trim()) return;

    setIsLoading(true);

    router.push(`/channel/${encodeURIComponent(channelInput.trim())}`);
  };

  const handleExport = () => {
    try {
      const savedLinksString = localStorage.getItem(savedLinksStorageKey);
      const savedLinks: SavedLink[] = savedLinksString ? JSON.parse(savedLinksString) : [];

      const videoNotes: { [videoId: string]: string } = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(videoNotesPrefix)) {
          const videoId = key.substring(videoNotesPrefix.length);
          const noteContent = localStorage.getItem(key);
          if (noteContent) {
            videoNotes[videoId] = noteContent;
          }
        }
      }

      const videoMarkers: { [channelId: string]: { [videoId: string]: "completed" | "dismissed" | "pending" | null } } = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("videoMarkers-")) {
          const channelId = key.substring("videoMarkers-".length);
          const markersContent = localStorage.getItem(key);
          if (markersContent) {
            try {
              videoMarkers[channelId] = JSON.parse(markersContent);
            } catch (e) {
              console.error(`Failed to parse video markers for ${channelId}:`, e);
            }
          }
        }
      }

      if (savedLinks.length === 0 && Object.keys(videoNotes).length === 0 && Object.keys(videoMarkers).length === 0) {
        toast({
          variant: "destructive",
          title: "No Data to Export",
          description: "There are no saved links, notes, or video markers to export.",
        });
        return;
      }

      const dataToExport: ExportData = { savedLinks, videoNotes, videoMarkers };
      const jsonString = JSON.stringify(dataToExport, null, 2);

      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "socialdev_data.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: "Your data has been exported.",
      });
    } catch (error) {
      console.error("Error exporting data:", error);
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "Could not export data.",
      });
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedData: ExportData = JSON.parse(content);

        // Validate importedData structure
        if (
          typeof importedData !== "object" ||
          importedData === null ||
          !("savedLinks" in importedData) ||
          !("videoNotes" in importedData) ||
          !Array.isArray(importedData.savedLinks) ||
          typeof importedData.videoNotes !== "object"
        ) {
          throw new Error("Invalid file format or top-level data structure.");
        }

        // Validate savedLinks
        const validSavedLinks = importedData.savedLinks.every(
          (item) =>
            typeof item === "object" &&
            item !== null &&
            "id" in item &&
            typeof item.id === "string" &&
            "name" in item &&
            typeof item.name === "string" &&
            "url" in item &&
            typeof item.url === "string" &&
            YOUTUBE_URL_REGEX.test(item.url)
        );
        if (!validSavedLinks) {
          throw new Error("Invalid saved links data structure or URL format.");
        }

        // Validate videoNotes
        const validVideoNotes = Object.entries(importedData.videoNotes).every(
          ([videoId, noteContent]) =>
            typeof videoId === "string" && typeof noteContent === "string"
        );
        if (!validVideoNotes) {
          throw new Error("Invalid video notes data structure.");
        }

        // Validate videoMarkers (if present)
        if (importedData.videoMarkers) {
          const validVideoMarkers = Object.entries(importedData.videoMarkers).every(
            ([channelId, markers]) =>
              typeof channelId === "string" &&
              typeof markers === "object" &&
              markers !== null &&
              Object.entries(markers).every(
                ([videoId, status]) =>
                  typeof videoId === "string" &&
                  (status === "completed" || status === "dismissed" || status === "pending" || status === null)
              )
          );
          if (!validVideoMarkers) {
            throw new Error("Invalid video markers data structure.");
          }
        }

        // Clear existing data before importing
        const keysToRemove: string[] = [];
        if (localStorage.getItem(savedLinksStorageKey)) {
          keysToRemove.push(savedLinksStorageKey);
        }
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.startsWith(videoNotesPrefix) || key.startsWith("videoMarkers-"))) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));

        // Import saved links
        localStorage.setItem(savedLinksStorageKey, JSON.stringify(importedData.savedLinks));

        // Import video notes
        for (const videoId in importedData.videoNotes) {
          if (Object.prototype.hasOwnProperty.call(importedData.videoNotes, videoId)) {
            localStorage.setItem(`${videoNotesPrefix}${videoId}`, importedData.videoNotes[videoId]);
          }
        }

        // Import video markers
        if (importedData.videoMarkers) {
          for (const channelId in importedData.videoMarkers) {
            if (Object.prototype.hasOwnProperty.call(importedData.videoMarkers, channelId)) {
              localStorage.setItem(`videoMarkers-${channelId}`, JSON.stringify(importedData.videoMarkers[channelId]));
            }
          }
        }

        setImportTrigger((prev) => prev + 1); // Trigger re-render of SavedLinks
        toast({
          title: "Import Successful",
          description: "Your data has been imported.",
        });
      } catch (error) {
        console.error("Error importing data:", error);
        toast({
          variant: "destructive",
          title: "Import Failed",
          description:
            error instanceof Error ? error.message : "Could not import data. Invalid file.",
        });
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="container mx-auto max-w-7xl p-4 sm:p-6 lg:p-8 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold">SocialDev</h1>
        </div>
        <div className="flex space-x-2">
          <Link href="/statistics">
            <Button variant="outline">View Statistics</Button>
          </Link>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" /> Export Data
          </Button>
          <Input
            type="file"
            accept=".json"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <Button variant="outline" onClick={handleImportClick}>
            <Upload className="h-4 w-4 mr-2" /> Import Data
          </Button>
        </div>
      </header>
      <main className="container mx-auto flex-1 max-w-7xl p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center">
        <div className="max-w-3xl w-full space-y-8 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Youtube className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
              Go Beyond the Algorithm
            </h1>
          </div>

          <p className="text-xl text-muted-foreground">
            Enter a YouTube channel URL to explore videos
          </p>

          {isLoading ? (
            <div className="mt-8 space-y-6 text-center">
              <div className="flex justify-center items-center p-4">
                <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full" />
              </div>
              <p className="text-xl font-semibold text-foreground">
                Fetching Videos...
              </p>
              <p className="text-lg text-muted-foreground">
                اغرس نخلة في الجنة : سبحان الله وبحمده سبحان الله العظيم
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="flex w-full max-w-lg mx-auto items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Paste a YouTube channel URL here (e.g., https://www.youtube.com/@yehiatech)"
                  value={channelInput}
                  onChange={(e) => setChannelInput(e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  disabled={isLoading || !channelInput.trim()}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </form>
          )}

          <div className="pt-8">
            <SavedLinks key={importTrigger} /> {/* Key added here */}
            <div className="mt-12 text-sm text-muted-foreground text-center">
              Made by{" "}
              <Link
                href="https://ahmed-abd-elmohsen.tech/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:text-primary transition"
              >
                Ahmed Abd Elmohsen
              </Link>{" "}
              ♡
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
