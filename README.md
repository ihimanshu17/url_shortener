# URL Shortener

A **responsive and professional URL shortener** built with **React** and **Material-UI**. Users can shorten URLs, set custom short codes, define expiration times, and track click statistics.

---

## Features

- Shorten URLs quickly
- Optionally use **custom short codes**
- Set **URL expiration time**
- Track **click statistics** including timestamp, referrer, and location
- Copy short links with one click
- Fully **responsive and mobile-friendly**
- Modern UI with **Material-UI components**
- Persistent data stored using **localStorage**
- Smooth hover effects and transitions

---

## Technologies Used

- **React** - Frontend library for building UI
- **Material-UI (MUI)** - Component library for professional interface
- **React Router** - Navigation between pages
- **localStorage** - Persistent storage for links
- **JavaScript (ES6+)**
- **CSS via Material-UI styling** - Responsive and modern design

---

## Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/url-shortener.git
cd url-shortener
```

2. **Install dependencies**

   ```bash
   npm install
   ```
3. **Run the development server**
   
   ```bash
   npm start
   ```
Open http://localhost:3000 in your browser to view the app.

---

## Usage

1. Enter a **long URL** in the input field.
2. Optionally, enter a **custom short code** and **validity time** (in minutes).
3. Click **Shorten** to generate a short URL.
4. Copy the short URL using the **Copy** button.
5. Visit the **Stats** page to see detailed click statistics.
6. Access short links via `/{shortCode}` in the browser.

---

## Future Improvements

- Add **dark mode** toggle
- Connect to a **backend API** for persistent storage
- Implement **user authentication** to manage personal links
- Include **analytics charts** for click trends

