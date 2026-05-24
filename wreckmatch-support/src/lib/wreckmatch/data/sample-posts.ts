import type { Post } from "@/lib/wreckmatch/models/post";

export const samplePosts: Post[] = [
  {
    id: "post-1",
    author_id: "user-1",
    author_name: "Jordan",
    body: "Three months in and I finally drove past the intersection without shaking. Small win, but it felt huge.",
    post_type: "win",
    is_anonymous: false,
    created_at: "2026-05-20T14:30:00Z",
  },
  {
    id: "post-2",
    author_id: "user-2",
    author_name: "Anonymous Survivor",
    body: "Insurance called again today and my chest tightened up. Does anyone else dread those conversations?",
    post_type: "struggle",
    is_anonymous: true,
    created_at: "2026-05-19T09:15:00Z",
  },
  {
    id: "post-3",
    author_id: "user-3",
    author_name: "Maria",
    body: "How do you explain brain fog to family who wasn't in the wreck? They mean well but don't always get it.",
    post_type: "question",
    is_anonymous: false,
    created_at: "2026-05-18T18:45:00Z",
  },
  {
    id: "post-4",
    author_id: "user-4",
    author_name: "Alex",
    body: "I kept my journal short at first — just one sentence a day. It helped me see progress when everything felt stuck.",
    post_type: "story",
    is_anonymous: false,
    created_at: "2026-05-17T11:00:00Z",
  },
  {
    id: "post-5",
    author_id: "user-5",
    author_name: "Sam",
    body: "First full night of sleep in weeks. Grateful for this community reminding me recovery isn't linear.",
    post_type: "win",
    is_anonymous: false,
    created_at: "2026-05-16T07:20:00Z",
  },
];
