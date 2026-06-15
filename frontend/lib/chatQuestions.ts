import { ChartData, TableData } from './types';

export interface ChatQA {
  id: string;
  question: string;
  answer: string;
  chart?: ChartData;
  table?: TableData;
  recommendation?: string;
}

export const CHAT_QUESTIONS: ChatQA[] = [
  // ── Q1 ──────────────────────────────────────────────────────────────────────
  {
    id: 'chat-1',
    question: "Which audience segments should be targeted for BREXIVA (Brenova)?",
    answer:
      "Here's the audience segment analysis for BREXIVA based on engagement and prescription growth performance.\nMedical Oncologists generated the highest engagement (48%) and contributed the strongest prescription growth (+22%) for BREXIVA — clearly the highest-value segment.",
    table: {
      title: 'DAWN Analysis — Audience Segment Performance',
      headers: ['Audience Segment', 'Engagement Rate', 'Prescription Growth'],
      rows: [
        ['Medical Oncologists', '48%', '+22%'],
        ['Hemato-Oncologists', '44%', '+18%'],
        ['Oncology KOLs', '41%', '+16%'],
        ['General Physicians', '19%', '+4%'],
      ],
      highlightRowIndex: 0,
    },
    recommendation:
      "Focus future campaigns on Medical Oncologists and Oncology KOLs. Allocate approximately 65% of campaign resources to these high-value segments to maximize engagement and conversion.",
  },

  // ── Q2 ──────────────────────────────────────────────────────────────────────
  {
    id: 'chat-2',
    question: "Which content formats generate the highest engagement for BREXIVA?",
    answer:
      "Here's the content format performance analysis for BREXIVA across all active channels.\nPersonalized Emails generated 72% more engagement than Congress Posters and consistently delivered the highest physician interaction rates.",
    chart: {
      type: 'donut',
      title: 'Engagement Share by Content Format',
      valueUnit: '%',
      data: [
        { name: 'Personalized Email', value: 43, color: '#00a896' },
        { name: 'Digital Detail Aid', value: 40, color: '#0891b2' },
        { name: 'Leaflet', value: 25, color: '#6366f1' },
        { name: 'Congress Poster', value: 17, color: '#f59e0b' },
      ],
    },
  },

  // ── Q3 ──────────────────────────────────────────────────────────────────────
  {
    id: 'chat-3',
    question: "Which promotional channels deliver the best ROI for BREXIVA?",
    answer:
      "Here's the channel-level ROI analysis for BREXIVA based on last-cycle promotional spend and downstream prescription value.\nEmail Campaigns delivered the highest ROI while reaching 32% more target physicians compared to field-force-only activities.",
    table: {
      title: 'DAWN Analysis — Promotional Channel ROI',
      headers: ['Channel', 'ROI'],
      rows: [
        ['Email Campaigns', '5.2x'],
        ['Digital Detailing Platforms', '4.8x'],
        ['Medical Congress Activities', '4.1x'],
        ['Representative Visits', '3.6x'],
      ],
      highlightRowIndex: 0,
    },
    recommendation:
      "Increase investment in Email Campaigns and Digital Detailing Platforms by 25% in upcoming campaign cycles to maximize return on marketing spend.",
  },

  // ── Q4 ──────────────────────────────────────────────────────────────────────
  {
    id: 'chat-4',
    question: "How do marketing activities influence sales performance for BREXIVA?",
    answer:
      "Analysis of campaign and prescription data indicates a strong relationship between marketing engagement and sales growth for BREXIVA.\n**Key Findings:**\n• Physicians exposed to at least three marketing touchpoints showed a 24% increase in prescription volume.\n• Email-engaged physicians generated 18% higher brand adoption compared to non-engaged physicians.\n• Multi-channel campaigns achieved 31% higher sales uplift than single-channel initiatives.",
    table: {
      title: 'DAWN Analysis — Marketing Exposure vs Prescription Growth',
      headers: ['Marketing Exposure', 'Average Prescription Growth'],
      rows: [
        ['Single Touchpoint', '+5%'],
        ['Two Touchpoints', '+11%'],
        ['Three or More Touchpoints', '+24%'],
      ],
      highlightRowIndex: 2,
    },
  },

  // ── Q5 ──────────────────────────────────────────────────────────────────────
  {
    id: 'chat-5',
    question: "How does BREXIVA's performance compare with competitors?",
    answer:
      "Here's the head-to-head benchmarking of BREXIVA against the competitor average across the four most commercially relevant KPIs.\nBREXIVA is outperforming competitor brands across all major engagement and conversion metrics.",
    chart: {
      type: 'bar',
      title: 'BREXIVA vs Competitor Average (%)',
      data: [
        { name: 'Engagement', value: 43, benchmark: 34, color: '#00a896' },
        { name: 'Open Rate', value: 49, benchmark: 37, color: '#0891b2' },
        { name: 'Conversion', value: 18, benchmark: 13, color: '#6366f1' },
        { name: 'Mkt Share Δ', value: 9, benchmark: 5, color: '#f59e0b' },
      ],
    },
  },

  // ── Q6 ──────────────────────────────────────────────────────────────────────
  {
    id: 'chat-6',
    question: "What type of content should be created for future BREXIVA campaigns?",
    answer:
      "Based on historical performance, physician engagement patterns, and campaign outcomes, here is DAWN's predictive recommendation for the next campaign cycle.\n**Expected Impact:**\n• +18% increase in physician engagement\n• +12% increase in campaign conversions\n• +9% increase in prescription growth\nThe data indicates that Personalized Emails and Digital Detail Aids consistently deliver the highest engagement, conversion, and ROI. A campaign strategy centred around these formats is projected to generate the strongest commercial outcomes for BREXIVA in upcoming campaign cycles.",
    table: {
      title: 'DAWN Predictive Recommendation — Predicted Engagement by Content Type',
      headers: ['Content Type', 'Predicted Engagement'],
      rows: [
        ['Personalized Email', '46%'],
        ['Digital Detail Aid', '42%'],
        ['Leaflet', '30%'],
        ['Congress Poster', '21%'],
      ],
      highlightRowIndex: 0,
      caption: 'Forecast based on prior-cycle engagement, channel-mix data, and DAWN ML model v2.4',
    },
    recommendation:
      "Future BREXIVA campaigns should prioritize Personalized Emails and Digital Detail Aids as primary content assets. Leaflets and Congress Posters should be used as supporting materials to reinforce brand messaging and increase visibility during congress and field-force activities.",
  },
];