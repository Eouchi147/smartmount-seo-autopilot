import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ImageIcon, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { MarkdownBody } from "@/components/markdown-body";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DASHBOARD_KEY } from "@/hooks/use-dashboard";
import {
  generateArticleImage,
  getArticle,
  publishArticle,
  updateArticle,
} from "@/lib/seo/actions";

export const Route = createFileRoute("/app/content/$articleId")({
  component: ArticlePage,
});

function ArticlePage() {
  const { articleId } = Route.useParams();
  const id = Number(articleId);
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["article", id],
    queryFn: () => getArticle({ data: { id } }),
    enabled: Number.isFinite(id),
  });
  const article = q.data;
  const [title, setTitle] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [body, setBody] = useState("");
  const [tab, setTab] = useState<"edit" | "preview" | "seo">("preview");

  useEffect(() => {
    if (!article) return;
    setTitle(article.title);
    setMetaTitle(article.meta_title ?? "");
    setMetaDesc(article.meta_description ?? "");
    setBody(article.body_markdown);
  }, [article]);

  const save = useMutation({
    mutationFn: () =>
      updateArticle({
        data: {
          id,
          title,
          meta_title: metaTitle,
          meta_description: metaDesc,
          body_markdown: body,
        },
      }),
    onSuccess: () => {
      toast.success("Saved");
      void qc.invalidateQueries({ queryKey: ["article", id] });
      void qc.invalidateQueries({ queryKey: DASHBOARD_KEY });
    },
  });

  const statusMut = useMutation({
    mutationFn: (status: "review" | "paused" | "published" | "scheduled") =>
      updateArticle({ data: { id, status } }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["article", id] });
      void qc.invalidateQueries({ queryKey: DASHBOARD_KEY });
    },
  });

  const image = useMutation({
    mutationFn: () => generateArticleImage({ data: { id } }),
    onSuccess: (res) => {
      if (res.ok) {
        toast.success("Install photo ready");
        void q.refetch();
      } else toast.error(res.error);
    },
  });

  const publish = useMutation({
    mutationFn: () => {
      const wpUser = localStorage.getItem("sm-wp-user") ?? undefined;
      const wpAppPassword = localStorage.getItem("sm-wp-pass") ?? undefined;
      const webhookUrl = localStorage.getItem("sm-webhook") ?? undefined;
      return publishArticle({ data: { id, wpUser, wpAppPassword, webhookUrl } });
    },
    onSuccess: (res) => {
      if (res.ok) {
        toast.success(res.detail);
        void qc.invalidateQueries({ queryKey: ["article", id] });
        void qc.invalidateQueries({ queryKey: DASHBOARD_KEY });
      }
    },
  });

  if (q.isLoading) {
    return <p className="text-sm text-muted-foreground">Loading article…</p>;
  }
  if (!article) {
    return (
      <p className="text-sm">
        Article not found. <Link to="/app/content">Back</Link>
      </p>
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow={article.keyword ?? article.slug}
        title={article.title}
        description={`${article.word_count ?? 0} words · ${article.language.toUpperCase()}`}
        action={
          <>
            <StatusBadge status={article.status} />
            <Button variant="outline" onClick={() => save.mutate()} disabled={save.isPending}>
              {save.isPending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              Save
            </Button>
            <Button onClick={() => publish.mutate()} disabled={publish.isPending}>
              {publish.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
              Publish
            </Button>
          </>
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {(["preview", "edit", "seo"] as const).map((t) => (
          <Button
            key={t}
            size="sm"
            variant={tab === t ? "default" : "outline"}
            onClick={() => setTab(t)}
            className="capitalize"
          >
            {t}
          </Button>
        ))}
        <Button
          size="sm"
          variant="outline"
          onClick={() => image.mutate()}
          disabled={image.isPending}
        >
          {image.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <ImageIcon className="size-4" />
          )}
          Generate photo
        </Button>
        {article.status !== "paused" ? (
          <Button size="sm" variant="ghost" onClick={() => statusMut.mutate("paused")}>
            Pause
          </Button>
        ) : (
          <Button size="sm" variant="ghost" onClick={() => statusMut.mutate("review")}>
            Resume
          </Button>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
        <Card>
          <CardContent className="p-5">
            {tab === "preview" ? (
              <article>
                {article.image_url ? (
                  <img
                    src={article.image_url}
                    alt={article.image_alt ?? article.title}
                    className="mb-5 aspect-video w-full rounded-lg object-cover outline outline-1 -outline-offset-1 outline-foreground/10"
                  />
                ) : null}
                <h2 className="text-2xl font-semibold tracking-tight">{title || article.h1}</h2>
                <MarkdownBody markdown={body} className="mt-4" />
              </article>
            ) : null}
            {tab === "edit" ? (
              <div className="space-y-3">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                <Label htmlFor="body">Body</Label>
                <Textarea
                  id="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="min-h-[28rem] font-mono text-[13px] leading-relaxed"
                />
              </div>
            ) : null}
            {tab === "seo" ? (
              <div className="space-y-3">
                <Label htmlFor="mt">Meta title</Label>
                <Input id="mt" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} />
                <p className="text-xs text-muted-foreground">{metaTitle.length}/60</p>
                <Label htmlFor="md">Meta description</Label>
                <Textarea
                  id="md"
                  value={metaDesc}
                  onChange={(e) => setMetaDesc(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">{metaDesc.length}/155</p>
                <Label>FAQ schema</Label>
                <ul className="space-y-2 text-sm">
                  {article.faq.map((f) => (
                    <li key={f.q} className="rounded-lg bg-secondary/60 p-3">
                      <p className="font-medium">{f.q}</p>
                      <p className="mt-1 text-muted-foreground">{f.a}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </CardContent>
        </Card>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Internal links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {article.internal_links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="block text-primary hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  {l.text}
                </a>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Local schema</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="max-h-64 overflow-auto rounded-lg bg-secondary/60 p-3 font-mono text-[11px] leading-relaxed text-muted-foreground">
                {article.schema_json}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
