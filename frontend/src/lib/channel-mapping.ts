// Map of friendly channel names to actual YouTube channel IDs
const channelMap: Record<string, string> = {
  // Tech/Programming channels
};

/**
 * Validates and extracts YouTube channel ID
 * @param input The input to validate/extract from
 * @returns An object containing the valid channel ID or an error message
 */
export function validateYouTubeChannelId(input: string): {
  channelId?: string;
  error?: string;
} {
  // Remove any whitespace
  const cleanInput = decodeURIComponent(input).trim();

  // Valid YouTube channel IDs start with UC and are typically 24 characters
  if (/^UC[\w-]{20,24}$/.test(cleanInput)) {
    return { channelId: cleanInput };
  }

  // Extract channel ID from YouTube channel URL
  const channelMatch = cleanInput.match(
    /youtube\.com\/channel\/(UC[\w-]{20,24})/
  );
  if (channelMatch && channelMatch[1]) {
    return { channelId: channelMatch[1] };
  }

  // For any other format, return an error message with instructions
  return {
    error: `Invalid YouTube channel ID format. Please use the TunePocket YouTube Channel ID Finder at https://www.tunepocket.com/youtube-channel-id-finder/ to get the proper channel ID that starts with "UC".`,
  };
}
