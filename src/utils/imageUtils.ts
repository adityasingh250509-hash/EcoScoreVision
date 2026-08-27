/**
 * Helper utility to resize and normalize images to clean JPEG base64 strings
 * to ensure lightning-fast network transport and 100% compatibility with Gemini API.
 */
export async function normalizeImageForAnalysis(fileOrDataUrl: File | string, maxDimension: number = 1024): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = Math.max(width, 1);
      canvas.height = Math.max(height, 1);

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        // Fallback to original if canvas context unavailable
        if (typeof fileOrDataUrl === "string") {
          resolve(fileOrDataUrl);
        } else {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(fileOrDataUrl);
        }
        return;
      }

      // Draw with white background in case of transparent PNG/SVG
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Export as high quality JPEG base64
      const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.88);
      resolve(compressedDataUrl);
    };

    img.onerror = () => {
      // If image loading fails directly (e.g. unusual data url), fallback to raw string
      if (typeof fileOrDataUrl === "string") {
        resolve(fileOrDataUrl);
      } else {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(fileOrDataUrl);
      }
    };

    if (typeof fileOrDataUrl === "string") {
      img.src = fileOrDataUrl;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(fileOrDataUrl);
    }
  });
}
