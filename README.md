# Pocket Packs: A Pokémon TCG Digital Collection App

Welcome to Pocket Packs! This is a web application built with Next.js that allows you to open digital Pokémon card booster packs, manage your collection, and track your progress.

## ✨ Features

- **Authentication:** Secure user sign-up and login with Email/Password or Google Sign-In, powered by Firebase Authentication.
- **Persistent Data:** All user data, including your card collection, currency, and booster packs, is saved to a secure Firestore database.
- **Pack Opening:** Experience the thrill of opening virtual booster packs with a polished, interactive animation.
- **Card Collection:** View all the cards you've collected. You can search by name and filter by card type or rarity.
- **Collection Binder:** Track your set completion progress. See which cards you own and which you're missing from each set in a virtual binder.
- **In-Game Store:** Use in-game currency to purchase more booster packs from the Poké Mart.
- **Daily Rewards:** Log in every day to claim free currency.

## 🚀 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (with App Router)
- **UI:** [React](https://reactjs.org/) & [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Backend & Database:** [Firebase](https://firebase.google.com/) (Authentication, Firestore)
- **AI Integration:** [Genkit](https://firebase.google.com/docs/genkit) (for future AI features)

## 🏁 Getting Started

To run this project locally, follow these steps:

### 1. Install Dependencies

First, install the necessary npm packages:

```bash
npm install
```

### 2. Set Up Firebase

This project requires a Firebase project to handle authentication and data storage.

1.  Create a project on the [Firebase Console](https://console.firebase.google.com/).
2.  Add a new **Web App** to your project.
3.  Go to **Project Settings** > **General** and find your Firebase SDK setup snippet.
4.  Create a file named `.env.local` in the root of your project if it doesn't exist.
5.  Copy your Firebase configuration into `.env.local` as environment variables. It should look like this:

```
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-auth-domain"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
```

### 3. Set Up Firestore Security Rules

For security, it's crucial to set up Firestore rules. Copy the contents of `firestore.rules` and paste them into the **Rules** tab of your Firestore database in the Firebase Console.

### 4. Run the Development Server

Now you can start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or the port specified in your `package.json`) with your browser to see the result.

## 📄 Available Pages

- `/` - Login page
- `/signup` - Sign-up page
- `/dashboard` - The main player dashboard with stats and quick actions.
- `/dashboard/open-packs` - The pack opening experience.
- `/dashboard/collection` - Your complete card collection with search and filters.
- `/dashboard/binder` - The virtual binder to track set completion.
- `/dashboard/store` - The Poké Mart to buy more packs.
