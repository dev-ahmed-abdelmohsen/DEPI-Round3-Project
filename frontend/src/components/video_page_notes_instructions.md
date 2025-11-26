# AI Prompt: Implement Video Marking & Status System

## 1. Objective

The primary goal is to enhance the video grid page by implementing a "video marking" system. This will allow users to visually tag or mark individual video cards with a specific status (e.g., "Completed", "Watch Later", "Dismissed"). These statuses must be visually represented on the video cards and persist across browser sessions for each user.

## 2. Core Functional Requirements

- **Interactive Markers**: Add a set of small, clickable icons to each video card. These icons will serve as the controls for setting a video's status.
- **Visual Feedback**: When a status is set, the video card's appearance must change to reflect that status. This should include a colored border and a status icon overlay.
- **Data Persistence**: The user's selected status for each video must be saved and automatically re-applied whenever they revisit the page. This will be achieved using the browser's `localStorage`.

## 3. Detailed Implementation Steps

### 3.1. UI/UX Changes

- **Add Action Icons**:
  - For each `video-card` component, introduce a small, unobtrusive section (e.g., top-right corner) containing three clickable icons:
    - **Check Icon (✓)**: Sets the video status to `completed`.
    - **X Icon (✕)**: Sets the video status to `dismissed`.
    - **Clock Icon (🕒)**: Sets the video status to `pending`.
  - Clicking an icon should set the video's status. Clicking the same icon again should clear the status (set to `null` or remove the entry).

- **Implement Visual Borders and Overlays**:
  - Based on the video's current status, apply conditional styling:
    - **`completed`**: A solid **green** border (e.g., `border-green-500`).
    - **`dismissed`**: A solid **red** border (e.g., `border-red-500`).
    - **`pending`**: A solid **yellow/amber** border (e.g., `border-yellow-500`).
    - **No Status**: A transparent or default border (e.g., `border-transparent`).
  - Optionally, display the corresponding status icon faintly overlaid on the video thumbnail for clearer visual indication.

### 3.2. State Management & Data Logic

- **Centralized State**:
  - In the parent component responsible for rendering the video grid (e.g., `VideosGrid.tsx`), create a state to hold the status of all videos. This state should be an object where keys are `videoId`s and values are the status strings (`completed`, `dismissed`, `pending`).
  - Example: `const [markers, setMarkers] = useState({});`

- **`localStorage` Integration**:
  - **Data Structure**: Store the entire markers object as a single JSON string in `localStorage` under the key `videoMarkers`.
    ```
    // Example of data in localStorage['videoMarkers']
    {
      "videoId_1": "completed",
      "videoId_2": "pending"
    }
    ```
  - **Load on Mount**: Use a `useEffect` hook with an empty dependency array `[]` to load the `videoMarkers` object from `localStorage` when the component first mounts. Parse the JSON string back into a JavaScript object.
  - **Save on Change**: Use a second `useEffect` hook that listens for changes to the `markers` state (`[markers]`). Whenever the state is updated, serialize the new object to a JSON string and save it back to `localStorage`.

### 3.3. Component Logic (`video-card.tsx`)

- The `video-card` component should receive its current status and a handler function as props (e.g., `status`, `onStatusChange`).
- It will render the action icons and apply conditional CSS classes based on the `status` prop.
- When an icon is clicked, it will call the `onStatusChange` function, passing back the new status for that video's ID.