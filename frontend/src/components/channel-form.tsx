"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
    FormControl,
      FormField,
        FormItem,
          FormLabel,
            FormMessage,
            } from "@/components/ui/form";
            import { Input } from "@/components/ui/input";
            
            const formSchema = z.object({
              url: z.string().url({ message: "Please enter a valid YouTube channel URL." }),
              });
              
              const extractChannelId = (url: string): string | null => {
                try {
                    const urlObj = new URL(url);
                        const pathname = urlObj.pathname;
                        
                            const channelMatch = pathname.match(/\/channel\/([a-zA-Z0-9_-]+)/);
                                if (channelMatch && channelMatch[1]) {
                                      return channelMatch[1];
                                          }
                                          
                                              const handleMatch = pathname.match(/\/@([a-zA-Z0-9_.-]+)/);
                                                  if (handleMatch && handleMatch[1]) {
                                                        return handleMatch[1];
                                                            }
                                                                
                                                                    const userMatch = pathname.match(/\/user\/([a-zA-Z0-9_-]+)/);
                                                                        if (userMatch && userMatch[1]) {
                                                                              return userMatch[1];
                                                                                  }
                                                                                  
                                                                                      return null;
                                                                                        } catch (error) {
                                                                                            return null;
                                                                                              }
                                                                                              };
                                                                                              
                                                                                              export function ChannelForm() {
                                                                                                const router = useRouter();
                                                                                                  const [isLoading, setIsLoading] = useState(false);
                                                                                                  
                                                                                                    const form = useForm<z.infer<typeof formSchema>>({
                                                                                                        resolver: zodResolver(formSchema),
                                                                                                            defaultValues: {
                                                                                                                  url: "",
                                                                                                                      },
                                                                                                                        });
                                                                                                                        
                                                                                                                          function onSubmit(values: z.infer<typeof formSchema>) {
                                                                                                                              setIsLoading(true);
                                                                                                                                  const channelId = extractChannelId(values.url);
                                                                                                                                  
                                                                                                                                      if (channelId) {
                                                                                                                                            router.push(`/channel/${channelId}`);
                                                                                                                                                } else {
                                                                                                                                                      form.setError("url", {
                                                                                                                                                              type: "manual",
                                                                                                                                                                      message: "Could not extract a channel ID or handle from the URL.",
                                                                                                                                                                            });
                                                                                                                                                                                  setIsLoading(false);
                                                                                                                                                                                      }
                                                                                                                                                                                        }
                                                                                                                                                                                        
                                                                                                                                                                                          return (
                                                                                                                                                                                              <Form {...form}>
                                                                                                                                                                                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                                                                                                                                                                                            <FormField
                                                                                                                                                                                                                      control={form.control}
                                                                                                                                                                                                                                name="url"
                                                                                                                                                                                                                                          render={({ field }) => (
                                                                                                                                                                                                                                                      <FormItem>
                                                                                                                                                                                                                                                                    <FormLabel className="sr-only">YouTube Channel URL</FormLabel>
                                                                                                                                                                                                                                                                                  <FormControl>
                                                                                                                                                                                                                                                                                                  <Input placeholder="e.g., https://www.youtube.com/@fireship" {...field} />
                                                                                                                                                                                                                                                                                                                </FormControl>
                                                                                                                                                                                                                                                                                                                              <FormMessage />
                                                                                                                                                                                                                                                                                                                                          </FormItem>
                                                                                                                                                                                                                                                                                                                                                    )}
                                                                                                                                                                                                                                                                                                                                                            />
                                                                                                                                                                                                                                                                                                                                                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                                                                                                                                                                                                                                                                                                                                                              {isLoading ? (
                                                                                                                                                                                                                                                                                                                                                                                          <>
                                                                                                                                                                                                                                                                                                                                                                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                                                                                                                                                                                                                                                                                                                                                                      Fetching...
                                                                                                                                                                                                                                                                                                                                                                                                                                  </>
                                                                                                                                                                                                                                                                                                                                                                                                                                            ) : (
                                                                                                                                                                                                                                                                                                                                                                                                                                                        "Fetch Channel"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                  )}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                          </Button>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                </form>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    </Form>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      );
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      }