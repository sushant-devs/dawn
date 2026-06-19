import { ChartData, TableData } from './types';

export interface ChatQA {
  id: string;
  chipLabel?: string;
  question: string;
  thinking?: string;
  answer: string;
  chart?: ChartData;
  table?: TableData;
}

export const CHAT_QUESTIONS: ChatQA[] = [
  {
    id: 'chat-eu-monthly-revenue',
    chipLabel: 'BREXIVA EU monthly revenue',
    question:
      "Show BREXIVA monthly net_revenue_eur for all 5 EU markets from Jan 2023 to Dec 2024 as a bar chart comparison.",
    thinking:
      "Analyzing Query\n" +
      "Loading conversation context — retrieving the last 5 turns to resolve any follow-up references.\n" +
      "Routing to commercial analytics database.\n" +
      "Parsing request\n" +
      "Brand: Brexiva\n" +
      "Market: all markets\n" +
      "Period: 2023\n" +
      "Querying Commercial Database\n" +
      "Building SQL query against sales_data — filtering by brand, country, and period.\n" +
      "Applying period filter: 2023.\n" +
      "Executing query and retrieving result set.\n" +
      "Preparing Response\n" +
      "Composing insight headline — 1 sentence, no markdown, all figures in the visualisation block.\n" +
      "Executing Tool\n" +
      "Calling query_commercial_database — Commercial Database lookup.",
    answer:
      "Brexiva's monthly net revenue in the five EU markets from January 2023 to December 2024 shows significant variations across countries. The data indicates that Germany consistently leads in revenue figures, followed by France, Italy, and Spain.",
    chart: {
      type: 'bar',
      title: 'BREXIVA Monthly Net Revenue in EU Markets (Jan 2023 - Dec 2024)',
      valueUnit: 'M',
      hideTotal: true,
      data: [
        { name: '2023-01', value: 495, color: '#a855f7' },
        { name: '2023-02', value: 445, color: '#a855f7' },
        { name: '2023-03', value: 405, color: '#a855f7' },
        { name: '2023-04', value: 410, color: '#a855f7' },
        { name: '2023-05', value: 500, color: '#a855f7' },
        { name: '2023-06', value: 215, color: '#a855f7' },
        { name: '2023-07', value: 555, color: '#a855f7' },
        { name: '2023-08', value: 510, color: '#a855f7' },
        { name: '2023-09', value: 510, color: '#a855f7' },
        { name: '2023-10', value: 505, color: '#a855f7' },
        { name: '2023-11', value: 610, color: '#a855f7' },
        { name: '2023-12', value: 495, color: '#a855f7' },
        { name: '2024-01', value: 630, color: '#a855f7' },
        { name: '2024-02', value: 270, color: '#a855f7' },
        { name: '2024-03', value: 210, color: '#a855f7' },
        { name: '2024-04', value: 360, color: '#a855f7' },
        { name: '2024-05', value: 280, color: '#a855f7' },
        { name: '2024-06', value: 360, color: '#a855f7' },
        { name: '2024-07', value: 285, color: '#a855f7' },
        { name: '2024-08', value: 335, color: '#a855f7' },
        { name: '2024-09', value: 350, color: '#a855f7' },
        { name: '2024-10', value: 275, color: '#a855f7' },
        { name: '2024-11', value: 220, color: '#a855f7' },
        { name: '2024-12', value: 360, color: '#a855f7' },
      ],
    },
  },

  {
    id: 'chat-persona-breakdown',
    question:
      "What is the breakdown percentage of BREXIVA targeted healthcare professionals by hcp_persona across our master database?",
    thinking:
      "Analyzing Query\n" +
      "Routing to HCP segmentation and targeting database.\n" +
      "Output format resolved — will render result as a pie chart.\n" +
      "Parsing request\n" +
      "Brand: Brexiva\n" +
      "Market: all markets\n" +
      "Period: the requested period\n" +
      "Segmenting HCP Audience\n" +
      "Querying hcp_master — applying tier, persona, decile, and specialty filters.\n" +
      "Joining hcp_calls_activity and email_activity to enrich profiles with engagement metrics.\n" +
      "Computing call coverage, email open rates, and Rx intent signals per segment.\n" +
      "Preparing Response\n" +
      "Structuring data into pie chart format for the frontend renderer.\n" +
      "Composing insight headline — 1 sentence, no markdown, all figures in the visualisation block.\n" +
      "Executing Tool\n" +
      "Calling query_hcp_analytics — Hcp Analytics lookup.\n" +
      "Executing Tool\n" +
      "Calling query_hcp_analytics — Hcp Analytics lookup.",
    answer:
      "The breakdown percentage of BREXIVA targeted healthcare professionals by HCP persona shows that the Peer-Influenced persona has the highest representation at 20.25%. The other personas follow closely behind, with Skeptic at 20.17%, Early Adopter at 20.14%, Pragmatist at 19.91%, and Relationship Oriented at 19.53%.",
    chart: {
      type: 'donut',
      title: 'BREXIVA Targeted HCP Persona Breakdown',
      valueUnit: '%',
      hideTotal: true,
      data: [
        { name: 'Peer-Influenced', value: 20.25, color: '#a855f7' },
        { name: 'Skeptic', value: 20.17, color: '#7c3aed' },
        { name: 'Early Adopter', value: 20.14, color: '#f59e0b' },
        { name: 'Pragmatist', value: 19.91, color: '#6d28d9' },
        { name: 'Relationship Oriented', value: 19.53, color: '#ec4899' },
      ],
    },
  },

  {
    id: 'chat-eu-total-revenue',
    question:
      "Show BREXIVA's total net_revenue_eur across all 5 EU markets (Germany, France, UK, Spain, Italy) for 2024 as a bar chart comparison.",
    thinking:
      "Analyzing Query\n" +
      "Loading conversation context — retrieving the last 5 turns to resolve any follow-up references.\n" +
      "Routing to commercial analytics database.\n" +
      "Output format resolved — will render result as a stat card.\n" +
      "Parsing request\n" +
      "Brand: Brexiva\n" +
      "Market: Germany, France, Uk, Spain, Italy\n" +
      "Period: 2024\n" +
      "Querying Commercial Database\n" +
      "Building SQL query against sales_data — filtering by brand, country, and period.\n" +
      "Applying country filter: Germany, France, Uk, Spain, Italy.\n" +
      "Applying period filter: 2024.\n" +
      "Executing query and retrieving result set.\n" +
      "Preparing Response\n" +
      "Structuring data into stat card format for the frontend renderer.\n" +
      "Composing insight headline — 1 sentence, no markdown, all figures in the visualisation block.\n" +
      "Executing Tool\n" +
      "Calling query_commercial_database — Commercial Database lookup.\n" +
      "Executing Tool\n" +
      "Calling query_commercial_database — Commercial Database lookup.\n" +
      "Executing Tool\n" +
      "Calling query_commercial_database — Commercial Database lookup.\n" +
      "Executing Tool\n" +
      "Calling query_commercial_database — Commercial Database lookup.\n" +
      "Executing Tool\n" +
      "Calling query_commercial_database — Commercial Database lookup.",
    answer:
      "The total net revenue for BREXIVA across the five EU markets in 2024 is as follows: Germany €4.04 billion, France €5.47 billion, UK €5.63 billion, Spain €5.09 billion, and Italy €4.89 billion.",
    chart: {
      type: 'bar',
      title: 'BREXIVA Total Net Revenue Comparison in EU Markets for 2024',
      valueUnit: 'M',
      hideTotal: true,
      data: [
        { name: 'Germany', value: 4040, color: '#a855f7' },
        { name: 'France', value: 5470, color: '#a855f7' },
        { name: 'UK', value: 5630, color: '#a855f7' },
        { name: 'Spain', value: 5090, color: '#a855f7' },
        { name: 'Italy', value: 4890, color: '#a855f7' },
      ],
    },
  },

  {
    id: 'chat-uk-q1-table',
    question:
      "Show BREXIVA's monthly net_revenue_eur, rx_units, gross_price_per_unit, net_price_per_unit, and gtn_discount_pct for the UK across Q1 2023 vs Q1 2024 — one row per month.",
    thinking:
      "Analyzing Query\n" +
      "Detected multi-domain question — will route to 2 tools sequentially and synthesise the results.\n" +
      "Output format resolved — will render result as a bar chart.\n" +
      "Parsing request\n" +
      "Brand: Brexiva\n" +
      "Market: Uk\n" +
      "Period: Q1\n" +
      "Querying Commercial Database\n" +
      "Building SQL query against sales_data — filtering by brand, country, and period.\n" +
      "Building SQL query against prescription_data — computing market share with SUM(rx_units) / SUM(market_total_units).\n" +
      "Applying country filter: Uk.\n" +
      "Applying period filter: Q1.\n" +
      "Executing query and retrieving result set.\n" +
      "Synthesising Results\n" +
      "Merging outputs from 2 data sources into a unified response.\n" +
      "Resolving any conflicting values across tables.\n" +
      "Preparing Response\n" +
      "Structuring data into bar chart format for the frontend renderer.\n" +
      "Composing insight headline — 1 sentence, no markdown, all figures in the visualisation block.\n" +
      "Executing Tool\n" +
      "Calling query_commercial_database — Commercial Database lookup.\n" +
      "Executing Tool\n" +
      "Calling query_commercial_database — Commercial Database lookup.",
    answer:
      "Brexiva's monthly net revenue, prescription units, gross price per unit, net price per unit, and GTN discount percentage for the UK across Q1 2023 and Q1 2024 are detailed below.",
    table: {
      title: 'BREXIVA UK Q1 2023 vs Q1 2024',
      headers: [
        'Month',
        'Net Revenue Eur',
        'Rx Units',
        'Gross Price Per Unit',
        'Net Price Per Unit',
        'Gtn Discount Pct',
      ],
      rows: [
        ['Jan 2023', '289,129,419.17', '4,163', '71,391.25', '62,351.08', '12.78'],
        ['Feb 2023', '508,848,259.53', '7,492', '73,676.84', '63,804.94', '13.43'],
        ['Mar 2023', '412,285,621.66', '5,864', '72,465.31', '62,978.71', '12.98'],
        ['Jan 2024', '498,396,899.82', '7,007', '73,422.63', '63,298.99', '13.86'],
        ['Feb 2024', '383,967,936.65', '5,512', '74,169.12', '64,696.45', '12.71'],
        ['Mar 2024', '347,759,251.1', '4,833', '73,290', '64,869.84', '11.6'],
      ],
    },
  },

  {
    id: 'chat-claim-audit',
    question:
      'Audit this marketing slogan: "Brenova reduces the risk of disease progression by 42% vs standard of care."',
    thinking:
      "Analyzing Query\n" +
      "Loading conversation context — retrieving the last 5 turns to resolve any follow-up references.\n" +
      "Routing to promotional claim validation library (MongoDB).\n" +
      "Parsing request\n" +
      "Brand: the requested brand\n" +
      "Market: all markets\n" +
      "Period: the requested period\n" +
      "Validating Promotional Copy\n" +
      "Connecting to the MongoDB claim library.\n" +
      "Looking up approved claims registered for the requested brand.\n" +
      "Running exact-match and partial-match audit against the submitted copy.\n" +
      "Checking alignment with MLR-approved wording and indication scope.\n" +
      "Preparing Response\n" +
      "Composing insight headline — 1 sentence, no markdown, all figures in the visualisation block.\n" +
      "Executing Tool\n" +
      "Calling query_claim_library — Claim Library lookup.",
    answer:
      'The marketing slogan "Brenova reduces the risk of disease progression by 42% vs standard of care" is not approved and requires MLR review.',
  },

  {
    id: 'chat-treatment-paradigm',
    question:
      "What is the treatment paradigm and guideline positioning for Brenova (BREXIVA) as a second-line therapy in HR+ HER2- metastatic breast cancer across key EU markets?",
    thinking:
      "Analyzing Query\n" +
      "Loading conversation context — retrieving the last 5 turns to resolve any follow-up references.\n" +
      "Parsing request\n" +
      "Brand: Brexiva\n" +
      "Market: all markets\n" +
      "Period: the requested period\n" +
      "Preparing Response\n" +
      "Composing insight headline — 1 sentence, no markdown, all figures in the visualisation block.\n" +
      "Executing Tool\n" +
      "Calling query_market_intelligence — Market Intelligence lookup.",
    answer:
      "Brexiva (Brenova) is positioned as a second-line monotherapy for HR+ HER2- metastatic breast cancer in Germany. It is recommended by both the ESMO and NCCN guidelines, emphasizing the importance of biomarker testing and indicating its use following the failure of CDK4/6 inhibitors.",
  },

  {
    id: 'chat-de-market-share',
    question:
      "What is BREXIVA's average market share versus each competitor in Germany for 2024 based on prescription database records?",
    thinking:
      "Analyzing Query\n" +
      "Loading conversation context — retrieving the last 5 turns to resolve any follow-up references.\n" +
      "Detected multi-domain question — will route to 2 tools sequentially and synthesise the results.\n" +
      "Output format resolved — will render result as a pie chart.\n" +
      "Parsing request\n" +
      "Brand: Brexiva\n" +
      "Market: Germany\n" +
      "Period: 2024\n" +
      "Querying Commercial Database\n" +
      "Building SQL query against prescription_data — computing market share with SUM(rx_units) / SUM(market_total_units).\n" +
      "Applying country filter: Germany.\n" +
      "Applying period filter: 2024.\n" +
      "Executing query and retrieving result set.\n" +
      "Pulling Competitive Intelligence\n" +
      "Querying competitor_sales and competitor_promotional_sov tables.\n" +
      "Cross-referencing competitor_landscape for product profiles and genericization risk.\n" +
      "Aligning competitor market share against Brexiva for side-by-side comparison.\n" +
      "Synthesising Results\n" +
      "Merging outputs from 2 data sources into a unified response.\n" +
      "Resolving any conflicting values across tables.\n" +
      "Preparing Response\n" +
      "Structuring data into pie chart format for the frontend renderer.\n" +
      "Composing insight headline — 1 sentence, no markdown, all figures in the visualisation block.\n" +
      "Executing Tool\n" +
      "Calling query_competitor_database — Competitor Database lookup.",
    answer:
      "Brexiva's average market share in Germany for 2024 is 21.92%, while its competitors have the following market shares: Abeclor at 28.01%, Palbocor at 25.61%, and Ribocept at 28.43%.",
    chart: {
      type: 'donut',
      title: 'Brexiva Market Share vs Competitors in Germany 2024',
      valueUnit: '%',
      hideTotal: true,
      data: [
        { name: 'Brexiva', value: 21.92, color: '#a855f7' },
        { name: 'Abeclor', value: 28.01, color: '#c084fc' },
        { name: 'Palbocor', value: 25.61, color: '#f59e0b' },
        { name: 'Ribocept', value: 28.43, color: '#7c3aed' },
      ],
    },
  },
];
