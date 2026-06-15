import type { Campaign, CampaignData } from './types';
import type { TemplateGroupResponse } from '../types';
import { STORYLINE } from '../storyline';
import {
  CLINICAL_DOCUMENTS,
  COMPLIANCE_ASSETS,
  MOCK_BRIEF,
  GENERATED_ASSETS,
  MLR_ASSETS,
  DISTRIBUTION_CHANNELS,
  MARKET_METRICS,
  PERSONA_ENGAGEMENT,
  OPTIMIZATION_RECS,
  PLS_SCORES,
  PLS_PREVIEW,
} from '../mockData';

// ════════════════════════════════════════════════════════════════════════════
// BREXIVA — HR+/HER2− Metastatic Breast Cancer | Oncology Specialists | Global
// Deliverable: Congress Poster (default, original campaign)
//
// This bundle reuses the existing hand-authored Brexiva content from
// mockData.ts and storyline.ts so the original campaign is unchanged.
// ════════════════════════════════════════════════════════════════════════════

// Channel templates for the template-selector modal, read from the brand's
// Templates/<AssetType>/ folder. The subfolder is the asset type.
const TEMPLATE_ROOT = '/data/brexiva/Templates';
const tmplFile = (assetType: string, name: string) =>
  `${TEMPLATE_ROOT}/${encodeURIComponent(assetType)}/${encodeURIComponent(name)}.html`;

const templates: TemplateGroupResponse[] = [
  {
    assetType: 'Congress Poster',
    recommendedTemplates: [
      {
        id: 'classic-scientific-poster',
        name: 'Classic Scientific Poster',
        type: 'poster',
        description: 'Traditional academic layout with structured columns for clinical data.',
        structure: ['Title & Authors', 'Background', 'Methods', 'Results', 'Conclusion', 'References'],
        recommended: true,
        templateFile: tmplFile('Congress Poster', 'Classic Scientific Poster'),
      },
      {
        id: 'visual-impact-poster',
        name: 'Visual Impact Poster',
        type: 'poster',
        description: 'Bold, high-contrast layout that leads with key data callouts.',
        structure: ['Headline', 'Key Visual', 'Data Callouts', 'Takeaway'],
        recommended: false,
        templateFile: tmplFile('Congress Poster', 'Visual Impact Poster'),
      },
      {
        id: 'infographic-style-poster',
        name: 'Infographic Style Poster',
        type: 'poster',
        description: 'Graphic-forward layout with icons and visual data storytelling.',
        structure: ['Hero', 'Infographic Sections', 'Stats', 'Summary'],
        recommended: false,
        templateFile: tmplFile('Congress Poster', 'Infographic Style Poster'),
      },
      {
        id: 'modular-grid-poster',
        name: 'Modular Grid Poster',
        type: 'poster',
        description: 'Card-based modular grid for flexible content blocks.',
        structure: ['Header', 'Module Grid', 'Results Modules', 'Footer'],
        recommended: false,
        templateFile: tmplFile('Congress Poster', 'Modular Grid Poster'),
      },
      {
        id: 'landscape-widescreen-poster',
        name: 'Landscape Widescreen Poster',
        type: 'poster',
        description: 'Wide horizontal format suited to digital congress displays.',
        structure: ['Banner', 'Left Column', 'Center Data', 'Right Column'],
        recommended: false,
        templateFile: tmplFile('Congress Poster', 'Landscape Widescreen Poster'),
      },
    ],
  },
  {
    assetType: 'Email',
    recommendedTemplates: [
      {
        id: 'clinical-focus-email',
        name: 'Clinical Focus Email',
        type: 'email',
        description: 'Professional tone with clinical data emphasis for HCP outreach.',
        structure: ['Subject', 'Header', 'Clinical Data', 'Safety', 'CTA'],
        recommended: true,
        templateFile: tmplFile('Email', 'Clinical Focus Email'),
      },
      {
        id: 'data-highlight-email',
        name: 'Data Highlight Email',
        type: 'email',
        description: 'Data-forward layout that leads with key efficacy callouts.',
        structure: ['Subject', 'Key Data', 'Supporting Evidence', 'CTA'],
        recommended: false,
        templateFile: tmplFile('Email', 'Data Highlight Email'),
      },
      {
        id: 'newsletter-email',
        name: 'Newsletter Email',
        type: 'email',
        description: 'Multi-section newsletter format for ongoing engagement.',
        structure: ['Header', 'Featured Story', 'Sections', 'Footer'],
        recommended: false,
        templateFile: tmplFile('Email', 'Newsletter Email'),
      },
      {
        id: 'product-update-email',
        name: 'Product Update Email',
        type: 'email',
        description: 'Concise update format for product and evidence announcements.',
        structure: ['Subject', 'Update', 'Details', 'CTA'],
        recommended: false,
        templateFile: tmplFile('Email', 'Product Update Email'),
      },
    ],
  },
  {
    assetType: 'Patient Leaflet',
    recommendedTemplates: [
      {
        id: 'friendly-patient-guide',
        name: 'Friendly Patient Guide',
        type: 'leaflet',
        description: 'Warm, plain-language guide for patients and caregivers.',
        structure: ['Welcome', 'About Treatment', 'What to Expect', 'Safety', 'Support'],
        recommended: true,
        templateFile: tmplFile('Patient Leaflet', 'Friendly Patient Guide'),
      },
      {
        id: 'condition-awareness-leaflet',
        name: 'Condition Awareness Leaflet',
        type: 'leaflet',
        description: 'Disease-education leaflet focused on condition understanding.',
        structure: ['Condition', 'Symptoms', 'Management', 'Resources'],
        recommended: false,
        templateFile: tmplFile('Patient Leaflet', 'Condition Awareness Leaflet'),
      },
      {
        id: 'foldable-brochure',
        name: 'Foldable Brochure',
        type: 'leaflet',
        description: 'Tri-fold brochure layout for printed patient hand-outs.',
        structure: ['Cover', 'Inside Panels', 'Safety', 'Back Panel'],
        recommended: false,
        templateFile: tmplFile('Patient Leaflet', 'Foldable Brochure'),
      },
      {
        id: 'step-by-step-guide',
        name: 'Step-by-Step Guide',
        type: 'leaflet',
        description: 'Sequential walkthrough of the treatment journey.',
        structure: ['Step 1', 'Step 2', 'Step 3', 'Safety', 'Next Steps'],
        recommended: false,
        templateFile: tmplFile('Patient Leaflet', 'Step-by-Step Guide'),
      },
      {
        id: 'treatment-diary',
        name: 'Treatment Diary',
        type: 'leaflet',
        description: 'Trackable diary format for monitoring treatment and symptoms.',
        structure: ['Intro', 'Daily Log', 'Symptom Tracker', 'Notes'],
        recommended: false,
        templateFile: tmplFile('Patient Leaflet', 'Treatment Diary'),
      },
    ],
  },
  {
    assetType: 'Digital Detail Aid',
    recommendedTemplates: [
      {
        id: 'interactive-slides-dda',
        name: 'Interactive Slides DDA',
        type: 'dda',
        description: 'Slide-based interactive presentation with branching navigation.',
        structure: ['Title', 'MOA', 'Outcomes', 'Safety', 'Dosing'],
        recommended: true,
        templateFile: tmplFile('Digital Detail Aid', 'Interactive Slides DDA'),
      },
      {
        id: 'card-carousel-dda',
        name: 'Card Carousel DDA',
        type: 'dda',
        description: 'Swipeable card carousel for quick, modular detailing.',
        structure: ['Cards', 'Key data', 'Safety', 'CTA'],
        recommended: false,
        templateFile: tmplFile('Digital Detail Aid', 'Card Carousel DDA'),
      },
      {
        id: 'fullscreen-immersive-dda',
        name: 'Fullscreen Immersive DDA',
        type: 'dda',
        description: 'Fullscreen immersive layout for high-impact field detailing.',
        structure: ['Hero', 'Story', 'Data', 'Safety'],
        recommended: false,
        templateFile: tmplFile('Digital Detail Aid', 'Fullscreen Immersive DDA'),
      },
      {
        id: 'storytelling-flow-dda',
        name: 'Storytelling Flow DDA',
        type: 'dda',
        description: 'Linear storytelling flow from disease burden to solution.',
        structure: ['Burden', 'Need', 'MOA', 'Evidence'],
        recommended: false,
        templateFile: tmplFile('Digital Detail Aid', 'Storytelling Flow DDA'),
      },
      {
        id: 'tabbed-sidebar-dda',
        name: 'Tabbed Sidebar DDA',
        type: 'dda',
        description: 'Tabbed sidebar layout for non-linear navigation of modules.',
        structure: ['Sidebar tabs', 'Module content', 'Safety', 'Dosing'],
        recommended: false,
        templateFile: tmplFile('Digital Detail Aid', 'Tabbed Sidebar DDA'),
      },
    ],
  },
];

// Rendered output templates for the Content Editor's Visual Templates tab —
// the generated deliverables under /data/brexiva/Generated Templates/.
const GENERATED_DIR = '/data/brexiva/Generated Template';
const genFile = (path: string) => `${GENERATED_DIR}/${path.split('/').map(encodeURIComponent).join('/')}`;

const visualTemplates: CampaignData['visualTemplates'] = [
  {
    id: 'congress-poster',
    title: 'Congress Poster',
    type: 'Scientific',
    file: genFile('Congress Poster/Classic Scientific Poster.html'),
    description: 'Generated congress poster — classic scientific layout with Brexiva clinical data.',
  },
  {
    id: 'email',
    title: 'Email',
    type: 'Digital',
    file: genFile('Email/Clinical Focus Email.html'),
    description: 'Generated HCP email — clinical focus layout with Brexiva clinical data.',
  },
  {
    id: 'patient-leaflet',
    title: 'Patient Leaflet',
    type: 'Print',
    file: genFile('Patient Leaflet/Friendly Patient Guide.html'),
    description: 'Generated patient leaflet — friendly patient guide layout.',
  },
  {
    id: 'digital-detail-aid',
    title: 'Digital Detail Aid',
    type: 'Interactive',
    file: genFile('Digital Detail Aid/Interactive Slides DDA.html'),
    description: 'Generated digital detail aid — interactive slides layout.',
  },
];

const data: CampaignData = {
  clinicalDocuments: CLINICAL_DOCUMENTS,
  complianceAssets: COMPLIANCE_ASSETS,
  templates,
  visualTemplates,
  brief: MOCK_BRIEF,
  generatedAssets: GENERATED_ASSETS,
  mlrAssets: MLR_ASSETS,
  distributionChannels: DISTRIBUTION_CHANNELS,
  marketMetrics: MARKET_METRICS,
  personaEngagement: PERSONA_ENGAGEMENT,
  optimizationRecs: OPTIMIZATION_RECS,
  plsScores: PLS_SCORES,
  plsPreview: PLS_PREVIEW,
};

export const brexivaCampaign: Campaign = {
  id: 'brexiva',
  chipLabel: 'BREXIVA - All Deliverables Campaign content',
  brand: 'Brexiva',
  storyline: STORYLINE,
  data,
};
