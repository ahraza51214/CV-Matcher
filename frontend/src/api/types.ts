export type MatchResponse = {
  matchScore: number;
  band: string;
  pros: string[];
  cons: string[];
  missingSkills: string[];
  explanations: Record<string, number>;
};
