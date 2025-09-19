// utils/exportUtils.js
import jsPDF from "jspdf";

export function exportAsJSON(result) {
  const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
  triggerDownload(blob, 'review.json');
}

export function exportAsMarkdown(result) {
  const md = `
# 📝 Code Review Report

**Language:** ${result.language}
**Score:** ${result.score}%

---

## 📌 Summary
${result.summary || 'No summary.'}

---

## 🚨 Issues
${result.issues && result.issues.length > 0
    ? result.issues
        .map(
          (i) =>
            `- **${i.severity.toUpperCase()}**: ${i.message}${
              i.suggestion ? `\n  👉 Suggestion:\n\`\`\`\n${i.suggestion}\n\`\`\`` : ''
            }`
        )
        .join('\n')
    : 'No issues found.'}

---

## 💡 Suggestions
${result.suggestions && result.suggestions.length > 0
    ? result.suggestions.map((s) => `- ${s}`).join('\n')
    : 'No additional suggestions.'}
`;

  const blob = new Blob([md], { type: 'text/markdown' });
  triggerDownload(blob, 'review.md');
}

export async function exportAsPDF(result) {
  try {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('📝 Code Review Report', 10, 10);

    doc.setFontSize(12);
    doc.text(`Language: ${result.language}`, 10, 20);
    doc.text(`Score: ${result.score}%`, 10, 30);

    doc.text('Summary:', 10, 40);
    const summaryText = doc.splitTextToSize(result.summary || 'No summary.', 180);
    doc.text(summaryText, 10, 50);

    let y = 70;
    doc.text('Issues:', 10, y);
    y += 10;
    if (result.issues && result.issues.length > 0) {
      result.issues.forEach((i) => {
        const issueText = `• [${i.severity.toUpperCase()}] ${i.message}`;
        const wrapped = doc.splitTextToSize(issueText, 180);
        doc.text(wrapped, 10, y);
        y += wrapped.length * 7;

        if (i.suggestion) {
          const suggText = `Suggestion: ${i.suggestion}`;
          const wrappedSugg = doc.splitTextToSize(suggText, 180);
          doc.text(wrappedSugg, 15, y);
          y += wrappedSugg.length * 7;
        }
        y += 5;
      });
    } else {
      doc.text('No issues found.', 10, y);
      y += 10;
    }

    doc.save('review.pdf');
  } catch (err) {
    console.error('PDF export failed:', err);
    alert('Failed to export PDF. Please install jspdf.');
  }
}

function triggerDownload(blob, filename) {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
