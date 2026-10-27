export interface EducationItem {
  degree: string;
  institution: string;
  boardOrBatch?: string;
  roll?: string;
  group?: string;
  passingYear?: string;
  result?: string;
  description?: string;
}

export interface ProjectItem {
  title: string;
  description: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
}

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  location: string;
  description: string[];
}

export interface AddressDetails {
  careOf: string;
  village: string;
  district: string;
  upazila: string;
  postOffice: string;
  postCode: string;
  fullAddress: string;
}

export interface GovtJobDetails {
  applicantName: string;
  applicantNameBn: string;
  fathersName: string;
  fathersNameBn: string;
  mothersName: string;
  mothersNameBn: string;
  dob: string;
  ageTillGovtCutoff: string;
  nationality: string;
  religion: string;
  gender: string;
  maritalStatus: string;
  nid: string;
  birthRegistration: string;
  passportId: string;
  mobile: string;
  email: string;
  departmentalStatus: string;
  presentAddress: AddressDetails;
  permanentAddress: AddressDetails;
}

export interface PersonalData {
  fullName: string;
  fullNameBn: string;
  fathersName: string;
  fathersNameBn: string;
  mothersName: string;
  mothersNameBn: string;
  dob: string;
  bloodGroup: string;
  nid: string;
  mobile: string;
  email: string;
  address: string;
  profession: string;
  summary: string;
  photoUrl: string;
  signatureUrl: string;
  photoSpecs: string;
  signatureSpecs: string;
  govtDetails: GovtJobDetails;
  skills: {
    frontend: string[];
    backend: string[];
    cms: string[];
    tools: string[];
  };
  education: EducationItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
}

export const personalData: PersonalData = {
  fullName: "MD. SAZZAD HOSEN SHUVO",
  fullNameBn: "মোঃ সাজ্জাদ হোসেন শুভ",
  fathersName: "MD. ASRAFUL HAQUE",
  fathersNameBn: "মোঃ আশরাফুল হক",
  mothersName: "MOST. SALINA EASMIN",
  mothersNameBn: "মোছাঃ সেলিনা ইয়াসমিন",
  dob: "31-May-2003",
  bloodGroup: "B+ (Positive)",
  nid: "9581214047",
  mobile: "01719052334",
  email: "shazzedshuvo@gmail.com",
  address: "NIJBARI, DEBENGARH, TATILIA, PANCHAGARH - 5030",
  profession: "Web Developer, Web Designer & Web Specialist",
  photoUrl: "/uploads/applicant-photo.jpg",
  signatureUrl: "/uploads/applicant-signature.jpg",
  photoSpecs: "300 × 300 px • 21.9 KB (Govt Job Standard: < 100 KB)",
  signatureSpecs: "300 × 80 px • 5.0 KB (Govt Job Standard: < 60 KB)",
  summary: "Dynamic and detail-oriented Full-Stack Web Developer and Specialist with expertise in MERN Stack, Next.js, React, and popular CMS platforms (WordPress, Wix, Squarespace). Passionate about building robust, high-performance web applications with modern design systems and intuitive user interfaces. Proven track record in responsive design, API integration, and performance optimization.",
  govtDetails: {
    applicantName: "MD.SAZZAD HOSEN SHUVO",
    applicantNameBn: "মোঃ সাজ্জাদ হোসেন শুভ",
    fathersName: "MD.ASRAFUL HAQUE",
    fathersNameBn: "মোঃ আশরাফুল হক",
    mothersName: "MOST. SALINA EASMIN",
    mothersNameBn: "মোছাঃ সেলিনা ইয়াসমিন",
    dob: "31-May-2003",
    ageTillGovtCutoff: "23 Years 0 Months 2 Days (Till: 01-Jun-2026)",
    nationality: "Bangladeshi",
    religion: "Islam",
    gender: "Male",
    maritalStatus: "Single",
    nid: "9581214047",
    birthRegistration: "N/A",
    passportId: "N/A",
    mobile: "01719052334",
    email: "shazzedshuvo@gmail.com",
    departmentalStatus: "Not Applicable",
    presentAddress: {
      careOf: "MD ASRAFUL HAQUE",
      village: "NIJBARI, DEBENGARH, TATILIA, PANCHAGARH",
      district: "Panchagarh",
      upazila: "Tentulia",
      postOffice: "DEBENGARH",
      postCode: "5030",
      fullAddress: "Care Of: MD ASRAFUL HAQUE, Vill: NIJBARI, Post: DEBENGARH - 5030, Upazila: Tentulia, District: Panchagarh"
    },
    permanentAddress: {
      careOf: "MD ASRAFUL HAQUE",
      village: "NIJBARI, DEBENGARH, TATILIA, PANCHAGARH",
      district: "Panchagarh",
      upazila: "Tentulia",
      postOffice: "DEBENGARH",
      postCode: "5030",
      fullAddress: "Care Of: MD ASRAFUL HAQUE, Vill: NIJBARI, Post: DEBENGARH - 5030, Upazila: Tentulia, District: Panchagarh"
    }
  },
  skills: {
    frontend: ["React.js", "Next.js", "TypeScript", "JavaScript (ES6+)", "Tailwind CSS", "HTML5", "CSS3", "Redux Toolkit"],
    backend: ["Node.js", "Express.js", "MongoDB", "RESTful APIs", "Mongoose", "Firebase"],
    cms: ["WordPress", "Wix", "Squarespace", "WooCommerce", "Elementor Pro"],
    tools: ["Git & GitHub", "VS Code", "Postman", "Figma", "Vercel", "npm/yarn", "Webpack/Vite"]
  },
  education: [
    {
      degree: "BSc in Computer Science & Engineering (CSE)",
      institution: "Uttara University",
      boardOrBatch: "Batch 66",
      group: "Computer Science & Engineering",
      passingYear: "Ongoing / Enrolled",
      result: "In Progress",
      description: "Focused on Software Engineering, Data Structures, Algorithms, Database Management, and Web Technologies."
    },
    {
      degree: "Diploma-in-Engineering",
      institution: "Bangladesh Technical Education Board (BTEB)",
      boardOrBatch: "BTEB",
      roll: "500412",
      group: "Computer Science Technology",
      passingYear: "2024",
      result: "GPA: 3.24 (out of 4.00)",
      description: "Completed comprehensive 4-year technical coursework in Computer Science, Systems, Networking, and Programming fundamentals."
    },
    {
      degree: "S.S.C Vocational",
      institution: "Bangladesh Technical Education Board (BTEB)",
      boardOrBatch: "BTEB",
      roll: "200840",
      group: "Computer and Information Technology",
      passingYear: "2020",
      result: "GPA: 4.50 (out of 5.00)",
      description: "Foundational technical education in Computer Operations, Hardware, Networking, and Information Technology."
    }
  ],
  experience: [
    {
      role: "Full-Stack Web Developer & CMS Specialist",
      company: "Freelance & Independent Projects",
      period: "2022 - Present",
      location: "Remote / Bangladesh",
      description: [
        "Architected and deployed responsive full-stack applications using Next.js, React, Tailwind CSS, Node.js, and MongoDB.",
        "Customized and developed 30+ bespoke websites on WordPress, Wix, and Squarespace for international and local clients.",
        "Integrated secure REST APIs, third-party payment gateways, and authentication workflows.",
        "Delivered 98%+ PageSpeed scores by optimizing Core Web Vitals, asset compression, and lazy loading strategies."
      ]
    },
    {
      role: "Frontend Developer & UI Specialist",
      company: "Tech Solutions & Web Agency",
      period: "2021 - 2022",
      location: "Dhaka, Bangladesh",
      description: [
        "Crafted pixel-perfect, mobile-first interactive user interfaces from Figma designs using React and Tailwind CSS.",
        "Collaborated with cross-functional teams to debug, refactor, and modernize legacy frontends into modern single-page applications.",
        "Maintained version control systems and implemented automated deployment pipelines on Vercel and Netlify."
      ]
    }
  ],
  projects: [
    {
      title: "OmniStore - Modern E-Commerce Platform",
      description: "A full-featured MERN stack e-commerce web application with real-time cart synchronization, user authentication, Stripe payment processing, and comprehensive admin dashboard.",
      technologies: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS", "Redux"],
      liveUrl: "https://example.com/omnistore",
      githubUrl: "https://github.com/shuvo-dev/omnistore",
      featured: true
    },
    {
      title: "NextGen Portfolio & Personal Brand Hub",
      description: "An ultra-modern, high-performance portfolio application with dark mode persistence, live ATS CV generator, and dynamic showcase gallery.",
      technologies: ["Next.js 15", "React 19", "Tailwind CSS", "TypeScript", "Lucide Icons"],
      liveUrl: "https://example.com/portfolio",
      githubUrl: "https://github.com/shuvo-dev/nextjs-portfolio",
      featured: true
    },
    {
      title: "EduPortal - Institutional Learning Management System",
      description: "Course management and student enrollment web portal built for academic institutions with role-based access control and analytics.",
      technologies: ["MERN Stack", "JWT Auth", "REST API", "Tailwind CSS"],
      liveUrl: "https://example.com/eduportal",
      githubUrl: "https://github.com/shuvo-dev/eduportal",
      featured: false
    },
    {
      title: "Agency Showcase - Custom WordPress & WooCommerce",
      description: "High-converting corporate agency and e-commerce portal with custom ACF fields, WooCommerce checkout, and lightning-fast caching.",
      technologies: ["WordPress", "WooCommerce", "PHP", "Elementor Pro", "Custom CSS"],
      liveUrl: "https://example.com/agency",
      githubUrl: "https://github.com/shuvo-dev/wp-agency",
      featured: false
    }
  ]
};
