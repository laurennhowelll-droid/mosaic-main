import { notFound, permanentRedirect } from "next/navigation";

const redirects: Record<string, string> = {
  vision: "/services/inquire/clarity",
  experience: "/services/inquire/website",
  connect: "/services/inquire/systems",
  grow: "/services/inquire/generate",
};

export function generateStaticParams() {
  return Object.keys(redirects).map((slug) => ({ slug }));
}

export default async function LegacyServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const destination = redirects[slug];

  if (!destination) {
    notFound();
  }

  permanentRedirect(destination);
}
