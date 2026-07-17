async function askGemini(systemPrompt, question) {
  const apiKey = process.env.GROQ_API_KEY;
  const url = 'https://api.groq.com/openai/v1/chat/completions';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: question },
      ],
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || 'Groq API request failed');
  }

  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error('No response from Groq');

  return text;
}

module.exports = { askGemini };
