# WiTCON Frontend

Welcome to the WiTCON frontend directory!

**Tech Stack:**
- React via Vite
- TypeScript 
- Tailwind CSS V4 (**Important:** V4 config no longer uses a tailwind.config.js file so all global styles will fall under `index.css`)

## Installation steps

0. Ensure you already have Node, npm and TypeScript installed globally (you can check by running `node -v && npm -v && tsc -v` from your computer's global terminal/shell). If any of those commands return as not recognized, please install it.
1. From your terminal, wherever you want to create the directory from, run `git clone https://github.com/wicsfiu/witcon2026.git`.
2. Open the newly created folder on VSCode
3. From VSCode terminal, cd into the `witcon-frontend` folder. You **must** cd into this folder before installing your node modules 
4. Install the necessary packages/node modules by running `npm i`
5. Run the app by running `npm run dev`
6. Your application will get deployed locally to http://localhost:5173/