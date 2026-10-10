import { Project, SkillItem, ZoneInfo } from '../types/portfolio';

export const ZONES: ZoneInfo[] = [
  {
    id: 'start',
    name: 'Design Studio Lobby',
    nameBn: 'ডিজাইনার স্টুডিও লবি',
    x: 0,
    z: 0,
    radius: 10,
    color: '#38bdf8',
    description: 'Welcome to Shawon’s 3D Graphic Design Studio! Drive the creative RC buggy to explore design works, branding kits, and packaging.',
    descriptionBn: 'গ্রাফিক্স ডিজাইনার শাওনের ৩ডি ক্রিয়েটিভ স্টুডিওতে স্বাগতম! গাড়ি চালিয়ে লোগো, ব্র্যান্ডিং, ৩ডি প্যাকেজিং ও পোস্টার ডিজাইন ঘুরে দেখুন।'
  },
  {
    id: 'projects',
    name: 'Design Showcase Gallery',
    nameBn: 'গ্রাফিক্স ডিজাইন প্রদর্শনী',
    x: 32,
    z: -28,
    radius: 14,
    color: '#f97316',
    description: 'Explore brand identities, 3D packaging mockups, social media advertising designs, and billboard prints.',
    descriptionBn: 'লোগো ও ব্র্যান্ড আইডেন্টিটি, ৩ডি প্রোডাক্ট প্যাকেজিং, সোশ্যাল মিডিয়া ব্যানার ও বিলবোর্ড প্রিন্ট ডিজাইনের কেস স্টাডি।'
  },
  {
    id: 'skills',
    name: 'Design Tools Playground',
    nameBn: 'ডিজাইন সফটওয়্যার ও টুলস',
    x: -32,
    z: -28,
    radius: 14,
    color: '#8b5cf6',
    description: 'Interactive 3D blocks of Photoshop, Illustrator, Blender, InDesign, and Figma. Crash into them to knock them down!',
    descriptionBn: 'ফটোশপ, ইলাস্ট্রেটর, ব্লেন্ডার, ইনডিজাইন ও ফিগমা ৩ডি ব্লক। গাড়ি দিয়ে ধাক্কা দিয়ে ফেলে দিন ও পুনরায় সাজান!'
  },
  {
    id: 'playground',
    name: 'CMYK Color Splash Ramp',
    nameBn: 'কালার স্প্ল্যাশ র‍্যাম্প ও আর্ট বোলিং',
    x: 0,
    z: -48,
    radius: 14,
    color: '#ec4899',
    description: 'Launch off the high-speed mega ramp into vibrant CMYK pigment pins with explosive colorful confetti!',
    descriptionBn: 'হাই-স্পিড মেগা র‍্যাম্প দিয়ে উড়ে গিয়ে রঙিন সিএমওয়াইকে (CMYK) আর্ট পিনে ধাক্কা দিন এবং রঙিন কনফেটি উপভোগ করুন!'
  },
  {
    id: 'about',
    name: 'Creative Studio Workstation',
    nameBn: 'শাওনের ক্রিয়েটিভ আর্ট স্টুডিও',
    x: -32,
    z: 28,
    radius: 14,
    color: '#10b981',
    description: 'Graphic designer desk diorama featuring drawing tablets, Pantone swatch fan decks, dual proofing monitors, and bio.',
    descriptionBn: 'ড্রয়িং ট্যাবলেট, প্যান্টোন কালার গাইড, ডুয়াল মনিটর ও ডিজাইন অ্যাওয়ার্ড সহ শাওনের আর্ট স্টুডিও ডেস্mod ও পরিচিতি।'
  },
  {
    id: 'contact',
    name: 'Design Brief & Orders',
    nameBn: 'ডিজাইন অর্ডার ও যোগাযোগ',
    x: 32,
    z: 28,
    radius: 14,
    color: '#06b6d4',
    description: 'Order custom logo designs, brand packaging, social media banners, or send a creative project brief.',
    descriptionBn: 'নতুন লোগো, ব্র্যান্ড আইডেন্টিটি, প্যাকেজিং বা সোশ্যাল মিডিয়া ক্যাম্পেইনের জন্য অর্ডার দিন বা সরাসরি যোগাযোগ করুন।'
  }
];

export const PROJECTS: Project[] = [
  {
    id: '3d-packaging-render',
    title: '3D Luxury Packaging & Bottle Mockups',
    titleBn: '৩ডি লাক্সারি প্যাকেজিং ও বোতল মকআপ',
    tagline: 'Photorealistic 3D product renders, embossed retail boxes, and cinematic studio lighting',
    taglineBn: 'রিয়েলিস্টিক ৩ডি প্রোডাক্ট রেন্ডারিং, প্যাকেজিং বক্স ও স্টুডিও লাইটিং',
    category: '3D Packaging',
    description: 'High-end cosmetic bottles, perfume packaging, beverage cans, and retail boxes crafted with custom PBR materials, metallic gold foil stamping, frosted glass, and 4K commercial-grade render setups ready for advertising and print production.',
    descriptionBn: 'উচ্চমানের কসমেটিক ও পারফিউম বোতল, বেভারেজ ক্যান এবং রিটেইল প্যাকেজিং মকআপ ডিজাইন—গোল্ড ফয়েল স্ট্যাম্পিং, ফ্রস্টেড গ্লাস ও প্রফেশনাল স্টুডিও লাইটিং সহ ৪কে কমার্শিয়াল রেন্ডার।',
    tags: ['Blender 3D', 'Adobe Photoshop', 'Cinema 4D', 'PBR Materials', 'KeyShot'],
    metrics: '4K Ultra-HD · 150+ Commercial Renders · 100% Print-Ready',
    githubUrl: 'https://behance.net',
    liveUrl: 'https://dribbble.com',
    color: '#ea580c',
    highlights: [
      'Custom gold & holographic foil procedural shader materials',
      'Accurate studio 3-point softbox lighting and glass caustics refraction',
      'Die-cut packaging dieline layout ready for industrial offset printing',
      'Multi-angle promotional shots and 360-degree turntable product visual'
    ],
    highlightsBn: [
      'কাস্টম গোল্ড ও হলোগ্রাফিক ফয়েল শেডার ম্যাটেরিয়ালস',
      'পারফেক্ট স্টুডিও সফটবক্স লাইটিং ও গ্লাস রিফ্র্যাকশন',
      'প্রিন্ট-রেডি ডাই-কাট প্যাকেজিং লেআউট',
      '৩৬০-ডিগ্রি টার্নটেবল ও মাল্টি-অ্যাঙ্গেল ভিজ্যুয়াল শট'
    ]
  },
  {
    id: 'brand-identity-system',
    title: 'Apex Brand Identity & Corporate Guidelines',
    titleBn: 'এপেক্স ব্র্যান্ড আইডেন্টিটি ও লোগো সিস্টেম',
    tagline: 'Complete corporate visual identity, geometric logo mark, and comprehensive brand book',
    taglineBn: 'পূর্ণাঙ্গ করপোরেট ব্র্যান্ড আইডেন্টিটি, আধুনিক লোগো ও ব্র্যান্ডবুক',
    category: 'Logo & Branding',
    description: 'Comprehensive brand identity design including minimalist geometric logo symbols, typography hierarchy pairing, stationery set, color psychology guidelines, brand manual, and cohesive social media asset kits.',
    descriptionBn: 'একটি পূর্ণাঙ্গ করপোরেট ব্র্যান্ড আইডেন্টিটি ডিজাইন যার মধ্যে রয়েছে গোল্ডেন রেশিও লোগো, টাইপোগ্রাফি গাইডলাইন, স্টেশনারি ও সোশ্যাল মিডিয়া টেমপ্লেট।',
    tags: ['Adobe Illustrator', 'Brand Strategy', 'Typography', 'Figma', 'Print Production'],
    metrics: 'Complete Brand Book · 80+ Corporate Assets Delivered',
    githubUrl: 'https://behance.net',
    liveUrl: 'https://dribbble.com',
    color: '#2563eb',
    highlights: [
      'Golden ratio geometric logo construction with responsive lockups',
      'Carefully calibrated Pantone spot colors and CMYK print formulations',
      'Full corporate stationery: business cards, letterheads, presentation folders',
      '60-page PDF Brand Style Guide and brand governance manual'
    ],
    highlightsBn: [
      'গোল্ডেন রেশিও ভিত্তিক লোগো কনস্ট্রাকশন ও রেসপনসিভ ভ্যারিয়েশন',
      'Pantone স্পট কালার ও CMYK প্রিন্ট স্পেসিফিকেশন',
      'বিজনেস কার্ড, লেটারহেড ও ইনভয়েস স্টেশনারি প্যাকেজ',
      '৬০ পৃষ্ঠার ব্র্যান্ড গাইডবুক ও ব্যবহারের নিয়মাবলী'
    ]
  },
  {
    id: 'motion-social-creatives',
    title: 'CyberPulse Social Media Ads & Promotional Banners',
    titleBn: 'সাইবারপালস সোশ্যাল মিডিয়া ব্যানার ও রিল অ্যাড',
    tagline: 'High-converting social media creatives, reel animations, and kinetic typography',
    taglineBn: 'হাই-কনভার্টিং সোশ্যাল মিডিয়া ব্যানার, রিল মোশন ও কাইনেটিক টাইপোগ্রাফি',
    category: 'Social Media Ads',
    description: 'Dynamic advertising campaign graphics designed for Meta, YouTube, and TikTok with punchy kinetic typography, visual hooks, product feature highlights, and eye-catching color psychology.',
    descriptionBn: 'ফেসবুক, ইনস্টাগ্রাম ও টিকটকের জন্য দৃষ্টিনন্দন অ্যানিমেটেড বিজ্ঞাপন, কাইনেটিক টেক্সট এবং আকর্ষণীয় সোশ্যাল মিডিয়া ক্যাম্পেইন ব্যানার।',
    tags: ['After Effects', 'Photoshop', 'Premiere Pro', 'Motion Design', 'Canva Pro'],
    metrics: '+240% Ad CTR Boost · 60+ Animated Video Reels Produced',
    githubUrl: 'https://behance.net',
    liveUrl: 'https://dribbble.com',
    color: '#8b5cf6',
    highlights: [
      'Stop-motion visual hooks optimized for the first 3 seconds',
      'Smooth 60fps kinetic typography transitions and sound-synced cuts',
      'Square, portrait 9:16 and landscape formats for multi-platform delivery',
      'A/B tested visual hierarchy for maximum click-through conversion'
    ],
    highlightsBn: [
      'প্রথম ৩ সেকেন্ডে দর্শকের মনোযোগ আকর্ষণের বিশেষ ভিজ্যুয়াল হুক',
      'মসৃণ ৬০fps কাইনেটিক টাইপোগ্রাফি ও সাউন্ড-সিঙ্ক ট্রানজিশন',
      'স্টোরি, রিল ও ফিড পোস্টের জন্য উপযুক্ত রেসিও',
      'হাই কনভার্শনের জন্য অপ্টিমাইজড ভিজ্যুয়াল হায়ারার্কি'
    ]
  },
  {
    id: 'print-editorial-poster',
    title: 'Metropolis Billboard & Editorial Poster Collection',
    titleBn: 'মেট্রোপলিস বিলবোর্ড, ফ্লায়ার ও ফ্যাশন পোস্টার',
    tagline: 'Large-format outdoor billboards, typography posters, event flyers, and apparel prints',
    taglineBn: 'লার্জ-ফরম্যাট বিলবোর্ড, টাইপোগ্রাফি পোস্টার ও টি-শার্ট ডিজাইন',
    category: 'Print & Editorial',
    description: 'Striking outdoor advertising billboards, musical festival posters, luxury magazine editorial spreads, and apparel merchandise designs with bold Swiss typography and vibrant color grading.',
    descriptionBn: 'আউটডোর বিলবোর্ড, মিউজিক ফেস্টিভ্যাল পোস্টার, ফ্যাশন ম্যাগাজিন কভার এবং টি-শার্ট মার্চেন্ডাইজ ডিজাইন—সুইস টাইপোগ্রাফি ও দৃষ্টিনন্দন কালার গ্রেডিং সহ।',
    tags: ['Adobe Illustrator', 'InDesign', 'Photoshop', 'Print Media', 'Typography'],
    metrics: '300 DPI High-Resolution · 100% CMYK Vector Vectorized',
    githubUrl: 'https://behance.net',
    liveUrl: 'https://dribbble.com',
    color: '#059669',
    highlights: [
      'High-resolution 300 DPI print-ready CMYK files with bleed margins',
      'Experimental Swiss grid typography and bespoke headline lettering',
      'Realistic photorealistic outdoor billboard mockups and street posters',
      'Vector t-shirt screen printing separations and apparel colorways'
    ],
    highlightsBn: [
      '৩০০ ডিপিআই হাই-রেজোলিউশন প্রিন্ট-রেডি CMYK ফাইল ও ব্লিড মার্জিন',
      'এক্সপেরিমেন্টাল সুইস গ্রিড টাইপোগ্রাফি ও কাস্টম হেডলাইন লেটারিং',
      'রিয়েলিস্টিক আউটডোর বিলবোর্ড মকআপ ও স্ট্রিট পোস্টার',
      'স্ক্রিন প্রিন্টিংয়ের জন্য টি-শার্ট কালার সেপারেশন ফাইল'
    ]
  }
];

export const SKILLS: SkillItem[] = [
  { id: 'photoshop', name: 'Adobe Photoshop', category: 'Adobe Creative Suite', level: 98, color: '#38bdf8' },
  { id: 'illustrator', name: 'Adobe Illustrator', category: 'Adobe Creative Suite', level: 97, color: '#f59e0b' },
  { id: 'blender', name: 'Blender 3D Modeling', category: '3D & Motion', level: 92, color: '#ea580c' },
  { id: 'indesign', name: 'Adobe InDesign', category: 'Adobe Creative Suite', level: 90, color: '#ec4899' },
  { id: 'aftereffects', name: 'After Effects Motion', category: '3D & Motion', level: 88, color: '#8b5cf6' },
  { id: 'figma', name: 'Figma & UI Graphics', category: 'Branding & Vector', level: 94, color: '#a855f7' },
  { id: 'branding', name: 'Brand Identity & Logo', category: 'Branding & Vector', level: 96, color: '#3b82f6' },
  { id: 'typography', name: 'Typography & Lettering', category: 'Branding & Vector', level: 95, color: '#10b981' },
  { id: 'packaging', name: 'Packaging & Dielines', category: 'Print & Media', level: 93, color: '#eab308' },
  { id: 'cinema4d', name: 'Cinema 4D Visuals', category: '3D & Motion', level: 85, color: '#0284c7' },
  { id: 'socialmedia', name: 'Social Media Ad Design', category: 'Print & Media', level: 98, color: '#06b6d4' },
  { id: 'cmykprint', name: 'CMYK & Print Production', category: 'Print & Media', level: 94, color: '#f43f5e' }
];

export const PROFILE_INFO = {
  name: 'Graphics Designer Shawon',
  nameBn: 'গ্রাফিক্স ডিজাইনার শাওন',
  role: 'Professional Graphics Designer & 3D Visualizer',
  roleBn: 'প্রফেশনাল গ্রাফিক্স ডিজাইনার ও ৩ডি আর্টিস্ট',
  bio: 'Specializing in visual brand identities, 3D product renders, packaging designs, advertising creatives, and motion graphics. Passionate about impactful typography, aesthetics, and high-conversion visual marketing.',
  bioBn: 'ব্র্যান্ড আইডেন্টিটি, ৩ডি প্রোডাক্ট রেন্ডার, প্যাকেজিং ডিজাইন, সোশ্যাল মিডিয়া ক্রিয়েটিভ এবং মোশন গ্রাফিক্স তৈরিতে অভিজ্ঞ। আকর্ষণীয় টাইপোগ্রাফি ও আধুনিক ভিজ্যুয়াল ডিজাইন তৈরিতে নিবেদিতপ্রাণ।',
  stats: [
    { label: 'Years Experience', labelBn: 'বছরের অভিজ্ঞতা', value: '5+' },
    { label: 'Design Projects', labelBn: 'ডিজাইন প্রজেক্ট', value: '150+' },
    { label: 'Happy Clients', labelBn: 'সন্তুষ্ট ক্লায়েন্ট', value: '90+' },
    { label: 'Positive Rating', labelBn: 'পজিটিভ ফিডব্যাক', value: '100%' }
  ],
  education: [
    {
      degree: 'BFA in Graphic Design & Visual Arts',
      degreeBn: 'বিএফএ ইন গ্রাফিক্স ডিজাইন ও ভিজ্যুয়াল আর্টস',
      school: 'Dhaka, Bangladesh',
      schoolBn: 'ঢাকা, বাংলাদেশ',
      period: '2019 – 2023'
    }
  ],
  experience: [
    {
      role: 'Lead Visual & 3D Designer',
      roleBn: 'লিড ভিজ্যুয়াল ও ৩ডি ডিজাইনার',
      company: 'Creative Media Studios',
      period: '2023 – Present',
      desc: 'Creating high-impact brand packaging, 3D photorealistic mockups, and international advertising campaigns.'
    },
    {
      role: 'Senior Graphic Designer',
      roleBn: 'সিনিয়র গ্রাফিক্স ডিজাইনার',
      company: 'PixelCraft Agency',
      period: '2021 – 2023',
      desc: 'Designed corporate identities, marketing brochures, motion banners, and UI design kits for global clients.'
    }
  ],
  socials: {
    github: 'https://behance.net',
    linkedin: 'https://linkedin.com',
    twitter: 'https://instagram.com',
    email: 'shawon.graphics.design@gmail.com'
  }
};
