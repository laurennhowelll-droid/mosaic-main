"use client";

import { useMemo, useState } from "react";
import { getPlanStartingRevenue, pipelineStages, planOptions } from "../../../../lib/admin-config";

type LeadEditFormProps = {
  action: (formData: FormData) => void;
  currentStage: string;
  currentPlan: string;
  projectedRevenue: number | null;
  internalNotes: string | null;
};

export default function LeadEditForm({
  action,
  currentStage,
  currentPlan,
  projectedRevenue,
  internalNotes,
}: LeadEditFormProps) {
  const [selectedPlan, setSelectedPlan] = useState(currentPlan);
  const [revenue, setRevenue] = useState(projectedRevenue?.toString() ?? "");
  const revenueByPlan = useMemo(() => ({ get: getPlanStartingRevenue }), []);

  function updatePlan(value: string) {
    setSelectedPlan(value);
    const startingRevenue = revenueByPlan.get(value);

    if (startingRevenue !== null && startingRevenue !== undefined) {
      setRevenue(startingRevenue.toString());
    }
  }

  return (
    <form className="admin-edit-form" action={action}>
      <p className="kicker">Admin Fields</p>
      <label>
        Pipeline Stage
        <select name="pipeline_stage" defaultValue={currentStage}>
          {pipelineStages.map(([value, label]) => (
            <option value={value} key={value}>{label}</option>
          ))}
        </select>
      </label>
      <label>
        Selected Plan
        <select name="selected_plan" value={selectedPlan} onChange={(event) => updatePlan(event.target.value)}>
          {planOptions.map(([value, label]) => (
            <option value={value} key={value}>{label}</option>
          ))}
        </select>
      </label>
      <label>
        Projected Revenue
        <input
          type="number"
          name="projected_revenue"
          min="0"
          step="1"
          value={revenue}
          onChange={(event) => setRevenue(event.target.value)}
          placeholder="Auto-filled by selected plan or manual"
        />
      </label>
      <label>
        Internal Notes
        <textarea name="internal_notes" rows={10} defaultValue={internalNotes ?? ""} />
      </label>
      <button className="button" type="submit">Save Changes</button>
    </form>
  );
}
