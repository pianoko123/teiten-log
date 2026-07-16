import { getStore } from "@netlify/blobs";

// 共有の保存箱の名前。全端末・全ブラウザで同じ名前を使うことで、データが一つに繋がる
const STORE_NAME = "teiten-log";

export default async (req) => {
  const url = new URL(req.url);
  const key = url.searchParams.get("key");

  if (!key) {
    return new Response(JSON.stringify({ error: "key is required" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const store = getStore(STORE_NAME);

  try {
    if (req.method === "GET") {
      const value = await store.get(key);
      return new Response(JSON.stringify({ key, value: value ?? null }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }

    if (req.method === "POST") {
      const body = await req.json();
      await store.set(key, body.value ?? "");
      return new Response(JSON.stringify({ key, value: body.value ?? "" }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }

    if (req.method === "DELETE") {
      await store.delete(key);
      return new Response(JSON.stringify({ key, deleted: true }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "method not allowed" }), {
      status: 405,
      headers: { "content-type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
};

export const config = {
  path: "/api/data",
};
