# UIDEC

1. Use the template and clone your new repo to your computer
2. Run `npm install` to install dependencies
3. Get an OpenAI API key from [platform.openai.com/api-keys](https://platform.openai.com/api-keys). Make sure
   you are at least a
   [Tier 1](https://platform.openai.com/docs/guides/rate-limits/usage-tiers) API
   user, which means you have access to GPT-4 Vision. You can check your tier on
   the [OpenAI API Limits](https://platform.openai.com/account/limits).
4. Create a `.env.local` file with the following variables:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   NEXT_PUBLIC_POCKETBASE_URL=http://127.0.0.1:8090/
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   ```
5. Set up Pocketbase for local development (see below)
6. Run `npm run dev`
7. Open [localhost:3000](http://localhost:3000) and make some stuff real!

## Setting up Pocketbase locally

1. Download Pocketbase from [pocketbase.io/downloads](https://pocketbase.io/downloads) for your operating system
2. Extract the downloaded zip file to a location of your choice
3. Open a terminal and navigate to the extracted directory
4. Start Pocketbase by running:
   ```
   ./pocketbase serve
   ```
5. Pocketbase will start running at `http://127.0.0.1:8090`
6. Open `http://127.0.0.1:8090/_/` in your browser to access the admin UI
7. Create an admin account when prompted
8. Make sure your `.env.local` file has the correct Pocketbase URL as shown in step 4 of the installation instructions
9. You'll need to create the necessary collections in Pocketbase to match the application's data model (users, industries, ui_screens, etc.)
