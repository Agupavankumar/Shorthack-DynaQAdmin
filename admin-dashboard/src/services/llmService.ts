import { getAzureOpenAIModel } from './openaiAgent';

function ensureHtml(response: string): string {
  // Simple check: if response contains <html, <div, <span, <button, <p, etc., treat as HTML
  // Otherwise, wrap in a <div> and warn
  const htmlLike = /<\s*(html|div|span|button|p|h[1-6]|ul|ol|li|table|form|input|img|section|article|header|footer|main|nav|aside|a|svg|canvas|video|audio|iframe|br|hr|pre|code|blockquote|figure|figcaption|label|select|option|textarea|strong|em|b|i|u|small|big|sup|sub|mark|cite|q|abbr|address|dl|dt|dd|fieldset|legend|datalist|optgroup|output|progress|meter|details|summary|menu|menuitem|dialog|script|noscript|template|slot|custom-element)[^>]*>/i;
  if (htmlLike.test(response)) {
    return response;
  }
  return `<div style="color: red; font-size: 1rem;">[Warning: LLM did not return HTML. Displaying as plain text]</div><div>${response.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>`;
}

export async function generateHtmlCssFromPrompt(prompt: string, selector?: string): Promise<string> {
  const model = getAzureOpenAIModel();
  const systemPrompt = `You are an expert web developer. Given a user prompt, generate only the HTML code needed to fulfill the request. All CSS must be inlined using the style attribute on each element. Do not use <style> tags, class attributes, or markdown formatting. Never include explanations, comments, or text outside of the HTML code. If a selector is provided, position the generated code relative to that element.`;
  const userPrompt = selector
    ? `${prompt}\nTarget selector: ${selector}`
    : prompt;

  const response = await model.invoke([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ]);

  const content = typeof response.content === 'string'
    ? response.content
    : JSON.stringify(response.content);

  return ensureHtml(content);
}

// Simple instruction builder for appendHTML
export function buildSimpleInstruction(elementData: any, htmlContent: string, prompt: string) {
  let action = 'appendHTML';
  let content = htmlContent;

  if (prompt.trim().toLowerCase() === 'remove') {
    action = 'removeElement';
    content = '';
  } else if (prompt.trim().toLowerCase().startsWith('update:')) {
    action = 'replaceHTML';
    content = prompt.trim().slice(7).trim();
  }

  return {
    id: `dynaq-${Date.now()}`,
    action,
    selector: elementData.id ? `#${elementData.id}` : elementData.path || '',
    path: elementData.path || '',
    content
  };
} 