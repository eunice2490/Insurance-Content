import Anthropic from '@anthropic-ai/sdk';

let client: Anthropic | null = null;

export function getAnthropicClient(): Anthropic {
  if (!client) {
    const token = process.env.ANTHROPIC_API_KEY;
    if (!token) {
      throw new Error('ANTHROPIC_API_KEY environment variable is not set.');
    }
    // Session ingress tokens (sk-ant-si-*) use OAuth Bearer auth
    if (token.startsWith('sk-ant-si-')) {
      client = new Anthropic({
        apiKey: token,
        fetch: (url: RequestInfo, init?: RequestInit) => {
          const headers = new Headers(init?.headers);
          headers.set('Authorization', `Bearer ${token}`);
          headers.delete('x-api-key');
          return fetch(url, { ...init, headers });
        },
      });
    } else {
      client = new Anthropic({ apiKey: token });
    }
  }
  return client;
}

export async function callClaude(prompt: string): Promise<string> {
  const anthropic = getAnthropicClient();
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
  });

  const block = message.content[0];
  if (block.type !== 'text') throw new Error('Unexpected response type from Claude.');
  return block.text;
}
