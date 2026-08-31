export const outreachStatuses = [
  ["lead", "Lead"],
  ["researched", "Researched"],
  ["contacted", "Contacted"],
  ["follow_up", "Follow Up"],
  ["replied", "Replied"],
  ["interested", "Interested"],
  ["discovery_booked", "Discovery Booked"],
  ["discovery_complete", "Discovery Complete"],
  ["won", "Won"],
  ["lost", "Lost"],
  ["not_a_fit", "Not A Fit"],
] as const;

export const outreachOutcomes = [
  ["open", "Open"],
  ["won", "Won"],
  ["lost", "Lost"],
  ["not_a_fit", "Not A Fit"],
] as const;

export const outreachOpportunities = [
  ["vision", "Vision"],
  ["experience", "Experience"],
  ["connect", "Connect"],
  ["grow", "Grow"],
  ["full_mosaic", "Full Mosaic"],
  ["a_la_carte", "A La Carte"],
  ["unsure", "Unsure"],
] as const;

export const outreachProblemCategories = [
  ["website_clarity", "Website clarity"],
  ["website_ux", "Website UX"],
  ["mobile_experience", "Mobile experience"],
  ["weak_cta", "Weak CTA"],
  ["lead_flow", "Lead flow"],
  ["booking_flow", "Booking flow"],
  ["customer_journey", "Customer journey"],
  ["customer_communication", "Customer communication"],
  ["manual_process", "Manual process"],
  ["duplicate_data_entry", "Duplicate data entry"],
  ["disconnected_tools", "Disconnected tools"],
  ["crm", "CRM"],
  ["automation", "Automation"],
  ["reporting_visibility", "Reporting / visibility"],
  ["documentation", "Documentation"],
  ["owner_dependency", "Owner dependency"],
  ["operational_bottleneck", "Operational bottleneck"],
  ["brand_positioning", "Brand / positioning"],
  ["growth_scaling", "Growth / scaling"],
  ["other", "Other"],
] as const;

export const outreachTiers = [
  ["standard", "Standard"],
  ["high_potential", "High Potential"],
  ["dream", "Dream"],
] as const;

export const outreachChannels = [
  ["email", "Email"],
  ["instagram_dm", "Instagram DM"],
  ["linkedin", "LinkedIn"],
  ["referral", "Referral"],
  ["in_person", "In Person"],
  ["other", "Other"],
] as const;

export const outreachReplySentiments = [
  ["positive", "Positive"],
  ["neutral", "Neutral"],
  ["negative", "Negative"],
  ["no_response", "No Response"],
] as const;

export const outreachMessageAngles = [
  ["specific_observation", "Specific Observation"],
  ["customer_friction", "Customer Friction"],
  ["systems_friction", "Systems Friction"],
  ["website", "Website"],
  ["growth_scaling", "Growth / Scaling"],
  ["local_connection", "Local Connection"],
  ["referral_mutual_connection", "Referral / Mutual Connection"],
  ["loom_video", "Loom / Video"],
  ["other", "Other"],
] as const;

export const outreachLostReasons = [
  ["no_response", "No Response"],
  ["not_interested", "Not Interested"],
  ["no_budget", "No Budget"],
  ["bad_timing", "Bad Timing"],
  ["diy", "DIY"],
  ["hired_someone_else", "Hired Someone Else"],
  ["not_a_fit", "Not A Fit"],
  ["stopped_responding", "Stopped Responding"],
  ["other", "Other"],
] as const;

export const outreachActivityTypes = [
  ["research", "Research"],
  ["contacted", "Contacted"],
  ["follow_up", "Follow Up"],
  ["reply", "Reply"],
  ["note", "Note"],
  ["discovery_booked", "Discovery Booked"],
  ["discovery_completed", "Discovery Completed"],
  ["status_change", "Status Change"],
  ["won", "Won"],
  ["lost", "Lost"],
] as const;

export const weeklyOutreachTarget = 50;

export function optionLabel<T extends readonly (readonly [string, string])[]>(options: T, value: string | null | undefined) {
  return options.find(([key]) => key === value)?.[1] ?? value ?? "Not set";
}

export function optionValues<T extends readonly (readonly [string, string])[]>(options: T) {
  return options.map(([key]) => key);
}
