# MD. SAZZAD HOSEN SHUVO — Personal Dashboard & Portfolio Web Application

A modern, high-performance Personal Dashboard, ATS-Friendly CV Builder, and Project/Certificate Showcase built with **Next.js 15 (App Router)**, **React 19**, **Tailwind CSS**, and **Lucide React**.

---

## 🌟 Key Features

### 1. Global System & Architecture
- **Persistent Day / Night Mode**: Seamless toggle between light mode and sleek obsidian dark mode, persisted via `localStorage` with system preference detection.
- **Glassmorphism Design System**: Modern translucent cards, subtle gradients, border glows, and responsive layout for mobile, tablet, and desktop.
- **Navigation Bar**: Sticky glassmorphic navbar with active route indicators, mobile drawer menu, and quick contact buttons.

### 2. Page 1: Personal Dashboard (`/`)
- **Complete Injected Personal & Professional Records**:
  - Full Name: **MD. SAZZAD HOSEN SHUVO (মোঃ সাজ্জাদ হোসেন শুভ)**
  - Parents: **MD. ASRAFUL HAQUE (মোঃ আশরাফুল হক)** & **MOST. SALINA EASMIN (মোছাঃ সেলিনা ইয়াসমিন)**
  - Date of Birth: **31-May-2003**
  - Blood Group: **B+ (Positive)**
  - NID No: **9581214047**
  - Mobile: **01719052334**
  - Email: **shazzedshuvo@gmail.com**
  - Address: **Nijbari, Debengarh, Tetulia, Panchagarh - 5030**
- **Education Timeline**:
  - BSc in CSE — Uttara University (Batch 66)
  - Diploma in Computer Science Technology — BTEB (Passing Year: 2024, GPA: 3.24)
  - SSC Vocational in Computer and IT — BTEB (Passing Year: 2020, GPA: 4.50)
- **Interactive Copy-to-Clipboard**: Quick copy buttons next to all essential fields with animated visual feedback.
- **Categorized Technical Skills**: Frontend, Backend, CMS Platforms (WordPress, Wix, Squarespace), and Workflow Tools.

### 3. Page 2: ATS-Friendly CV Builder (`/cv-builder`)
- **ATS Compliant Layout**: Pure machine-readable structure, standard typography (Arial/Roboto), clear headings, and zero parser obstacles.
- **Format Toggle**: Switch between **Standard Single-Column (100% ATS Safe)** and **Clean Structured Two-Column**.
- **Section Customization**: Toggle Experience, Projects, Education, and Skills on the fly.
- **High-Fidelity PDF Export**: Integrated print stylesheet with `@media print` rules ensuring clean A4 margins, avoiding page breaks inside sections, and removing navbar/footer.

### 4. Page 3: Project & File Showcase (`/showcase`)
- **Interactive Drag-and-Drop Uploader**: Drop certificates (JPG, PNG, WebP) or PDF documents to immediately render them.
- **Local State & Persistence**: Uses `localStorage` to save uploads.
- **Rich Pre-loaded Portfolio Files**: Pre-configured with BTEB Diploma and SSC certificates, OmniStore e-commerce preview, and verified resumes.
- **Filtering & Search**: Filter by *Certificates*, *Projects*, or *Documents*, or search by keyword.
- **Modal Preview**: Fullscreen inspection modal for images and documents.

---

## 📁 Project Directory Structure

```text
nijer detail/
├── src/
│   ├── app/
│   │   ├── cv-builder/
│   │   │   └── page.tsx       # ATS-Friendly CV Builder & PDF Export
│   │   ├── showcase/
│   │   │   └── page.tsx       # Drag-and-Drop File Upload & Gallery
│   │   ├── globals.css        # Glassmorphic utilities, Tailwind, and ATS print styles
│   │   ├── layout.tsx         # Root layout with Theme & Showcase providers
│   │   └── page.tsx           # Page 1: Personal Dashboard
│   ├── components/
│   │   ├── Card.tsx           # Glassmorphism container component
│   │   ├── CopyButton.tsx     # Copy-to-clipboard with checkmark feedback
│   │   ├── Navbar.tsx         # Responsive navbar with mobile drawer
│   │   └── ThemeToggle.tsx    # Animated Sun/Moon dark mode toggle
│   ├── context/
│   │   ├── ShowcaseContext.tsx# State management for showcase gallery & uploads
│   │   └── ThemeContext.tsx   # Persistent theme provider
│   └── data/
│       └── personalData.ts    # Centralized personal & professional records
├── public/
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

---

## 🚀 Running the Application

The development server is running on `http://localhost:3000`.

To restart or run in another terminal:
```bash
# Run Development Server
npm run dev

# Run Production Build
npm run build
npm run start
```
