import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Shell } from "../../components";
import ResourceLandingPage from "../ResourceLandingPage";
import { getResource, resources } from "../resources";

type FreeResourcePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return resources.map((resource) => ({ slug: resource.slug }));
}

export async function generateMetadata({ params }: FreeResourcePageProps): Promise<Metadata> {
  const { slug } = await params;
  const resource = getResource(slug);

  if (!resource) {
    return {
      title: "Free Resource | Mosaic",
    };
  }

  return {
    title: `${resource.title} | Mosaic`,
    description: resource.metaDescription,
  };
}

export default async function FreeResourcePage({ params }: FreeResourcePageProps) {
  const { slug } = await params;
  const resource = getResource(slug);

  if (!resource) notFound();

  return (
    <Shell>
      <ResourceLandingPage resource={resource} />
    </Shell>
  );
}
