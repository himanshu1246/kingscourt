# King's Court - Premium Real Estate Website

A modern, luxurious, and highly responsive single-page landing website designed for King's Court Real Estate. 

## Features

- **Premium UI/UX:** Built with a sophisticated dark/gold color palette and seamless responsive layouts for all devices.
- **Dynamic Hero Section:** A mathematically perfect, fully responsive Hero image that natively scales on both mobile and desktop without awkward cropping or zooming.
- **3D Hover Interactions:** Smooth 3D tilt interactions on desktop cards utilizing GSAP animations for a truly premium feel.
- **Gated Floor Plans:** Floor plan images are securely blurred and locked behind a lead-generation Enquiry Form. The plans are automatically unlocked once the user successfully submits their details.
- **Full-Screen Image Modals:** Users can view high-resolution amenities and floor plans in an immersive, uncropped full-screen modal view.
- **WhatsApp Integration:** A persistent, floating WhatsApp icon connected directly to the sales line for instant messaging.

## Technologies Used

- **HTML5:** Semantic structuring.
- **CSS3:** Custom properties (CSS variables), Flexbox, Grid, CSS animations, and complex media queries.
- **JavaScript (Vanilla):** Form handling, modal logic, local storage for gating mechanics.
- **GSAP (GreenSock):** Advanced scroll triggers and real-time 3D tilt tracking.
- **Google Apps Script:** Backend endpoint for processing and storing lead generation form submissions.

## Setup & Deployment

1. Clone this repository.
2. The website uses standard frontend files (`index.html`, `css/`, `js/`). No build step is required.
3. Simply open `index.html` in your browser to run the site locally.
4. (Optional) To connect the Enquiry Form to your own Google Sheet, deploy a Google Apps Script to accept POST/GET requests and update the `GOOGLE_SCRIPT_URL` inside `js/main.js`.
