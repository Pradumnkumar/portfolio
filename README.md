# Portfolio Website

A modern, minimalist portfolio website built with Next.js showcasing technical skills and projects.

## Features

- ✨ Modern minimalist design with dark mode support
- 📱 Fully responsive and mobile-optimized
- ⚡ Fast performance with static generation
- 🎨 Beautiful UI with Tailwind CSS
- 📝 Blog section (ready for content)
- 🔍 SEO optimized
- 🚀 Ready for GitHub Pages deployment

## Tech Stack

- **Framework**: Next.js 14+ with TypeScript
- **Styling**: Tailwind CSS
- **Theme**: next-themes for dark mode
- **Icons**: lucide-react
- **Deployment**: Static export for GitHub Pages

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn/pnpm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Building for Production

```bash
npm run build
npm run export
```

This creates a static export in the `out` directory, ready for GitHub Pages.

## Deployment to GitHub Pages

1. Update repository settings to deploy from `gh-pages` branch
2. Add a GitHub Actions workflow or manually deploy the `out` folder
3. Update `basePath` in `next.config.js` if deploying to a subdirectory

## Customization

### Update Personal Information

Edit these files with your information:
- `src/app/page.tsx` - Hero section and home page
- `src/components/Footer.tsx` - Social links and contact info
- `src/app/layout.tsx` - Site metadata

### Add Projects

Edit `src/app/projects/page.tsx` to showcase your projects.

### Add Blog Posts

Create new files in the blog section or add to `src/app/blog/page.tsx`.

### Change Colors

Customize Tailwind colors in `tailwind.config.js` to match your brand.

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   ├── globals.css        # Global styles
│   │   ├── projects/
│   │   │   └── page.tsx       # Projects page
│   │   └── blog/
│   │       └── page.tsx       # Blog page
│   └── components/
│       ├── Navbar.tsx         # Navigation
│       ├── Footer.tsx         # Footer
│       └── ThemeToggle.tsx    # Dark mode toggle
├── public/                     # Static assets
├── package.json
├── tailwind.config.js
└── next.config.js
```

## Skills Showcased

- **Languages**: C++, Python, TypeScript, JavaScript
- **Frontend**: React, Next.js, Tailwind CSS
- **Backend**: Django, REST APIs, PostgreSQL
- **Cloud & AI**: GCP, Agentic Systems, LLMs

## License

MIT License - feel free to use this as a template for your own portfolio!

## Support

For questions or suggestions, feel free to reach out!
