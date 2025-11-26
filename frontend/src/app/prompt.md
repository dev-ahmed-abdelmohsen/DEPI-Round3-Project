
# AI Prompt: Add Video Link Saving Feature with LocalStorage

## Objective

Implement a user-friendly feature on the main search page where users can save multiple YouTube video links they want to follow up or watch later.

## Requirements

- Add a new UI component below or beside the input box: a table with two columns: "Name" and "Link".
- Allow users to add new rows by entering a video name and URL.
- Show the saved list of video links in the table with options to remove or edit entries.
- Store all video links persistently in the browser's localStorage so that the list remains available across refreshes or navigation.
- The feature should not require user login or backend storage; it must be fully client-side.
- Provide a clean and accessible UI design consistent with the site styling.

## Additional Suggestions

- Use React state and `useEffect` hooks to synchronize the saved list with localStorage.
- Add validation to ensure URLs are valid YouTube video URLs.
- Allow users to easily copy a link or open it in a new tab.

This should help users keep track of interesting videos without having to repeatedly search on YouTube.

Thank you.
