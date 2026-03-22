"use client";

import { createRoot } from "react-dom/client";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import { DECK_SLIDES } from "./DeckSlides";

const W = 1920;
const H = 1080;

/**
 * Renders each deck slide offscreen at 1920×1080 (16:9), captures as PNG,
 * and assembles a downloadable PDF.
 */
export async function generateDeckPdf(onProgress?: (done: number, total: number) => void) {
  const slides = DECK_SLIDES;
  const total = slides.length;

  /* Create a hidden offscreen container */
  const host = document.createElement("div");
  host.style.cssText = `position:fixed;left:-9999px;top:0;width:${W}px;height:${H}px;overflow:hidden;z-index:-1;`;
  document.body.appendChild(host);

  const images: string[] = [];

  for (let i = 0; i < total; i++) {
    const SlideComponent = slides[i].component;

    /* Mount the slide */
    const wrapper = document.createElement("div");
    wrapper.style.cssText = `width:${W}px;height:${H}px;background:#000;overflow:hidden;`;
    host.innerHTML = "";
    host.appendChild(wrapper);

    const root = createRoot(wrapper);
    root.render(
      <div style={{ width: W, height: H, background: "#000", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <SlideComponent />
      </div>
    );

    /* Wait for render + images/fonts to settle */
    await new Promise((r) => setTimeout(r, 600));

    /* Capture */
    const dataUrl = await toPng(wrapper, {
      width: W,
      height: H,
      pixelRatio: 1,
      backgroundColor: "#000",
      cacheBust: true,
    });
    images.push(dataUrl);

    root.unmount();
    onProgress?.(i + 1, total);
  }

  /* Cleanup */
  document.body.removeChild(host);

  /* Build PDF — landscape, custom page size in pt (1px ≈ 0.75pt) */
  const wPt = W * 0.75;
  const hPt = H * 0.75;
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "pt",
    format: [wPt, hPt],
  });

  for (let i = 0; i < images.length; i++) {
    if (i > 0) pdf.addPage([wPt, hPt], "landscape");
    pdf.addImage(images[i], "PNG", 0, 0, wPt, hPt);
  }

  pdf.save("ultron_investment deck.pdf");
}
