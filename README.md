# 🚀 AeroFleet Dashboard

AeroFleet Dashboard is a modern, responsive, and SEO-friendly single-page application (SPA) built for comprehensive fleet management and tracking. Designed with clean vanilla web technologies, the platform provides real-time insights into fleet activity through a stunning, performance-oriented interface.

---

## 🌟 Key Features

*   **🗺️ Live Fleet Tracking (Live Map):** Integrates Mapbox GL JS to display the exact, real-time geographic locations of active vehicles, centering on critical global areas.
*   **⚠️ Incident Alerts:** Complete history and log of dashcam AI detections (like Harsh Braking, Rapid Acceleration, Speeding, Tailgating) with filtering capabilities.
*   **📊 Performance Analytics:** Dynamic visual breakdowns of fleet performance metrics via Chart.js, including weekly trends and incident classifications.
*   **🛡️ Safety Center:** Driver behavior monitoring, safety scoring (0-100), and a leaderboard to track top performers versus those requiring coaching.
*   **⚙️ Platform Configuration (Settings):** In-depth mock management views for admin profile updates, customizable notification preferences, fleet system rules, data privacy, and API webhook integrations.
*   **🔐 Authentication Flow:** Beautiful, user-friendly login and signup pages supporting secure entry (with manual name entry) replacing auto-generated credentials.
*   **📱 Fully Responsive:** Carefully crafted with vanilla CSS to adjust flawlessly across desktops, tablets, and mobile views. 
*   **🎨 Dynamic UI/UX:** A visually striking aesthetic powered by Feathers Icons, custom CSS animations (e.g., `fade-in-up`, `pulse-red`), glassmorphic elements, and cohesive layout systems.

---

## 🛠️ Technology Stack

AeroFleet relies heavily on modern vanilla tech without heavy framework dependencies, emphasizing fast load speeds and simple maintainability:

*   **Markup:** HTML5 (Semantic and structural elements)
*   **Styling:** Vanilla CSS3 (Custom animations, Grid/Flexbox layouts, dark/light moding)
*   **Logic & Interactivity:** Vanilla JavaScript (ES6 Modules, DOM manipulations, UI state handling)
*   **Mapping:** Leaflet.js over Mapbox GL JS
*   **Charting:** Chart.js for data visualization
*   **Icons:** Feather Icons for consistent SVG glyphs
*   **Fonts:** Inter via Google Fonts

---

## 📂 Project Structure

```text
AeroFleet_Dashboard_development/
├── index.html        # Main SPA Dashboard container housing all app views
├── login.html        # Clean, modern user login screen
├── signup.html       # Clean, modern user registration screen
├── style.css         # Centralized styling rules and utility classes
├── script.js         # Core application logic, routing, charting, and maps
└── README.md         # You are here!
```

---

## 🚀 Getting Started

Follow these steps to preview the dashboard locally. No complex build tools are required!

### 1. Prerequisites

You only need a modern web browser and preferably a local web server (like VS Code's Live Server, Python's `http.server`, or Node's `http-server`) to serve the Mapbox maps properly across local environments.

### 2. Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/open5nippet/AeroFleet_Dashboard_development.git
    ```
2.  Navigate to the directory:
    ```bash
    cd AeroFleet_Dashboard_development
    ```
3.  Serve the directory using a preferred local server. E.g., if using Python:
    ```bash
    python -m http.server 8000
    ```
4.  Open your browser and navigate to `http://localhost:8000`.

*Note: For the Mapbox maps to work perfectly, replace the `mapboxKey` variable inside `script.js` directly with your personal Mapbox Access Token if the demo usage limits have been reached.*

---

## 🎨 UI Highlight: Component Breakdown

*   **Responsive Sidebar:** Features an expanding, collapsing, and floating/pinned toggle system for maximizing screen real estate.
*   **Stats Grid:** Top-level metrics highlight total AI incidents and overall fleet safety scores dynamically upon entry. 
*   **Notification System:** Toast notifications appear contextually based on user interaction (e.g. searching, applying settings).

---

## 📜 License

This project is intended for development and showcase purposes.
