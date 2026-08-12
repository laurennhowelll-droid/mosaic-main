import Link from "next/link";
import { assessmentSections, completionPercentage, type AssessmentQuestion } from "../../../lib/business-health-assessment";
import { completeAssessment, saveAssessmentProgress } from "../actions";

function valueFor(answers: Record<string, unknown>, id: string) {
  const value = answers[id];
  return typeof value === "string" ? value : "";
}

function checked(answers: Record<string, unknown>, id: string, option: string) {
  const value = answers[id];
  return Array.isArray(value) && value.includes(option);
}

function QuestionField({ question, answers }: { question: AssessmentQuestion; answers: Record<string, unknown> }) {
  if (question.type === "textarea") {
    return <textarea name={question.id} rows={question.final ? 9 : 5} defaultValue={valueFor(answers, question.id)} />;
  }

  if (question.type === "select") {
    return (
      <select name={question.id} defaultValue={valueFor(answers, question.id)}>
        <option value="">Choose one</option>
        {question.options?.map((option) => <option key={option}>{option}</option>)}
      </select>
    );
  }

  if (question.type === "scale") {
    return (
      <div className="client-scale">
        {question.options?.map((option) => (
          <label key={option}>
            <input name={question.id} type="radio" value={option} defaultChecked={valueFor(answers, question.id) === option} />
            <strong>{option}</strong>
          </label>
        ))}
      </div>
    );
  }

  if (question.type === "multiselect") {
    return (
      <div className="client-option-grid">
        {question.options?.map((option) => (
          <label key={option}>
            <input name={question.id} type="checkbox" value={option} defaultChecked={checked(answers, question.id, option)} />
            <span>{option}</span>
          </label>
        ))}
      </div>
    );
  }

  return <input name={question.id} defaultValue={valueFor(answers, question.id)} />;
}

export default function AssessmentForm({
  answers,
  sectionIndex,
}: {
  answers: Record<string, unknown>;
  sectionIndex: number;
}) {
  const section = assessmentSections[sectionIndex] ?? assessmentSections[0];
  const percent = completionPercentage(answers);
  const isLast = sectionIndex === assessmentSections.length - 1;
  const action = isLast ? completeAssessment : saveAssessmentProgress.bind(null, sectionIndex);

  return (
    <form className="client-assessment-form" action={action}>
      <div className="client-assessment-progress">
        <span>Section {sectionIndex + 1} of {assessmentSections.length}</span>
        <strong>{percent}% Complete</strong>
        <i><b style={{ width: `${percent}%` }} /></i>
      </div>

      <section className={section.id === "working_together" ? "client-assessment-section client-final-question-section" : "client-assessment-section"}>
        <p className="kicker">Business Health Assessment</p>
        <h1>{section.title}</h1>
        <div className="client-question-list">
          {section.questions.map((question) => (
            <label className={question.final ? "client-question client-final-question" : "client-question"} key={question.id}>
              <span>{question.final ? "One final question." : question.label}</span>
              {question.final && <strong>{question.label}</strong>}
              {question.maxSelected && <small>Select up to {question.maxSelected}.</small>}
              <QuestionField question={question} answers={answers} />
            </label>
          ))}
        </div>
      </section>

      <div className="client-assessment-actions">
        {sectionIndex > 0 ? <Link className="secondary-button" href={`/client/assessment?section=${sectionIndex - 1}`}>Back</Link> : <Link className="secondary-button" href="/client">Back To Workspace</Link>}
        <button className="button" type="submit">{isLast ? "Submit Assessment →" : "Save & Continue →"}</button>
      </div>
    </form>
  );
}
