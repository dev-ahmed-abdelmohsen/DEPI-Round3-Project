"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface VideoNotesProps {
  videoId: string;
}

export function VideoNotes({ videoId }: VideoNotesProps) {
  const [notes, setNotes] = useState("");
  const { toast } = useToast();
  const storageKey = `video-notes-${videoId}`;

  useEffect(() => {
    const savedNotes = localStorage.getItem(storageKey);
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, [storageKey]);

  const handleSave = () => {
    localStorage.setItem(storageKey, notes);
    toast({
      title: "Notes Saved",
      description: "Your notes have been saved successfully.",
    });
  };

  const handleClear = () => {
    setNotes("");
    localStorage.removeItem(storageKey);
    toast({
      title: "Notes Cleared",
      description: "Your notes have been cleared.",
    });
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["link"],
      [{ direction: "rtl" }],
    ],
  };

  return (
    <div className="flex flex-col space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">My Notes</h2>
      <div className="bg-background rounded-md">
        <style>
          {`
            .ql-editor.ql-blank[data-placeholder]:before {
              right: 1.5rem;
              left: 1.5rem;
            }
            .ql-rtl .ql-editor.ql-blank[data-placeholder]:before {
              right: 1.5rem;
              text-align: right;
            }
          `}
        </style>
        <ReactQuill
          theme="snow"
          value={notes}
          onChange={setNotes}
          modules={modules}
          placeholder="Take notes while you watch the video..."
          className="min-h-[300px] lg:min-h-[calc(100vh-250px)] [&>.ql-container]:border-border [&>.ql-toolbar]:border-border"
        />
      </div>
      <div className="flex space-x-2">
        <Button onClick={handleSave}>Save Notes</Button>
        <Button variant="outline" onClick={handleClear}>
          Clear Notes
        </Button>
      </div>
    </div>
  );
}
