"""
sources.py — Verified UK legal aid sources for ingestion.

All sources are official UK government / LAA publications.
Adding new sources will be picked up on the next ingestion run.
"""

SOURCES = [
    {
        "title": "Legal Aid: What It Is and How to Get It",
        "url": "https://www.gov.uk/legal-aid",
        "publication_date": None,
    },
    {
        "title": "Check If You Can Get Legal Aid",
        "url": "https://www.gov.uk/check-legal-aid",
        "publication_date": None,
    },
    {
        "title": "Legal Aid Financial Eligibility",
        "url": "https://www.gov.uk/legal-aid/financial-eligibility",
        "publication_date": None,
    },
    {
        "title": "Legal Aid for Domestic Abuse",
        "url": "https://www.gov.uk/legal-aid/domestic-abuse",
        "publication_date": None,
    },
    {
        "title": "Legal Aid for Exceptional Cases",
        "url": "https://www.gov.uk/legal-aid/funding-for-exceptional-cases",
        "publication_date": None,
    },
    {
        "title": "Legal Aid for Legal Problems Abroad",
        "url": "https://www.gov.uk/legal-aid/legal-problems-abroad",
        "publication_date": None,
    },
    {
        "title": "Legal Aid if Arrested or Charged",
        "url": "https://www.gov.uk/legal-aid/arrested-or-charged-with-a-crime",
        "publication_date": None,
    },
    {
        "title": "Immigration Rules",
        "url": "https://www.gov.uk/guidance/immigration-rules",
        "publication_date": None,
    },
    {
        "title": "Settled Status for EU Citizens",
        "url": "https://www.gov.uk/settled-status-eu-citizens-families",
        "publication_date": None,
    },
    {
        "title": "UK Immigration: Overview",
        "url": "https://www.gov.uk/browse/visas-immigration",
        "publication_date": None,
    },
    {
        "title": "Check If You Need a Visa",
        "url": "https://www.gov.uk/check-uk-visa",
        "publication_date": None,
    },
    {
        "title": "Claim Asylum",
        "url": "https://www.gov.uk/claim-asylum",
        "publication_date": None,
    },
    {
        "title": "Universal Credit",
        "url": "https://www.gov.uk/universal-credit",
        "publication_date": None,
    },
    {
        "title": "Personal Independence Payment (PIP)",
        "url": "https://www.gov.uk/pip",
        "publication_date": None,
    },
    {
        "title": "Housing Benefit",
        "url": "https://www.gov.uk/housing-benefit",
        "publication_date": None,
    },
    {
        "title": "Legal Aid for Housing Problems",
        "url": "https://www.gov.uk/legal-aid/housing-problems",
        "publication_date": None,
    },
    {
        "title": "Eviction and Landlord Possession Claims",
        "url": "https://www.gov.uk/eviction/landlord-possession-claims",
        "publication_date": None,
    },
    {
        "title": "Private Renting: Landlord Responsibilities",
        "url": "https://www.gov.uk/private-renting/landlord-responsibilities",
        "publication_date": None,
    },
    {
        "title": "Tenancy Deposit Protection and Deposit Disputes",
        "url": "https://www.gov.uk/tenancy-deposit-protection",
        "publication_date": None,
    },
    {
        "title": "Landlord and Tenant Act 1985",
        "url": "https://www.legislation.gov.uk/ukpga/1985/70",
        "publication_date": "1985-10-29",
    },
    {
        "title": "Housing Act 1988",
        "url": "https://www.legislation.gov.uk/ukpga/1988/50",
        "publication_date": "1988-11-24",
    },
    {
        "title": "Housing Act 1996",
        "url": "https://www.legislation.gov.uk/ukpga/1996/52",
        "publication_date": "1996-11-22",
    },
    {
        "title": "Homelessness: Help If You Are Eligible",
        "url": "https://www.gov.uk/homelessness-help-youre-eligible",
        "publication_date": None,
    },
    {
        "title": "Help With Debt Problems",
        "url": "https://www.gov.uk/debt-advice",
        "publication_date": None,
    },
    {
        "title": "Consumer Protection and Rights",
        "url": "https://www.gov.uk/consumer-protection-rights",
        "publication_date": None,
    },
    {
        "title": "Employment Contracts and Conditions",
        "url": "https://www.gov.uk/employment-contracts-and-conditions",
        "publication_date": None,
    },
    {
        "title": "Discrimination: Your Rights",
        "url": "https://www.gov.uk/discrimination-your-rights",
        "publication_date": None,
    },
    {
        "title": "Starting a Business in the UK",
        "url": "https://www.gov.uk/set-up-business",
        "publication_date": None,
    },
    {
        "title": "Business Support and Local Growth",
        "url": "https://www.gov.uk/business-support-helpline",
        "publication_date": None,
    },
    {
        "title": "Insolvency and Business Rescue",
        "url": "https://www.gov.uk/business-insolvency-procedures",
        "publication_date": None,
    },
    {
        "title": "Education and Training for Adults",
        "url": "https://www.gov.uk/adult-education-courses",
        "publication_date": None,
    },
    {
        "title": "Student Finance for Higher Education",
        "url": "https://www.gov.uk/student-finance",
        "publication_date": None,
    },
    {
        "title": "School Exclusions and Appeals",
        "url": "https://www.gov.uk/school-exclusions",
        "publication_date": None,
    },
    {
        "title": "Special Educational Needs and Disability (SEND)",
        "url": "https://www.gov.uk/children-with-special-educational-needs",
        "publication_date": None,
    },
    {
        "title": "Local Elections",
        "url": "https://www.gov.uk/local-elections",
        "publication_date": None,
    },
    {
        "title": "Electoral Commission: Voter Information",
        "url": "https://www.electoralcommission.org.uk/i-am-a/voter",
        "publication_date": None,
    },
    {
        "title": "AI Regulation in the UK",
        "url": "https://www.gov.uk/government/publications/ai-regulation",
        "publication_date": None,
    },
    {
        "title": "AI Safety Summit",
        "url": "https://www.gov.uk/government/topical-events/ai-safety-summit-2023",
        "publication_date": None,
    },
    {
        "title": "Data Protection Act 2018",
        "url": "https://www.legislation.gov.uk/ukpga/2018/12",
        "publication_date": "2018-05-23",
    },
    {
        "title": "UK General Data Protection Regulation (UK GDPR)",
        "url": "https://ico.org.uk/for-organisations/guide-to-data-protection/",
        "publication_date": None,
    },
    {
        "title": "Human Rights Act 1998",
        "url": "https://www.legislation.gov.uk/ukpga/1998/42",
        "publication_date": "1998-11-09",
    },
    {
        "title": "Domestic Abuse Act 2021",
        "url": "https://www.legislation.gov.uk/ukpga/2021/17",
        "publication_date": "2021-04-29",
    },
    {
        "title": "Modern Slavery Act 2015",
        "url": "https://www.legislation.gov.uk/ukpga/2015/30",
        "publication_date": "2015-03-26",
    },
    {
        "title": "Climate Change Act 2008",
        "url": "https://www.legislation.gov.uk/ukpga/2008/27",
        "publication_date": "2008-11-26",
    },
    {
        "title": "Mental Health Act 1983",
        "url": "https://www.legislation.gov.uk/ukpga/1983/20",
        "publication_date": "1983-11-22",
    },
    {
        "title": "Planning Appeals and Planning Permission",
        "url": "https://www.gov.uk/planning-permission-england",
        "publication_date": None,
    },
    {
        "title": "Public Sector Equality Duty",
        "url": "https://www.gov.uk/guidance/equality-act-2010-guidance",
        "publication_date": None,
    },
    {
        "title": "Legal Aid Agency",
        "url": "https://www.gov.uk/government/organisations/legal-aid-agency",
        "publication_date": None,
    },
    {
        "title": "Ministry of Justice",
        "url": "https://www.gov.uk/government/organisations/ministry-of-justice",
        "publication_date": None,
    },
    {
        "title": "HM Courts & Tribunals Service",
        "url": "https://www.gov.uk/government/organisations/hm-courts-and-tribunals-service",
        "publication_date": None,
    },
    {
        "title": "Law Commission",
        "url": "https://www.gov.uk/government/organisations/law-commission",
        "publication_date": None,
    },
    {
        "title": "Parliament UK",
        "url": "https://www.parliament.uk/",
        "publication_date": None,
    },
    {
        "title": "Bailii (British and Irish Legal Information Institute)",
        "url": "https://www.bailii.org/",
        "publication_date": None,
    },
    {
        "title": "Judiciary of England and Wales",
        "url": "https://www.judiciary.uk/",
        "publication_date": None,
    },
    {
        "title": "National Archives: UK case law",
        "url": "https://www.caselaw.nationalarchives.gov.uk/",
        "publication_date": None,
    },
    {
        "title": "Citizens Advice",
        "url": "https://www.citizensadvice.org.uk/",
        "publication_date": None,
    },
    {
        "title": "Shelter",
        "url": "https://www.shelter.org.uk/",
        "publication_date": None,
    },
    {
        "title": "Law Centres Network",
        "url": "https://www.lawcentres.org.uk/",
        "publication_date": None,
    },
    {
        "title": "AdviceUK",
        "url": "https://adviceuk.org.uk/",
        "publication_date": None,
    },
    {
        "title": "Find legal advice on GOV.UK",
        "url": "https://www.gov.uk/find-legal-advice",
        "publication_date": None,
    },
    {
        "title": "Solicitors Regulation Authority",
        "url": "https://www.sra.org.uk/",
        "publication_date": None,
    },
    {
        "title": "Bar Standards Board",
        "url": "https://www.barstandardsboard.org.uk/",
        "publication_date": None,
    },
    {
        "title": "The Law Society",
        "url": "https://www.lawsociety.org.uk/",
        "publication_date": None,
    },
    {
        "title": "Legal Services Board",
        "url": "https://www.legalservicesboard.org.uk/",
        "publication_date": None,
    },
    {
        "title": "GOV.UK Content API",
        "url": "https://developer.service.gov.uk/",
        "publication_date": None,
    },
    {
        "title": "legislation.gov.uk XML API",
        "url": "https://www.legislation.gov.uk/developer",
        "publication_date": None,
    },
    {
        "title": "GOV.UK datasets on Justice",
        "url": "https://data.gov.uk/dataset?keywords=justice",
        "publication_date": None,
    },
    {
        "title": "Electoral Commission",
        "url": "https://www.electoralcommission.org.uk/",
        "publication_date": None,
    },
    {
        "title": "UK National AI Strategy",
        "url": "https://www.gov.uk/government/publications/national-ai-strategy",
        "publication_date": None,
    },
    {
        "title": "Regulating AI Systems: Proposed Approach",
        "url": "https://www.gov.uk/government/publications/regulating-ai-systems",
        "publication_date": None,
    },
    {
        "title": "Online Safety Act Guidance",
        "url": "https://www.gov.uk/government/publications/online-safety-bill-guidance",
        "publication_date": None,
    },
    {
        "title": "Court and Tribunal Fees",
        "url": "https://www.gov.uk/court-fees-what-they-are",
        "publication_date": None,
    },
    {
        "title": "Civil Legal Aid Eligibility",
        "url": "https://www.gov.uk/legal-aid/eligibility",
        "publication_date": None,
    },
    {
        "title": "Family Mediation",
        "url": "https://www.gov.uk/family-mediation",
        "publication_date": None,
    },
    {
        "title": "Workplace Rights and Protections",
        "url": "https://www.gov.uk/browse/employing-people",
        "publication_date": None,
    },
    {
        "title": "Equality and Human Rights Commission",
        "url": "https://www.equalityhumanrights.com/",
        "publication_date": None,
    },
    {
        "title": "Information Commissioner’s Office",
        "url": "https://ico.org.uk/",
        "publication_date": None,
    },
    {
        "title": "Financial Conduct Authority",
        "url": "https://www.fca.org.uk/",
        "publication_date": None,
    },
    {
        "title": "Civil Procedure Rules",
        "url": "https://www.justice.gov.uk/courts/procedure-rules/civil",
        "publication_date": None,
    },
    {
        "title": "Family Procedure Rules",
        "url": "https://www.justice.gov.uk/courts/procedure-rules/family",
        "publication_date": None,
    },
    {
        "title": "Victims' Code: Code of Practice for Victims of Crime",
        "url": "https://www.gov.uk/government/publications/the-code-of-practice-for-victims-of-crime",
        "publication_date": None,
    },
    {
        "title": "Renters’ Reform (Private Rented Sector)",
        "url": "https://www.gov.uk/government/collections/renters-reform",
        "publication_date": None,
    },
    {
        "title": "National Cyber Security Centre: Report a cyber crime",
        "url": "https://www.ncsc.gov.uk/section/about-this-website/report-suspicious-activity",
        "publication_date": None,
    },
    {
        "title": "Police UK Crime Statistics",
        "url": "https://www.police.uk/pu/your-area/",
        "publication_date": None,
    },
    {
        "title": "Office for National Statistics: Justice data",
        "url": "https://www.ons.gov.uk/peoplepopulationandcommunity/crimeandjustice",
        "publication_date": None,
    },
    {
        "title": "How Laws Are Made in the UK",
        "url": "https://www.parliament.uk/about/how/laws/",
        "publication_date": None,
    },
    {
        "title": "Local Government and Public Involvement",
        "url": "https://www.gov.uk/local-government",
        "publication_date": None,
    },
    {
        "title": "Local Government Finance Statistics",
        "url": "https://www.gov.uk/government/collections/local-authority-finance-statistics",
        "publication_date": None,
    },
    {
        "title": "Civil Legal Aid Statistics",
        "url": "https://www.gov.uk/government/statistics/legal-aid-statistics",
        "publication_date": None,
    },
    {
        "title": "HMCTS Statistics Collection",
        "url": "https://www.gov.uk/government/collections/hmcts-statistics",
        "publication_date": None,
    },
    {
        "title": "Crown Prosecution Service",
        "url": "https://www.cps.gov.uk/",
        "publication_date": None,
    },
    {
        "title": "Transparency Data: Ministers' Travel and Hospitality",
        "url": "https://www.gov.uk/government/publications/transparency-data",
        "publication_date": None,
    },
    {
        "title": "Police Conduct and Complaints",
        "url": "https://www.gov.uk/police-complaints-and-misconduct",
        "publication_date": None,
    },
    {
        "title": "Safeguarding Children and Young People",
        "url": "https://www.gov.uk/government/collections/safeguarding-children",
        "publication_date": None,
    },
    {
        "title": "Legal Aid for Special Educational Needs",
        "url": "https://www.gov.uk/legal-aid/special-educational-needs",
        "publication_date": None,
    },
    {
        "title": "Digital Service Standard",
        "url": "https://www.gov.uk/service-manual/service-standard",
        "publication_date": None,
    },
    {
        "title": "Benefits Calculator",
        "url": "https://www.gov.uk/benefits-calculator",
        "publication_date": None,
    },
    {
        "title": "LawWorks (Pro Bono Clinics)",
        "url": "https://www.lawworks.org.uk/",
        "publication_date": None,
    },
    {
        "title": "Advocate (Pro Bono Legal Assistance)",
        "url": "https://weareadvocate.org.uk/",
        "publication_date": None,
    },
    {
        "title": "National Domestic Abuse Helpline",
        "url": "https://www.nationaldahelpline.org.uk/",
        "publication_date": None,
    },
    {
        "title": "Support Through Court",
        "url": "https://www.supportthroughcourt.org/",
        "publication_date": None,
    },
    {
        "title": "Civil Legal Advice (CLA)",
        "url": "https://www.gov.uk/civil-legal-advice",
        "publication_date": None,
    },
    # ── Employment & Workplace Rights ──────────────────────────────
    {
        "title": "ACAS (Advisory, Conciliation and Arbitration Service)",
        "url": "https://www.acas.org.uk/",
        "publication_date": None,
    },
    # ── Debt & Financial Advice ────────────────────────────────────
    {
        "title": "StepChange Debt Charity",
        "url": "https://www.stepchange.org/",
        "publication_date": None,
    },
    {
        "title": "National Debtline",
        "url": "https://nationaldebtline.org/",
        "publication_date": None,
    },
    {
        "title": "MoneyHelper",
        "url": "https://www.moneyhelper.org.uk/",
        "publication_date": None,
    },
    # ── Family, Children & Women's Rights ──────────────────────────
    {
        "title": "Rights of Women",
        "url": "https://rightsofwomen.org.uk/",
        "publication_date": None,
    },
    {
        "title": "Coram Children's Legal Centre",
        "url": "https://www.childrenslegalcentre.com/",
        "publication_date": None,
    },
    # ── Housing & Property ─────────────────────────────────────────
    {
        "title": "Housing Ombudsman Service",
        "url": "https://www.housing-ombudsman.org.uk/",
        "publication_date": None,
    },
    {
        "title": "Crisis (Homelessness Charity)",
        "url": "https://www.crisis.org.uk/",
        "publication_date": None,
    },
    # ── Immigration & Asylum ───────────────────────────────────────
    {
        "title": "Joint Council for the Welfare of Immigrants (JCWI)",
        "url": "https://www.jcwi.org.uk/",
        "publication_date": None,
    },
    {
        "title": "Refugee Action",
        "url": "https://www.refugee-action.org.uk/",
        "publication_date": None,
    },
    # ── Mental Health & Equality ───────────────────────────────────
    {
        "title": "Mind (Legal Rights)",
        "url": "https://www.mind.org.uk/information-support/legal-rights/",
        "publication_date": None,
    },
    {
        "title": "Equality Advisory and Support Service (EASS)",
        "url": "https://www.equalityadvisoryservice.com/",
        "publication_date": None,
    },
    # ── Public Law & Official Guidance ─────────────────────────────
    {
        "title": "Public Law Project",
        "url": "https://publiclawproject.org.uk/",
        "publication_date": None,
    },
    {
        "title": "Legal Aid Agency Guidance Collection",
        "url": "https://www.gov.uk/government/collections/legal-aid-agency-guidance",
        "publication_date": None,
    },
    {
        "title": "Independent Office for Police Conduct (IOPC)",
        "url": "https://www.policeconduct.gov.uk/",
        "publication_date": None,
    },
]
