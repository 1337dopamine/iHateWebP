(async () => {
  const { enabled, format } = await chrome.storage.sync.get(['enabled', 'format']);
  if (!enabled) return;

  const convertImage = async (url) => {
    const blob = await fetch(url).then(r => r.blob());
    const bitmap = await createImageBitmap(blob);
    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bitmap, 0, 0);
    return canvas.toDataURL(`image/${format}`);
  };

  // handle <img> tags [1.1]
  const images = document.querySelectorAll('img[src$=".webp"]');
  for (const img of images) {
    try {
      img.src = await convertImage(img.src);
    } catch (e) {
      console.error("Failed to convert img tag:", e);
    }
  }

  if (
    document.body.children.length === 1 &&
    document.body.firstElementChild.tagName === "IMG" &&
    document.body.firstElementChild.src.endsWith(".webp")
  ) {
    const img = document.body.firstElementChild;
    try {
      const newSrc = await convertImage(img.src);
      img.src = newSrc;
    } catch (e) {
      console.error("Failed to convert standalone image:", e);
    }
  }

  if (document.contentType === "image/webp") {
    try {
      const blob = await fetch(window.location.href).then(r => r.blob());
      const bitmap = await createImageBitmap(blob);
      const canvas = document.createElement('canvas');
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      canvas.getContext('2d').drawImage(bitmap, 0, 0);

      const dataURL = canvas.toDataURL(`image/${format}`);
      document.head.innerHTML = '';
      document.body.innerHTML = '';
      const newImg = document.createElement('img');
      newImg.src = dataURL;
      newImg.style = "max-width:100vw; max-height:100vh; display:block; margin:auto;";
      document.body.appendChild(newImg);
    } catch (e) {
      console.error("Failed to convert raw .webp image:", e);
    }
  }
})();
