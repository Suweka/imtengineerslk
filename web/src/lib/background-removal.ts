export async function removeBackground(imageUrl: string): Promise<Buffer> {
  if (!process.env.REMOVE_BG_API_KEY) {
    throw new Error("REMOVE_BG_API_KEY not configured");
  }

  // Fetch the image from the URL
  const imgRes = await fetch(imageUrl);
  if (!imgRes.ok) {
    throw new Error(`Failed to fetch image: ${imgRes.statusText}`);
  }

  const imageBuffer = await imgRes.arrayBuffer();

  // Call remove.bg API
  const removeBgRes = await fetch("https://api.remove.bg/v1.0/removebg", {
    method: "POST",
    headers: {
      "X-Api-Key": process.env.REMOVE_BG_API_KEY,
    },
    body: imageBuffer,
  });

  if (!removeBgRes.ok) {
    const error = await removeBgRes.text();
    console.error("remove.bg API error:", error);
    throw new Error(`remove.bg failed: ${removeBgRes.status}`);
  }

  const processedBuffer = await removeBgRes.arrayBuffer();
  return Buffer.from(processedBuffer);
}
