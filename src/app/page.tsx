"use client";

import { useEffect, useMemo, useState } from "react";

type Article = {
  id: string;
  title: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
  excerpt: string;
  content: string;
};

const articles: Article[] = [
  {
    id: "1",
    title: "Building Scalable Web Architecture in 2026",
    author: "Ava Morgan",
    date: "March 31, 2026",
    readTime: "7 min",
    tags: ["DevOps", "Architecture", "Cloud"],
    excerpt:
      "A practical checklist for modern infra, service isolation, and observability patterns that scale with traffic.",
    content:
      "Start with a strong foundation: versioned APIs, global edge caching, and microservice contracts. Practical examples include using feature flags, fast rollback strategies, and postmortem culture to keep production resilient. In this guide, we also cover cost-awareness and how to hedge against sudden bursts of demand.",
  },
  {
    id: "2",
    title: "5 React Design Patterns for Maintainable UIs",
    author: "Jordan Lee",
    date: "March 28, 2026",
    readTime: "6 min",
    tags: ["React", "Frontend", "UX"],
    excerpt:
      "Adopt these techniques to reduce bugs and improve collaboration with teammates on large, long-lived codebases.",
    content:
      "Use composable components, render-props, and context at scale; avoiding prop drilling and performance traps. Explore practical code samples for data fetching hooks, state management interop, and memoization that keeps the UI snappy.",
  },
];

const storageKeys = {
  likes: (id: string) => `article:${id}:likes`,
  comments: (id: string) => `article:${id}:comments`,
};

type SavedState = {
  likes: number;
  comments: string[];
};

function formatTag(tag: string) {
  return tag.toUpperCase();
}

function ArticleDetail({ article }: { article: Article }) {
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState<string[]>([]);
  const [commentDraft, setCommentDraft] = useState("");

  useEffect(() => {
    const savedLikes = Number(localStorage.getItem(storageKeys.likes(article.id)) || 0);
    const savedComments = JSON.parse(localStorage.getItem(storageKeys.comments(article.id)) || "[]");
    setLikes(Number.isNaN(savedLikes) ? 0 : savedLikes);
    setComments(Array.isArray(savedComments) ? savedComments : []);
  }, [article.id]);

  useEffect(() => {
    localStorage.setItem(storageKeys.likes(article.id), String(likes));
  }, [likes, article.id]);

  useEffect(() => {
    localStorage.setItem(storageKeys.comments(article.id), JSON.stringify(comments));
  }, [comments, article.id]);

  const addComment = () => {
    const body = commentDraft.trim();
    if (!body) return;
    setComments((current) => [body, ...current]);
    setCommentDraft("");
  };

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-4">
        <p className="text-sm text-slate-500">{article.date} · {article.readTime}</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">{article.title}</h1>
        <p className="mt-1 text-sm font-medium text-slate-600">By {article.author}</p>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        {article.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {formatTag(tag)}
          </span>
        ))}
      </div>
      <p className="mb-6 leading-7 text-slate-700">{article.excerpt}</p>
      <p className="mb-6 leading-7 text-slate-700">{article.content}</p>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <button
          onClick={() => setLikes((prev) => prev + 1)}
          className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-700"
        >
          👍 Like ({likes})
        </button>
        <span className="text-sm text-slate-500">{comments.length} comment(s)</span>
      </div>

      <section>
        <h2 className="mb-3 text-xl font-semibold text-slate-900">Comments</h2>
        <div className="mb-4 space-y-2">
          <textarea
            value={commentDraft}
            onChange={(e) => setCommentDraft(e.target.value)}
            rows={3}
            placeholder="Share your thoughts..."
            className="w-full rounded-lg border border-slate-300 p-3 focus:border-cyan-500 focus:outline-none"
          />
          <button
            onClick={addComment}
            className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-900"
          >
            Post comment
          </button>
        </div>

        <div className="space-y-3">
          {comments.length === 0 ? (
            <p className="text-sm text-slate-500">No comments yet. Be the first to share insight.</p>
          ) : (
            comments.map((comment, index) => (
              <div key={`${comment}-${index}`} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-sm text-slate-800">{comment}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </article>
  );
}

export default function Home() {
  const [activeArticleId, setActiveArticleId] = useState(articles[0].id);
  const activeArticle = useMemo(
    () => articles.find((article) => article.id === activeArticleId) || articles[0],
    [activeArticleId]
  );

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="rounded-2xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 p-8 text-white shadow-lg">
          <h1 className="text-3xl font-bold sm:text-5xl">Tech Insight Hub</h1>
          <p className="mt-2 max-w-2xl text-sm sm:text-base text-cyan-100">
            Publish technology articles, engage with your community, and grow your ideas with likes and real-time comments.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-lg font-bold text-slate-800">All Articles</h2>
            <div className="space-y-3">
              {articles.map((article) => {
                const active = article.id === activeArticleId;
                return (
                  <button
                    key={article.id}
                    onClick={() => setActiveArticleId(article.id)}
                    className={`block w-full rounded-xl p-3 text-left transition ${
                      active ? "bg-cyan-100 text-slate-900" : "bg-slate-50 hover:bg-slate-100"
                    }`}
                  >
                    <p className="text-sm font-semibold">{article.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{article.author} · {article.readTime}</p>
                  </button>
                );
              })}
            </div>
          </aside>

          <main>
            <ArticleDetail article={activeArticle} />
          </main>
        </div>
      </div>
    </div>
  );
}
