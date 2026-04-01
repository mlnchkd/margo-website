import { notFound } from "next/navigation";
import { ProjectMasonry } from "@/components/ProjectMasonry";
import { getProjectBySlug, projects } from "@/lib/portfolio";

type Props = {
  params: Promise<{ lang: string; slug: string }>;
};

export function generateStaticParams() {
  const langs = ["en", "uk"];
  return langs.flatMap((lang) =>
    projects.map((project) => ({ lang, slug: project.slug }))
  );
}

export default async function ProjectPage({ params }: Props) {
  const { slug, lang } = await params;
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  return (
    <div style={{ maxWidth: "1100px" }}>
      <h1 style={{ fontSize: "16px", fontWeight: 400, marginBottom: "10px" }}>
        {project.title}
      </h1>
      <ProjectMasonry lang={lang} projectSlug={project.slug} images={project.images} />
    </div>
  );
}
