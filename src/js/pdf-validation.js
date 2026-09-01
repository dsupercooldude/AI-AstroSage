// src/js/pdf-validation.js
window.PDFValidator = {
  expectedWidth: 794,
  expectedHeight: 1123,
  expectedPageCount: 12,
  tolerance: 3,

  waitForLayout: async function () {
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  },

  inspect: function (root) {
    const result = { valid: true, pages: 0, issues: [], scaledPages: [] };
    if (!root) return { valid: false, pages: 0, issues: ["PDF render target is missing."] };

    const pages = Array.from(root.querySelectorAll(":scope > .pdf-page"));
    result.pages = pages.length;
    if (!pages.length) result.issues.push("No PDF pages were found.");
    if (pages.length !== this.expectedPageCount) result.issues.push(`Expected ${this.expectedPageCount} pages but found ${pages.length}.`);

    pages.forEach((page, index) => {
      const pageNumber = index + 1;
      const rect = page.getBoundingClientRect();
      const width = Math.round(rect.width);
      const height = Math.round(rect.height);
      const hasContent = page.textContent.trim().length > 0 || page.querySelector("svg, canvas, img");

      if (Math.abs(width - this.expectedWidth) > this.tolerance || Math.abs(height - this.expectedHeight) > this.tolerance) {
        result.issues.push(`Page ${pageNumber} has invalid dimensions (${width}x${height}px).`);
      }
      if (page.scrollWidth > page.clientWidth + this.tolerance) {
        result.issues.push(`Page ${pageNumber} has horizontal overflow.`);
      }
      if (page.scrollHeight > page.clientHeight + this.tolerance && page.dataset.pdfFit !== "scale") {
        result.issues.push(`Page ${pageNumber} has vertical overflow and may be clipped.`);
      }
      if (page.dataset.pdfFit === "scale") result.scaledPages.push(pageNumber);
      if (!hasContent) result.issues.push(`Page ${pageNumber} is empty.`);
    });

    result.valid = result.issues.length === 0;
    return result;
  },

  autoFix: async function (root) {
    if (!root) return;
    let style = document.getElementById("pdf-auto-fit-styles");
    if (!style) {
      style = document.createElement("style");
      style.id = "pdf-auto-fit-styles";
      style.textContent = `
        .pdf-auto-fit { padding: 24px !important; overflow: visible !important; }
        .pdf-auto-fit > div { padding: 14px !important; margin-bottom: 12px !important; gap: 12px !important; }
        .pdf-auto-fit .grid { gap: 10px !important; }
        .pdf-auto-fit .space-y-6 > * + * { margin-top: 10px !important; }
        .pdf-auto-fit .space-y-4 > * + * { margin-top: 8px !important; }
        .pdf-auto-fit .text-3xl { font-size: 22px !important; line-height: 1.15 !important; }
        .pdf-auto-fit .text-2xl { font-size: 17px !important; line-height: 1.2 !important; }
        .pdf-auto-fit .text-xl { font-size: 14px !important; line-height: 1.2 !important; }
        .pdf-auto-fit .text-base { font-size: 10px !important; line-height: 1.3 !important; }
        .pdf-auto-fit .text-sm { font-size: 10px !important; line-height: 1.3 !important; }
        .pdf-auto-fit .text-lg { font-size: 13px !important; line-height: 1.2 !important; }
      `;
      document.head.appendChild(style);
    }

    for (let pass = 0; pass < 3; pass++) {
      await this.waitForLayout();
      const pages = Array.from(root.querySelectorAll(":scope > .pdf-page"));
      const overflowing = pages.filter((page) => page.scrollWidth > page.clientWidth + this.tolerance || page.scrollHeight > page.clientHeight + this.tolerance);
      if (!overflowing.length) return;
      overflowing.forEach((page) => page.classList.add("pdf-auto-fit"));
    }

    const pages = Array.from(root.querySelectorAll(":scope > .pdf-page"));
    pages.forEach((page) => {
      if (page.scrollWidth > page.clientWidth + this.tolerance || page.scrollHeight > page.clientHeight + this.tolerance) page.dataset.pdfFit = "scale";
    });
  },

  validate: async function (root) {
    await this.autoFix(root);
    await this.waitForLayout();
    return this.inspect(root);
  },

  formatIssues: function (result) {
    return (result.issues || []).join("\n");
  }
};
