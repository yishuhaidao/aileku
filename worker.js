addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url);
  // Redirect to GitHub raw for the actual content
  const resp = await fetch("https://yishuhaidao.github.io/aileku/login.html", {
    cf: { cacheTtl: 0 }
  });
  const html = await resp.text();
  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-cache, no-store, must-revalidate",
      "pragma": "no-cache",
      "expires": "0"
    }
  });
}
