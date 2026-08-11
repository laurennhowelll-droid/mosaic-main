export const pipelineStages = [
  ["new_inquiry", "New Inquiry"],
  ["scheduling_first_call", "Scheduling First Call"],
  ["first_call_scheduled", "First Call Scheduled"],
  ["first_call_complete", "First Call Complete"],
  ["working_on_plan", "Working on Plan"],
  ["proposal_sent", "Proposal Sent"],
  ["waiting_on_client", "Waiting on Client"],
  ["plan_selected", "Plan Selected"],
  ["project_active", "Project Active"],
  ["retainer_active", "Retainer Active"],
  ["ghosted", "Ghosted"],
  ["not_a_fit", "Not a Fit"],
  ["closed", "Closed / Complete"],
  ["lost", "Lost"],
] as const;

export const planOptions = [
  ["not_selected", "Not Selected", null],
  ["clarity", "Clarity Session - $500", 500],
  ["vision", "Vision - $2,500", 2500],
  ["experience", "Experience - $4,500 starting", 4500],
  ["connect", "Connect - $5,000 starting", 5000],
  ["essentials", "Essentials - $750/month", 750],
  ["growth_partner", "Growth Partner - $1,250/month", 1250],
  ["fractional_systems_director", "Fractional Systems Director - $2,500/month starting", 2500],
  ["foundation", "Foundation Journey - $6,500 starting", 6500],
  ["connected_business", "Connected Business Journey - $11,000 starting", 11000],
  ["custom", "Custom", null],
] as const;

export const stageLabel = new Map(pipelineStages);
export const planLabel = new Map(planOptions.map(([value, label]) => [value, label]));
export const planStartingRevenue = new Map(planOptions.map(([value, , revenue]) => [value, revenue]));

export type PipelineStageValue = (typeof pipelineStages)[number][0];
export type PlanOptionValue = (typeof planOptions)[number][0];

export function getStageLabel(value: string | null | undefined) {
  return stageLabel.get((value ?? "new_inquiry") as PipelineStageValue) ?? value ?? "New Inquiry";
}

export function getPlanLabel(value: string | null | undefined) {
  return planLabel.get((value ?? "not_selected") as PlanOptionValue) ?? "Not Selected";
}

export function getPlanStartingRevenue(value: string) {
  return planStartingRevenue.get(value as PlanOptionValue) ?? null;
}
