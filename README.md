# Anayo - Personal Portfolio (React + Tailwind + Framer Motion)

This is a dark-themed, animated personal portfolio scaffold built with React (JSX), Tailwind CSS and Framer Motion.

## Frontend

1. Install dependencies

```bash
cd "C:/Users/User/Downloads/vis/New folder/My profi/portfolio"
npm install
```

2. Create the frontend environment file

```bash
copy .env.example .env
```

For production, set the same value in your hosting dashboard:

```bash
VITE_API_BASE_URL=your key
```

3. Run development server

```bash
npm run dev
```

4. Build for production

```bash
npm run build
```

## Backend contact email

The contact form posts to `/api/contact`. In development, Vite proxies that path to the Node backend on port 5000.

1. Install backend dependencies

```bash
cd "C:/Users/User/Downloads/vis/New folder/My profi/backend"
npm install
```

2. Create backend environment file

```bash
copy .env.example .env
```

3. Add your Resend API key in `backend/.env`

```bash
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL="Portfolio Contact <your_verified_sender@example.com>"
CONTACT_TO_EMAIL=acnwa1234@gmail.com
```

4. Run both apps in separate terminals

```bash
cd "C:/Users/User/Downloads/vis/New folder/My profi/backend"
npm run dev
```

```bash
cd "C:/Users/User/Downloads/vis/New folder/My profi/portfolio"
npm run dev
```

## Notes

- This project uses Vite, Tailwind CSS and Framer Motion.
- All main pages are under `src/pages/*` and reusable UI is in `src/components`.
- Edit text and replace placeholders with your real content and images.
