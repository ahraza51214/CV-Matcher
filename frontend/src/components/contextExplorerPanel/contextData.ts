// Static sample data and helper for generating context explorer result cards.
import type { ResultCard, ToolId, ToolOption } from "./types";

export const TOOL_DATA: Record<ToolId, ToolOption[]> = {
  Invenias: [
    {
      value: "profile",
      label: "Summary",
      content:
        "Kandidatprofil: titel, nuværende arbejdsgiver, kernekompetencer, mobilitet og nuværende pipelineskridt.",
    },
    {
      value: "salary",
      label: "Salary",
      content:
        "Lønforventning: 700k DKK base, hybrid 2 dage på kontoret. Åben for bonus/aktie-mix hvis rollen indeholder arkitekturansvar.",
    },
    {
      value: "experience",
      label: "Experience",
      content:
        "Erfaringsresumé: 8+ år backend (TypeScript/Node/GraphQL/AWS), ledet teams på 4–6, designet event-drevne systemer, stærk API-design.",
    },
    {
      value: "education",
      label: "Educational background",
      content:
        "Uddannelse: Cand.polyt. i Computer Science (DTU). Certificering: AWS Solutions Architect Associate. Har drevet internt mentorprogram.",
    },
  ],
  Survey: [
    {
      value: "summary",
      label: "Summary of responses",
      content:
        "Høj tilfredshed med procesgennemsigtighed; foretrækker kort feedback og korte assessment-forløb. Tidslinje-synlighed vurderet til 9/10.",
    },
    {
      value: "readiness",
      label: "Job change readiness",
      content:
        "Klar til jobskifte inden for 4–6 uger. Åben for hybrid-roller; ønsker tydelig onboarding-plan og udviklingssti.",
    },
    {
      value: "salary",
      label: "Salary expectations",
      content:
        "Lønforventning: 680k–720k DKK base; værdsætter aktier og læringsbudget. Foretrækker begrænset on-call eller rotationsordning.",
    },
    {
      value: "engagement",
      label: "Engagement level",
      content:
        "Engagement: svarer inden for 24 timer; åbnet outreach flere gange; aktiv i opfølgninger. Foretrækker praktisk teknisk dialog frem for lange opgaver.",
    },
  ],
  Copilot: [
    {
      value: "history-full",
      label: "Full history",
      content:
        "Fuldt historikoverblik: outreach åbnet 3 gange, svar inden for 4 timer; afslog én rolle pga. on-call belastning; ønsker arkitekturindflydelse og begrænsede rotationer.",
    },
    {
      value: "history-3m",
      label: "3 months",
      content:
        "Seneste 3 måneder: to rolleafklaringer; søger backend-lead rolle med produktindflydelse; foretrækker hybrid 2 dage/uge.",
    },
    {
      value: "history-6m",
      label: "6 months",
      content:
        "Seneste 6 måneder: vurderet fintech- og AI-roller; vigtig motivation: team-ejerskab og roadmap-indflydelse; undgår tung on-call.",
    },
    {
      value: "history-9m",
      label: "9 months",
      content:
        "Seneste 9 måneder: overvejet senior IC- og lead-spor; konsekvent præference for mentoring og API/platformsarbejde.",
    },
    {
      value: "history-12m",
      label: "12 months",
      content:
        "Seneste 12 måneder: flere dialoger i B2B SaaS; bedst match når arkitekturansvar kombineres med teamledelse.",
    },
  ],
  TalentRiver: [
    {
      value: "ls-health",
      label: "Life Science & Healthcare",
      content:
        "Life Science & Healthcare: roller med fokus på compliance-klar arkitektur og dataprivatliv; kandidaten er stærk på API'er og eventing.",
    },
    {
      value: "industrial",
      label: "Industrial & Construction",
      content:
        "Industri & Byggeri: platforme til logistik/IoT; kandidat passer på cloud/backend; afklar komfort med OT/edge-mønstre.",
    },
    {
      value: "finance",
      label: "Finance",
      content:
        "Finans: API-drevet modernisering og risikosystemer; kandidaten foretrækker begrænset on-call; god til platform/API-teams.",
    },
    {
      value: "it-digital",
      label: "IT & Digital",
      content:
        "IT & Digital: stærk kobling til produkt/engineering squads; kandidaten ønsker arkitekturinput og mentoropgaver.",
    },
    {
      value: "consumer",
      label: "Consumer",
      content:
        "Consumer: foretrækker roller med målbar kundeimpact; vær opmærksom på krav om natlig on-call.",
    },
    {
      value: "public-ngos",
      label: "Public & NGOS",
      content:
        "Offentlig & NGO: åben hvis effekt er tydelig; foretrækker moderne stack og transparent governance.",
    },
    {
      value: "defense",
      label: "Defense Industry",
      content:
        "Forsvarsindustri: afklar sikkerhedsgodkendelse; kandidaten er åben for sikkerhedsorienteret backend hvis remote/hybrid er muligt.",
    },
  ],
  Quill: [
    {
      value: "summary",
      label: "Summary",
      content:
        "Seneste samtaler: teamstruktur, komp-niveauer, tech stack; kandidaten bad om eksempler på incident-runbooks.",
    },
    {
      value: "interview-1",
      label: "Interview 1",
      content:
        "Interview 1: indledende samtale; gennemgik rolleindhold, arkitekturforventninger og on-call politik.",
    },
    {
      value: "interview-2",
      label: "Interview 2",
      content:
        "Interview 2: dybere teknisk dialog om API-design og event-drevne mønstre; kandidaten ønsker klare ejerområder.",
    },
    {
      value: "interview-3",
      label: "Interview 3",
      content:
        "Interview 3: fokus på team-fit og ledelsesstil; kandidaten værdsætter mentoring og transparente beslutninger.",
    },
  ],
};

export const createCard = (toolId: ToolId, opt: ToolOption): ResultCard => ({
  id: `${toolId}-${opt.value}-${Date.now()}`,
  tool: toolId,
  label: opt.label,
  content: opt.content,
});
