# 8-bit Trip

## Project Overview

**8-bit Trip** is a React application that generates and visualizes 8-bit style audio (bytebeat). It allows users to input mathematical formulas which are processed in real-time to create audio waveforms. The application state (algorithm and sample rate) is encoded in the URL, allowing for easy sharing of compositions.

It is a port of [sound-flour](https://github.com/rm-hull/sound-flour) and is deployed to GitHub Pages.

### Key Technologies

*   **Frontend Framework:** React 19 with Vite 7
*   **Styling:** Chakra UI v3 (using `@emotion`)
*   **Audio:** Web Audio API with AudioWorklets (`public/js/audio-processor.js`)
*   **Routing:** React Router v7
*   **Testing:** Vitest and React Testing Library
*   **Language:** TypeScript

## Building and Running

The project uses `yarn` for dependency management and script execution.

### Key Commands

*   **Install Dependencies:**
    ```bash
    yarn install
    ```

*   **Start Development Server:**
    ```bash
    yarn dev
    ```
    Starts the local server (usually at `http://localhost:5173`).

*   **Build for Production:**
    ```bash
    yarn build
    ```
    Compiles TypeScript and builds the app using Vite into the `dist/` directory.

*   **Run Tests:**
    ```bash
    yarn test
    ```
    Runs unit tests using Vitest.

*   **Lint Code:**
    ```bash
    yarn lint
    ```
    Runs ESLint to check for code quality issues.

*   **Format Code:**
    ```bash
    yarn format
    ```
    Formats code using Prettier.

## Architecture & Key Files

### Directory Structure

*   `src/`: Source code for the React application.
    *   `main.tsx`: Application entry point. Sets up providers (Chakra, Router).
    *   `App.tsx`: Defines the routing logic. Handles the default redirect to a preset algorithm.
    *   `pages/Home.tsx`: The main visualization page. Handles URL decoding, AudioContext setup, and AudioWorklet initialization.
    *   `components/`:
        *   `AudioVisualizer.tsx`: A generic canvas component for rendering audio data.
        *   `AudioAnalyzer.tsx`: Connects the audio stream to the visualizer.
        *   `AlgoForm.tsx`: Form for user input (algorithm string, sample rate).
    *   `visualizations/`: Contains drawing logic (e.g., `frequencyBars.ts`).
*   `public/`: Static assets.
    *   `js/audio-processor.js`: The AudioWorklet processor that executes the audio generation algorithm.
*   `vite.config.ts`: Vite configuration, including the `base` path for GitHub Pages deployment (`/8-bit-trip`).

### URL State Management

The application uses the URL to store the current audio configuration. The `:code` path parameter in `App.tsx` is a Base64 encoded JSON string containing:
*   `algorithm`: The mathematical formula (string).
*   `sampleRate`: The audio sample rate (number).

### Audio Generation

Audio is generated using an `AudioWorklet` to ensure smooth performance off the main thread. The `Home` component loads `js/audio-processor.js` and sends the algorithm and sample rate to it.
