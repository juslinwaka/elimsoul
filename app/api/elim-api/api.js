export async function summarizeText(text) {
  const response = await fetch('https://juslin-elim-api.hf.space/summarize', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error('Summarization failed.');
  }

  const data = await response.json();
  return data.summary;
}
