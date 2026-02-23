export interface ChecklistItem {
  id: string
  category: string
  label: string
  description: string
  required: boolean
  helpUrl?: string
  estimatedMinutes?: number
}

export const GSA_CHECKLIST: ChecklistItem[] = [
  // Prerequisites
  {
    id: 'sam_registration',
    category: 'Prerequisites',
    label: 'SAM.gov Registration Active',
    description: 'Your SAM.gov registration must be active with current UEI and CAGE code. Entity info must match eOffer exactly.',
    required: true,
    helpUrl: 'https://sam.gov',
    estimatedMinutes: 15,
  },
  {
    id: 'fas_id',
    category: 'Prerequisites',
    label: 'FAS ID Created & Tested',
    description: 'Log into eoffer.gsa.gov and verify your FAS ID works. This is separate from SAM.gov login.',
    required: true,
    helpUrl: 'https://eoffer.gsa.gov',
    estimatedMinutes: 10,
  },
  {
    id: 'digital_certificate',
    category: 'Prerequisites',
    label: 'Digital Certificate Valid & Installed',
    description: 'You need a GSA-approved digital certificate to sign your offer. Check expiration date — renewal takes 3-5 business days.',
    required: true,
    estimatedMinutes: 5,
  },
  {
    id: 'pathways_training',
    category: 'Prerequisites',
    label: 'Pathways to Success Training (within 1 year)',
    description: 'Complete the "Pathways to Success" online training. Save the PDF certificate. Must be completed within the past year.',
    required: true,
    helpUrl: 'https://www.gsa.gov/buying-selling/purchasing-programs/gsa-multiple-award-schedule/selling-through-schedules/roadmap-for-new-schedule-offerors',
    estimatedMinutes: 240,
  },
  {
    id: 'readiness_assessment',
    category: 'Prerequisites',
    label: 'Readiness Assessment Completed',
    description: 'Must be completed by your Authorized Negotiator who is an employee (not a consultant).',
    required: true,
    estimatedMinutes: 30,
  },
  {
    id: 'solicitation_download',
    category: 'Prerequisites',
    label: 'Latest Solicitation & IT Attachment Downloaded',
    description: 'Download the CURRENT solicitation revision from GSA. Check the revision number. This is the #1 rejection reason.',
    required: true,
    estimatedMinutes: 15,
  },

  // SIN & Labor Categories
  {
    id: 'sin_selection',
    category: 'SIN Selection',
    label: 'SINs Selected & Confirmed',
    description: 'Select which Special Item Numbers (SINs) you will propose. IT services: 54151S, Cloud: 518210C, Cybersecurity: 54151HACS.',
    required: true,
    estimatedMinutes: 60,
  },
  {
    id: 'labor_categories_defined',
    category: 'SIN Selection',
    label: 'Labor Categories Defined',
    description: 'Define labor categories with titles, descriptions, education requirements, years of experience, and proposed rates for each SIN.',
    required: true,
    estimatedMinutes: 120,
  },
  {
    id: 'cloud_keyword_check',
    category: 'SIN Selection',
    label: '518210C: "Cloud" Keyword in Titles & Descriptions',
    description: 'If proposing SIN 518210C, EVERY labor category must have "cloud" in both the title AND description. GSA will reject without this.',
    required: false,
    estimatedMinutes: 30,
  },
  {
    id: 'no_duplicate_cats',
    category: 'SIN Selection',
    label: 'No Duplicate Categories Across SINs',
    description: 'The same labor category cannot appear identically on multiple SINs. Differentiate titles and descriptions.',
    required: true,
    estimatedMinutes: 15,
  },

  // Technical Proposal
  {
    id: 'factor1_narrative',
    category: 'Technical Proposal',
    label: 'Factor 1: Corporate Experience Narrative',
    description: 'Describe your company, services, employees, past performance, and marketing plan. Max 10,000 characters in eOffer.',
    required: true,
    estimatedMinutes: 180,
  },
  {
    id: 'factor3_narrative',
    category: 'Technical Proposal',
    label: 'Factor 3: Quality Control Narrative',
    description: 'Describe QC processes, responsible person, subcontractor standards, problem resolution, urgent requirements. Max 10,000 chars.',
    required: true,
    estimatedMinutes: 120,
  },
  {
    id: 'factor4_narratives',
    category: 'Technical Proposal',
    label: 'Factor 4: Project Experience (2 per IT SIN)',
    description: 'Write 2 relevant project narratives per IT SIN. Must be recent (within 2 years) and directly related to proposed SIN scope.',
    required: true,
    estimatedMinutes: 240,
  },

  // Pricing
  {
    id: 'pricing_research',
    category: 'Pricing',
    label: 'GSA eLibrary Competitive Research',
    description: 'Research comparable small business IT firms on GSA eLibrary. Document rates for similar labor categories.',
    required: true,
    helpUrl: 'https://www.gsaelibrary.gsa.gov',
    estimatedMinutes: 120,
  },
  {
    id: 'rate_determination',
    category: 'Pricing',
    label: 'Proposed Rates Finalized',
    description: 'Set rates competitive with eLibrary benchmarks. GSA evaluates "best value" not lowest price. Document justification.',
    required: true,
    estimatedMinutes: 60,
  },
  {
    id: 'price_proposal_template',
    category: 'Pricing',
    label: 'Price Proposal Template (PPT) Completed',
    description: 'Complete the official Price Proposal Template with all labor categories and rates.',
    required: true,
    estimatedMinutes: 60,
  },
  {
    id: 'csp_disclosure',
    category: 'Pricing',
    label: 'CSP-1 / TDR Completed',
    description: 'Complete Commercial Sales Practices disclosure or elect Transactional Data Reporting. Disclose most-favored customer.',
    required: true,
    estimatedMinutes: 45,
  },
  {
    id: 'supporting_price_docs',
    category: 'Pricing',
    label: 'Supporting Price Documentation (2-3 invoices/contracts)',
    description: 'Provide commercial invoices or contracts that support your proposed rates.',
    required: true,
    estimatedMinutes: 30,
  },

  // Administrative
  {
    id: 'financial_statements',
    category: 'Administrative',
    label: '2-Year Financial Statements',
    description: 'Balance sheet and income statement for previous 2 fiscal years. If net losses, include explanation letter.',
    required: true,
    estimatedMinutes: 30,
  },
  {
    id: 'compensation_plan',
    category: 'Administrative',
    label: 'Professional Compensation Plan',
    description: 'Document your company salary and benefits policies for employees who will perform contract work.',
    required: true,
    estimatedMinutes: 60,
  },
  {
    id: 'past_performance_refs',
    category: 'Administrative',
    label: 'Past Performance References (3 total)',
    description: 'Obtain 3 references via CPARS reports or Past Performance Questionnaires. Federal clients preferred. Send PPQs early.',
    required: true,
    estimatedMinutes: 30,
  },
  {
    id: 'capability_statement',
    category: 'Administrative',
    label: 'Capability Statement Updated',
    description: 'Ensure your capability statement reflects the SINs and services you are proposing.',
    required: false,
    estimatedMinutes: 60,
  },

  // Final Review
  {
    id: 'eoffer_data_match',
    category: 'Final Review',
    label: 'eOffer Data Matches SAM.gov Exactly',
    description: 'Cross-check company name, UEI, CAGE, address, and NAICS codes between eOffer and SAM.gov. Must be identical.',
    required: true,
    estimatedMinutes: 15,
  },
  {
    id: 'solicitation_revision_check',
    category: 'Final Review',
    label: 'Solicitation Revision Number Current',
    description: 'CRITICAL: Verify your offer references the LATEST solicitation revision. Triple-check on submission day. #1 rejection reason.',
    required: true,
    estimatedMinutes: 5,
  },
  {
    id: 'char_limit_check',
    category: 'Final Review',
    label: 'All Narratives Under 10,000 Characters',
    description: 'Verify every narrative field is under the 10,000 character limit. eOffer will truncate without warning.',
    required: true,
    estimatedMinutes: 10,
  },
  {
    id: 'validation_warnings',
    category: 'Final Review',
    label: 'eOffer Validation Warnings Resolved',
    description: 'Run the eOffer validation checker and resolve all warnings before submission.',
    required: true,
    estimatedMinutes: 30,
  },
  {
    id: 'second_person_review',
    category: 'Final Review',
    label: 'Second Person Review',
    description: 'Have another person review the entire offer for typos, inconsistencies, and completeness.',
    required: false,
    estimatedMinutes: 60,
  },
]

export const CHECKLIST_CATEGORIES = [
  'Prerequisites',
  'SIN Selection',
  'Technical Proposal',
  'Pricing',
  'Administrative',
  'Final Review',
]

export const SIN_OPTIONS = [
  { code: '54151S', name: 'IT Professional Services', description: 'IT consulting, systems design, custom programming, data management' },
  { code: '518210C', name: 'Cloud Computing & Cloud Related IT Services', description: 'IaaS, PaaS, SaaS, cloud migration, cloud security' },
  { code: '54151HACS', name: 'Highly Adaptive Cybersecurity Services', description: 'Penetration testing, incident response, RMF, CMMC — requires oral tech evaluation' },
  { code: '54151HEAL', name: 'Health IT Services', description: 'EHR, health data analytics, HIPAA compliance, telehealth' },
]
