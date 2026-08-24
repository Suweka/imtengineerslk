export async function removeBackground(image: string | Buffer): Promise<Buffer> {
  if (!process.env.REMOVE_BG_API_KEY) {
    throw new Error("REMOVE_BG_API_KEY not configured");
  }

  let imageBuffer: Buffer;
  if (Buffer.isBuffer(image)) {
    imageBuffer = image;
  } else {
    const imgRes = await fetch(image);
    if (!imgRes.ok) {
      throw new Error(`Failed to fetch image: ${imgRes.statusText}`);
    }
    imageBuffer = Buffer.from(await imgRes.arrayBuffer());
  }

  const formData = new FormData();
  formData.append("image_file", new Blob([new Uint8Array(imageBuffer)]), "image.png");
  formData.append("size", "auto");

  const removeBgRes = await fetch("https://api.remove.bg/v1.0/removebg", {
    method: "POST",
    headers: {
      "X-Api-Key": process.env.REMOVE_BG_API_KEY,
    },
    body: formData,
  });

  if (!removeBgRes.ok) {
    const error = await removeBgRes.text();
    console.error("remove.bg API error:", error);
    throw new Error(`remove.bg failed: ${removeBgRes.status}`);
  }

  const processedBuffer = await removeBgRes.arrayBuffer();
  return Buffer.from(processedBuffer);
}
