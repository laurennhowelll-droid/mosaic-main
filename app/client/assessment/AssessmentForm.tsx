"use client";

import Link from "next/link";
import { FormEvent, useMemo, useRef, useState } from "react";
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

function isAnswered(question: AssessmentQuestion, answers: Record<string, unknown>) {
  const value = answers[question.id];

  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "string") return value.trim().length > 0;
  return false;
}

function QuestionField({
  question,
  answers,
  updateAnswer,
}: {
  question: AssessmentQuestion;
  answers: Record<string, unknown>;
  updateAnswer: (id: string, value: string | string[]) => void;
}) {
  if (question.type === "textarea") {
    return <textarea required name={question.id} rows={question.final ? 9 : 5} value={valueFor(answers, question.id)} onChange={(event) => updateAnswer(question.id, event.target.value)} />;
  }

  if (question.type === "select") {
    return (
      <select required name={question.id} value={valueFor(answers, question.id)} onChange={(event) => updateAnswer(question.id, event.target.value)}>
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
            <input name={question.id} type="radio" value={option} checked={valueFor(answers, question.id) === option} onChange={() => updateAnswer(question.id, option)} />
            <strong>{option}</strong>
          </label>
        ))}
      </div>
    );
  }

  if (question.type === "multiselect") {
    const selected = Array.isArray(answers[question.id]) ? answers[question.id] as string[] : [];

    return (
      <div className="client-option-grid">
        {question.options?.map((option) => (
          <label key={option}>
            <input
              name={question.id}
              type="checkbox"
              value={option}
              checked={checked(answers, question.id, option)}
              onChange={(event) => {
                const next = event.target.checked
                  ? [...selected, option]
                  : selected.filter((item) => item !== option);
                updateAnswer(question.id, question.maxSelected ? next.slice(0, question.maxSelected) : next);
              }}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    );
  }

  return <input required name={question.id} value={valueFor(answers, question.id)} onChange={(event) => updateAnswer(question.id, event.target.value)} />;
}

export default function AssessmentForm({
  answers,
  sectionIndex,
}: {
  answers: Record<string, unknown>;
  sectionIndex: number;
}) {
  const [currentAnswers, setCurrentAnswers] = useState(answers);
  const [submitted, setSubmitted] = useState(false);
  const questionRefs = useRef<Record<string, HTMLLabelElement | null>>({});
  const section = assessmentSections[sectionIndex] ?? assessmentSections[0];
  const percent = completionPercentage(currentAnswers);
  const isLast = sectionIndex === assessmentSections.length - 1;
  const action = isLast ? completeAssessment : saveAssessmentProgress.bind(null, sectionIndex);
  const currentSectionComplete = section.questions.every((question) => isAnswered(question, currentAnswers));
  const allQuestions = useMemo(() => assessmentSections.flatMap((item) => item.questions), []);
  const allComplete = allQuestions.every((question) => isAnswered(question, currentAnswers));
  const incompleteCurrent = new Set(section.questions.filter((question) => !isAnswered(question, currentAnswers)).map((question) => question.id));

  function updateAnswer(id: string, value: string | string[]) {
    setCurrentAnswers((current) => ({ ...current, [id]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const valid = isLast ? allComplete : currentSectionComplete;

    if (valid) return;

    event.preventDefault();
    setSubmitted(true);

    const firstIncomplete = section.questions.find((question) => !isAnswered(question, currentAnswers));
    if (firstIncomplete) {
      const target = questionRefs.current[firstIncomplete.id];
      target?.scrollIntoView({ behavior: "smooth", block: "center" });
      const input = target?.querySelector<HTMLElement>("input, textarea, select");
      input?.focus();
    }
  }

  return (
    <form className="client-assessment-form" action={action} onSubmit={handleSubmit} noValidate>
      <div className="client-assessment-progress">
        <span>Section {sectionIndex + 1} of {assessmentSections.length}</span>
        <strong>{percent}% Complete</strong>
        <i><b style={{ width: `${percent}%` }} /></i>
        <p>Please complete every question before submitting your assessment. Your progress will be saved as you go.</p>
      </div>

      <section className={section.id === "working_together" ? "client-assessment-section client-final-question-section" : "client-assessment-section"}>
        <p className="kicker">Business Health Assessment</p>
        <h1>{section.title}</h1>
        <div className="client-question-list">
          {section.questions.map((question) => (
            <label
              className={[
                "client-question",
                question.final ? "client-final-question" : "",
                submitted && incompleteCurrent.has(question.id) ? "client-question-incomplete" : "",
              ].filter(Boolean).join(" ")}
              key={question.id}
              ref={(node) => {
                questionRefs.current[question.id] = node;
              }}
            >
              <input type="hidden" name="__question_id" value={question.id} />
              <span>{question.final ? "One final question." : question.label}</span>
              {question.final && <strong>{question.label}</strong>}
              {question.maxSelected && <small>Select up to {question.maxSelected}.</small>}
              <QuestionField question={question} answers={currentAnswers} updateAnswer={updateAnswer} />
              {submitted && incompleteCurrent.has(question.id) && <em>Please complete this question.</em>}
            </label>
          ))}
        </div>
      </section>

      <div className="client-assessment-actions">
        {sectionIndex > 0 ? <Link className="secondary-button" href={`/client/assessment?section=${sectionIndex - 1}`}>Back</Link> : <Link className="secondary-button" href="/client">Back To Workspace</Link>}
        <div className="client-submit-group">
          {isLast && <p>All questions must be completed before submission.</p>}
          <button className="button" type="submit" disabled={isLast && !allComplete}>{isLast ? "Submit Assessment →" : "Save & Continue →"}</button>
        </div>
      </div>
    </form>
  );
}
