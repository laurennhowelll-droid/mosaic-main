import type { Metadata } from "next";
import { Shell } from "../../components";
import SavedSystemsScore from "./SavedSystemsScore";

export const metadata: Metadata = {
  title: "Your Systems Score | Mosaic",
  robots: { index: false, follow: false },
};

export default function SavedSystemsScorePage() {
  return <Shell><SavedSystemsScore /></Shell>;
}
