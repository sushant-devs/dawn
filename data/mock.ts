export interface Message {
  role: 'user' | 'assistant';
  content?: string;
  stepId?: string;
}

export const INVOLEAD_DEMO_DATA = {
  steps: [
    {
      id: "clinical-extraction",
      userPrompt: "Upload HAVEN 1-4 CSRs and perform a deep-tissue scan.",
      aiResponse: "I have analyzed the Clinical Study Reports for the entire HAVEN program. My Document Intelligence Bot has extracted a structured summary of clinical efficacy, grounding every data point in verified trial evidence.",
      hasDiagnosis: "Extraction Verified: 23 key efficacy claims mapped to CSR Page 42, Table 3. Ready for Global Clinical Summary drafting.",
      tableData: [
        { Trial: "HAVEN 1", Population: "Inhibitors (12+ yrs)", PrimaryEndpoint: "ABR", Efficacy: "87% reduction vs. bypassing agents" },
        { Trial: "HAVEN 2", Population: "Inhibitors (Pediatric)", PrimaryEndpoint: "Safety/Efficacy", Efficacy: "99% reduction in treated bleeds" },
        { Trial: "HAVEN 3", Population: "No Inhibitors", PrimaryEndpoint: "ABR vs. Proph", Efficacy: "96% reduction vs. no prophylaxis" },
        { Trial: "HAVEN 4", Population: "With/Without Inhibitors", PrimaryEndpoint: "Monthly Dosing", Efficacy: "Median ABR 0.0; 56% zero bleeds" }
      ],
      insightDashboard: {
        tiles: [
          { label: "Data Points Mapped", value: "23", source: "CSR Deep Scan", color: "#3B82F6" },
          { label: "Verification Conf.", value: "100%", source: "Grounding Engine", color: "#10B981" },
          { label: "Manual Hours Saved", value: "120h", source: "DAWN Efficiency", color: "#8B5CF6" }
        ]
      },
      suggestions: ["Draft 1,000-word clinical summary", "Generate Helimbra Congress Poster"]
    },
    {
      id: "generate-content",
      userPrompt: "Draft clinical summary focusing on HAVEN 4 monthly dosing. Mandatory: Boxed Warning in first 100 words.",
      aiResponse: "Global Clinical Summary generated. I have automatically integrated the Boxed Warning for TMA and Thromboembolism as a primary safety guardrail. This draft is now the 'Parent' asset for all derivative creative transformation.",
      mlrCheck: {
        score: "98/100",
        brandGuidelines: "100%",
        citationsVerified: 23,
        generationTime: "1.2s"
      },
      generatedEmail: {
        subject: "Helimbra: 96% Reduction in Treated Bleeds (HAVEN 3 Results)",
        body: "Dear Doctor,\n\nDiscover the HAVEN 3 results for patients without inhibitors. Helimbra offers a median ABR of 0.0 for those on monthly dosing (95% CI: 0.0, 2.1).\n\nWARNING: THROMBOTIC MICROANGIOPATHY AND THROMBOEMBOLISM...\n[ISI Anchored Above Fold]",
        sender: { name: "Sarah (Global Lead)", email: "sarah.v@helimbra-dawn.com" }
      },
      // Metadata for the Poster Visual
      generatedPoster: {
        header: "Helimbra: Redefining the Prophylactic Standard",
        visuals: ["Circular 28-day dosing infographic", "High-contrast ABR bar chart"],
        theme: "Deep Navy & Teal",
        benefit: "13 treatments per year"
      },
      suggestions: ["Localize for German Market", "Verify Claims (Auto-Annotation)"]
    },
    {
      id: "german-localization",
      userPrompt: "Localize for German Hematologists (Clinical Researcher & Nurse archetypes).",
      aiResponse: "Pharma-Aware translation complete. I have translated 'subcutaneous' to 'subkutan' and replaced US PI links with the German 'Fachinformation' link automatically.",
      findings: [
        { type: "green", text: "Clinical Researcher: Focus on p-values and molecular bridge mechanism.", module: "Personalization Hub" },
        { type: "green", text: "Nurse Practitioner: Focus on '13 doses per year' treatment burden.", module: "Personalization Hub" }
      ],
      insightDashboard: {
        tiles: [
          { label: "Translation Accuracy", value: "99.8%", source: "Regulatory AI", color: "#10B981" },
          { label: "Link Compliance", value: "DE Fachinfo", source: "Local Engine", color: "#3B82F6" }
        ],
        charts: [
          {
            type: "bar",
            title: "Asset Distribution by German Archetype",
            data: [
              { name: "Researcher", Science: 85, Convenience: 15 },
              { name: "Nurse", Science: 20, Convenience: 80 }
            ]
          }
        ]
      },
      suggestions: ["Run MLR Auto-Annotation", "Single-Action Publish to CRM"]
    }
  ]
};