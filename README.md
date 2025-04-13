🛠 Getting Started
First, install dependencies:

npm install

# or

yarn

# or

pnpm install

# or

bun install
Then, run the development server:

npm run dev

# or

yarn dev

# or

pnpm dev

# or

bun dev
Open http://localhost:3000 to view it in your browser.

🗂 Project Structure
src/
├─ app/ → App Router entrypoint
├─ components/ → Reusable UI components
├─ store/ → Zustand stores (e.g., basket)
├─ types/ → Shared TypeScript interfaces
├─ styles/ → Tailwind and global styles
├─ utils/ → Helper functions/utilities
├─ middleware.ts → Clerk auth middleware
├─ tailwind.config.ts → Tailwind config with themes + plugins
🔑 Environment Variables
You'll need to set up your .env.local:

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_public_key
CLERK_SECRET_KEY=your_secret_key
✅ Linting & Formatting
npm run lint # Run ESLint
npm run format # Run Prettier
🧪 Coming Soon
✅ Checkout flow (Stripe or custom)
🖼 Product images & media handling
🧾 Order history and account dashboard
🔎 Search & filtering
📦 Deploying
The easiest way to deploy your app is via Vercel.

📚 Resources
Next.js Documentation
Clerk Docs
Tailwind CSS Docs
Zustand Docs
💻 Author & License
Crafted with ❤️ by [Your Name].
Open-sourced under the MIT license.
