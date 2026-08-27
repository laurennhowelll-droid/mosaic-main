"use client";

import { useActionState } from "react";
import { setWorkPublishState } from "./editor-actions";

export default function PublishButton({ id, publish }: { id: string; publish: boolean }) {
  const [state, action, isPending] = useActionState(setWorkPublishState.bind(null, id, publish), {});

  return (
    <form action={action}>
      <button className="text-link" type="submit" disabled={isPending}>
        {isPending ? "Saving..." : publish ? "Publish" : "Unpublish"}
      </button>
      {state.error ? <span className="admin-inline-error">{state.error}</span> : null}
    </form>
  );
}
