# DAWN - Digital AI Workflow Navigator

**DAWN** is an intelligent pharmaceutical marketing campaign platform that streamlines the entire lifecycle of creating, reviewing, and distributing compliant medical content for pharmaceutical brands.

## 🚀 What is DAWN?

DAWN automates the complex workflow from clinical evidence selection to content generation, MLR (Medical Legal Regulatory) review, distribution, and effectiveness tracking — reducing campaign creation time from weeks to days.

### Key Features

- 📚 **Content Finder**: AI-powered clinical document analysis and ranking
- 📝 **Brief Builder**: Auto-generate or manually create campaign briefs
- 🎨 **Multi-Format Content**: Generate posters, emails, leaflets, and digital detail aids
- ✅ **MLR Pre-Screening**: AI compliance checking before regulatory submission
- 🌍 **Multi-Language**: Regional adaptation with appropriate tone and regulations
- 📊 **Analytics**: Real-time campaign performance tracking
- 🔔 **Veeva Integration**: Connect to Veeva Vault and Promomats

## 📖 Documentation

**New to DAWN?** Start here:

| Document | Description | Read Time |
|----------|-------------|-----------|
| **[QUICKSTART.md](./QUICKSTART.md)** | Get started in 5 minutes, create your first campaign | 10 min |
| **[DOCUMENTATION.md](./DOCUMENTATION.md)** | Complete feature reference, workflows, and best practices | 30 min |
| **[ARCHITECTURE.md](./ARCHITECTURE.md)** | Technical deep dive for developers | 25 min |
| **[README_DOCS.md](./README_DOCS.md)** | Documentation navigation guide | 5 min |

## 🏃 Quick Start

### Installation

```bash
# Install dependencies
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### Development

```bash
# Start the development server
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Your First Campaign

1. The chat interface will auto-start after 1 second
2. Send the pre-populated message to set up a Hemlibra campaign
3. Follow the AI-guided workflow through 10 stages:
   - Campaign Setup
   - Content Finder (select clinical evidence)
   - Brief Builder (manual or auto)
   - Template Selection
   - Content Creator
   - Image Generator
   - MLR Review
   - Distribution
   - Effectiveness Analytics

**Full tutorial**: See [QUICKSTART.md](./QUICKSTART.md)

## 🎯 Use Cases

1. **New Product Launch**: Create multi-market campaigns in 2-3 days
2. **Regional Adaptation**: Generate market-specific content with appropriate tone
3. **MLR Pre-Screening**: Catch compliance issues before submission
4. **Performance Optimization**: Monitor and optimize ongoing campaigns

**Detailed examples**: See [DOCUMENTATION.md](./DOCUMENTATION.md#use-cases)

## 🛠️ Technology Stack

- **Framework**: Next.js 16.1.6 (App Router)
- **React**: 19.2.3
- **TypeScript**: 5
- **Styling**: Tailwind CSS 4
- **Charts**: Recharts 3.8.0
- **Icons**: Lucide React

## 📦 Project Structure

```
dawn/
├── app/                    # Next.js app router
│   ├── chat/              # Main chat interface
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/
│   ├── chat/              # Chat UI components
│   ├── modals/            # 11 feature modals
│   └── shared/            # Reusable components
├── context/
│   └── DAWNContext.tsx    # Global state management
├── data/                  # Clinical documents (PDFs)
├── lib/
│   ├── mockData.ts        # Mock data for demo
│   ├── storyline.ts       # Conversation flow (10 steps)
│   └── types.ts           # TypeScript definitions
└── public/
    ├── data/              # Public data files
    └── templates/         # Template previews
```

## 🔧 Development

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

### Type Check

```bash
npx tsc --noEmit
```

## 🌟 Key Features Overview

### 1. Content Finder
Select from HAVEN 1-7 clinical trials with AI relevance scoring. Preview PDFs and filter by document type.

### 2. Brief Builder
**Two modes**:
- **Auto**: AI extracts key messages from clinical evidence
- **Manual**: Enter your own campaign briefs

### 3. Content Creator
Generate content with persona-specific tone:
- Clinical Researcher (technical)
- Empathetic Specialist (patient-centric)
- Conservative Specialist (formal, data-driven)
- Patient-Friendly (Grade 6-8 readability)

### 4. MLR Pre-Screening
AI-powered compliance checking:
- Tier-based risk assessment
- Fair balance scoring
- Substantiation verification
- Puffery detection
- ISI completeness

### 5. Multi-Language Support
Regional adaptation with translation-in-template approach. Supports US, Germany, EMEA with appropriate personas.

### 6. Analytics Dashboard
Real-time metrics:
- Email open rates & CTR
- Digital Detail Aid engagement time
- Prescription switches
- Market-by-market performance
- Optimization recommendations

**Full feature list**: See [DOCUMENTATION.md](./DOCUMENTATION.md#key-features)

## 🎓 Learning Paths

### Basic User (30 min)
1. Read QUICKSTART.md
2. Run first campaign
3. Review use cases

### Power User (2 hours)
1. Complete basic user path
2. Read Features Deep Dive
3. Study Best Practices

### Developer (4 hours)
1. Read ARCHITECTURE.md
2. Review codebase
3. Try modifying components

## 🔮 Roadmap

### Current Version (Demo)
- ✅ Client-side storyline-driven workflow
- ✅ 10-stage campaign creation process
- ✅ Mock clinical document integration
- ✅ Simulated MLR pre-screening
- ✅ Performance dashboard mockups

### Future Enhancements
- [ ] Real AI integration (OpenAI/Claude)
- [ ] Backend API and database
- [ ] Live Veeva Vault integration
- [ ] Real-time collaboration
- [ ] PDF document analysis
- [ ] Custom medical prompt library
- [ ] Mobile app for field force

**Full roadmap**: See [DOCUMENTATION.md](./DOCUMENTATION.md#roadmap--future-enhancements)

## 🤝 Contributing

DAWN is currently a proprietary demonstration platform. For collaboration inquiries, please contact the development team.

## 📄 License

Proprietary software. All rights reserved.

## 🆘 Support

- **Documentation**: See [README_DOCS.md](./README_DOCS.md) for navigation
- **Quick Start**: [QUICKSTART.md](./QUICKSTART.md)
- **Full Reference**: [DOCUMENTATION.md](./DOCUMENTATION.md)
- **Technical Details**: [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions

## 🙏 Acknowledgments

Built with Next.js, React, TypeScript, and Tailwind CSS.

---

**Transform your pharmaceutical marketing workflow from weeks to days with DAWN.** 🚀
