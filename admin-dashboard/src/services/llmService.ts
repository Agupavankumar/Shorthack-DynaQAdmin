import { getAzureOpenAIModel } from './openaiAgent';

export async function generateHtmlCssFromPrompt(prompt: string, selector?: string): Promise<string> {
  const model = getAzureOpenAIModel();
  const systemPrompt = `You are an expert web developer. Given a user prompt, generate the HTML code needed to fulfill the request. All CSS must be inlined using the style attribute on each element. Do not use <style> tags or class attributes. If a selector is provided, position the generated code relative to that element.`;
  const userPrompt = selector
    ? `${prompt}\nTarget selector: ${selector}`
    : prompt;

  const response = await model.invoke([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ]);

  // Ensure we always return a string
  return typeof response.content === 'string'
    ? response.content
    : JSON.stringify(response.content);
} 