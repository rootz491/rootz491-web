# Rootz491 Web

A modern Next.js application with Tailwind CSS for styling, built with TypeScript for type safety.

## 🚀 Features

- **Next.js 14+** with App Router
- **Tailwind CSS** for utility-first styling
- **TypeScript** for type safety
- **ESLint** for code quality
- **Responsive design** with mobile-first approach
- **Dark mode support** built-in

## 📋 Prerequisites

- Node.js 18.17 or later
- npm, yarn, pnpm, or bun

## 🛠️ Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css     # Global styles with Tailwind directives
│   ├── layout.tsx      # Root layout component
│   └── page.tsx        # Home page component
├── components/         # Reusable components (add as needed)
└── lib/               # Utility functions (add as needed)
```

## 🎨 Styling

This project uses Tailwind CSS for styling:

- Utility-first CSS framework
- Responsive design with mobile-first approach
- Custom CSS variables for theming
- Dark mode support built-in

### Customizing Styles

- Edit `tailwind.config.js` to customize Tailwind configuration
- Add custom styles in `src/app/globals.css`
- Use Tailwind utility classes in your components

## 🔧 Configuration Files

- `next.config.js` - Next.js configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration
- `tsconfig.json` - TypeScript configuration
- `.eslintrc.json` - ESLint configuration

## 📝 Development Guidelines

- Use functional components with TypeScript
- Follow Tailwind CSS utility-first approach
- Use Next.js App Router conventions
- Implement responsive design patterns
- Use semantic HTML elements
- Follow Next.js best practices for performance

## 🚀 Deployment

This Next.js application can be deployed to various platforms:

- **Vercel** (recommended): Connect your GitHub repository for automatic deployments
- **Netlify**: Build command: `npm run build`, Output directory: `out`
- **AWS**, **Google Cloud**, **Azure**: Build and deploy the `.next` folder

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.