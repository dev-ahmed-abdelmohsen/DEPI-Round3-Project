"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Trash2, Edit, Copy } from "lucide-react";
import Link from "next/link";
import {useIsMobile} from '@/hooks/use-mobile';

interface SavedLink {
  id: string;
  name: string;
  url: string;
}

const YOUTUBE_URL_REGEX =
  /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)[\w-]{11}$/;

export function SavedLinks() {
  const storageKey = "savedVideoLinks";
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const [links, setLinks] = useState<SavedLink[]>(() => {
    try {
      const savedLinks = localStorage.getItem(storageKey);
      return savedLinks ? JSON.parse(savedLinks) : [];
    } catch (error) {
      console.error("Failed to parse links from localStorage", error);
      return [];
    }
  });
  const [newLinkName, setNewLinkName] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [editingLink, setEditingLink] = useState<SavedLink | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const links = JSON.parse(localStorage.getItem(storageKey) || "[]");
    setLinks(links);
  }, []);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(links));
  }, [links]);

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLinkName.trim() || !newLinkUrl.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Both name and URL are required.",
      });
      return;
    }
    if (!YOUTUBE_URL_REGEX.test(newLinkUrl)) {
      toast({
        variant: "destructive",
        title: "Invalid URL",
        description: "Please enter a valid YouTube URL.",
      });
      return;
    }

    const newLink: SavedLink = {
      id: crypto.randomUUID(),
      name: newLinkName.trim(),
      url: newLinkUrl.trim(),
    };
    setLinks((prev) => [...prev, newLink]);
    setNewLinkName("");
    setNewLinkUrl("");
    toast({ title: "Success", description: "Link saved successfully." });
  };

  const handleDeleteLink = (id: string) => {
    setLinks((prev) => prev.filter((link) => link.id !== id));
    toast({ title: "Success", description: "Link removed." });
  };

  const handleUpdateLink = () => {
    if (!editingLink) return;

    if (!editingLink.name.trim() || !editingLink.url.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Both name and URL are required.",
      });
      return;
    }
    if (!YOUTUBE_URL_REGEX.test(editingLink.url)) {
      toast({
        variant: "destructive",
        title: "Invalid URL",
        description: "Please enter a valid YouTube URL.",
      });
      return;
    }

    setLinks((prev) =>
      prev.map((link) => (link.id === editingLink.id ? editingLink : link))
    );
    setEditingLink(null);
    toast({ title: "Success", description: "Link updated successfully." });
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({ title: "Copied!", description: "Link copied to clipboard." });
  };

  if (!isClient) {
    return null; // Render nothing on the server
  }

  return (
    <div className="w-full max-w-5xl mx-auto mt-16 space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">My Saved Videos</h2>
        <p className="mt-2 text-muted-foreground">
          Keep track of videos you want to watch later.
        </p>
      </div>

      <form
        onSubmit={handleAddLink}
        className="grid grid-cols-1 sm:grid-cols-5 gap-4 p-4 border rounded-lg"
      >
        <Input
          type="text"
          placeholder="Video Name"
          value={newLinkName}
          onChange={(e) => setNewLinkName(e.target.value)}
          className="sm:col-span-2"
          aria-label="Video Name"
        />
        <Input
          type="url"
          placeholder="YouTube Video URL"
          value={newLinkUrl}
          onChange={(e) => setNewLinkUrl(e.target.value)}
          className="sm:col-span-2"
          aria-label="YouTube Video URL"
        />
        <Button type="submit" className="sm:col-span-1">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Video
        </Button>
      </form>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30%]">Name</TableHead>
              <TableHead>Link</TableHead>
              <TableHead className="text-right w-[180px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {links.length > 0 ? (
              links.map((link) => (
                <TableRow key={link.id}>
                  <TableCell className="font-medium break-all">
                    <Link href={`/channel/${encodeURIComponent(link.url)}`}>
                      <span className="cursor-pointer text-primary hover:underline">
                        {link.name}
                      </span>
                    </Link>
                  </TableCell>
                  <TableCell className="break-all">
                    <Link
                      href={`/channel/${encodeURIComponent(link.url)}`}
                      className="text-primary hover:underline"
                    >
                      {link.url}
                    </Link>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Dialog
                      onOpenChange={(isOpen) => !isOpen && setEditingLink(null)}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingLink({ ...link })}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      {editingLink && editingLink.id === link.id && (
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Video Link</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <Input
                              value={editingLink.name}
                              onChange={(e) =>
                                setEditingLink({
                                  ...editingLink,
                                  name: e.target.value,
                                })
                              }
                              placeholder="Video Name"
                            />
                            <Input
                              value={editingLink.url}
                              onChange={(e) =>
                                setEditingLink({
                                  ...editingLink,
                                  url: e.target.value,
                                })
                              }
                              placeholder="YouTube Video URL"
                            />
                          </div>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button type="button" onClick={handleUpdateLink}>
                                Save Changes
                              </Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      )}
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopyLink(link.url)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => handleDeleteLink(link.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  No saved videos yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
