# Karthik Rao - Personal Portfolio Website

Welcome to the repository for my personal portfolio website! This project showcases my skills as a Full-stack Developer with a passion for AI, featuring a dynamic and interactive user experience.

**Live Site:** [karthikrao.live](https://karthikrao.live)

## 🌟 About This Project

This portfolio is designed to be a central hub for my professional presence, highlighting my education, work experience, technical skills, and a collection of projects I've developed. The goal was to create a visually appealing, modern, and interactive site that not only presents information clearly but also demonstrates my capabilities in frontend and creative development.

## ✨ Features

This portfolio is packed with modern features and animations to provide an engaging experience:

* **Fully Responsive Design:** Adapts seamlessly to desktops, tablets, and mobile devices.
* **Core Sections:**
    * **Hero:** Animated introduction with a custom generative particle background featuring parallax and mouse interaction (bouncing particle effect).
    * **About Me:** Details about my background, education, and a dynamic display of soft and artistic skills with icons.
    * **Skills:** A visually organized grid showcasing my technical proficiencies with logos.
    * **Projects:** An interactive showcase of my work:
        * **3D Tilting Cards:** Project cards tilt in 3D space on mouse hover for an engaging effect.
    * **Resume:** Inline PDF viewer for my resume with a direct download option.
    * **Contact:**
        * A functional contact form integrated with **Formspree**.
        * Includes validation using **React Hook Form** and **Zod**.
        * Direct links to social profiles.
    * **Footer:** Copyright information, social links, and a "Back to Top" button with scroll-based visibility.
* **Advanced Navbar:**
    * Sticky positioning for easy navigation.
    * **Animated Logo:** Features an animated "KR" SVG initial (path drawing) and an animated "Karthik U Rao" text (scramble effect on name hover). Clicking the logo navigates to the top of the homepage.
    * **Interactive Nav Links:**
        * **"Digital Cascade" Text:** Letters animate on hover.
        * **3D Tilt Effect:** Links tilt in 3D on mouse hover.
        * **"Morphing Pill" Active Indicator:** A background pill smoothly animates to highlight the active link based on scroll position (scroll-spy) or page navigation.
* **Custom Animated Cursor:**
    * Replaces the default system cursor with a custom "Aura" effect (dot & ring).
    * Contextual changes: The cursor transforms when hovering over links and buttons throughout the site.
* **Smooth Animations & Transitions:** Leveraging **Framer Motion** for most animations, including page loads, scroll reveals, and micro-interactions.
* **Modern Styling:** Built with **Tailwind CSS** following `shadcn/ui` principles for a clean and elegant dark theme.
* **Custom Favicon:** "KR" logo used as the browser tab icon.
* **Custom Scrollbar:** Styled for a modern look.

## 🛠️ Tech Stack

* **Frontend Framework:** [Next.js](https://nextjs.org/) (v15+ with App Router)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **UI Components/Principles:** [Shadcn/UI](https://ui.shadcn.com/) (used for CLI to add base components like Button, Card, Input, Label, Textarea, Sonner)
* **Animation:** [Framer Motion](https://www.framer.com/motion/)
* **Forms:**
    * [React Hook Form](https://react-hook-form.com/)
    * [Zod](https://zod.dev/) (for schema validation)
    * [Formspree](https://formspree.io/) (for contact form backend)
* **Icons:** [Lucide React](https://lucide.dev/), [React Icons](https://react-icons.github.io/react-icons/)
* **PDF Viewing:** [React-PDF](https://github.com/wojtekmaj/react-pdf)
* **Linting/Formatting:** ESLint, Prettier (assumed standard Next.js setup)
* **Deployment:** [Vercel](https://vercel.com/)

## 🚀 Running Locally

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js (v18 or later recommended)
* npm or yarn or pnpm

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <repository-folder>
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    # or
    # pnpm install
    ```
3.  **Set up Environment Variables :**
    * This project uses Formspree for the contact form. The endpoint URL is currently in `src/components/ContactSection.tsx`. For a more robust setup, you could move this to an environment variable (e.g., `.env.local`):
        ```env
        NEXT_PUBLIC_FORMSPREE_URL=[https://formspree.io/f/your_form_id](https://formspree.io/f/your_form_id)
        ```
        And then access it in the component via `process.env.NEXT_PUBLIC_FORMSPREE_URL`.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🎨 Design & Development Notes

* The website is designed with a modern, dark theme, emphasizing clarity and user experience.
* Extensive use of animations aims to create a dynamic and engaging feel, showcasing proficiency in libraries like Framer Motion.
* The "AI-Esque" generative background in the hero section and other unique animations are intended to reflect a creative approach to web development.

## 👤 Author

* **Karthik U Rao**
    * Portfolio: [karthikrao.live](https://karthikrao.live)
    * LinkedIn: [linkedin.com/in/karthik-u-rao](https://www.linkedin.com/in/karthik-u-rao) 
    * GitHub: `YourGitHubUsername` (Replace with your actual GitHub username)

## 💡 Future Enhancements

* Command Palette (`Cmd+K`) for quick navigation.
* User-toggleable Light/Dark mode.
* Detailed individual project pages/case studies.
* Blog section.

