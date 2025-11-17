/**
 * Parses JSON object from text (extracts first JSON object found)
 */
export function parseJsonFromText(text: string | null | undefined): Record<string, any> {
  if (!text) return {};
  const trimmed = text.trim();
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return {};
  }

  try {
    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.warn("Không thể parse JSON từ phản hồi AI:", text);
    return {};
  }
}

/**
 * Parses JSON array from text (extracts first JSON array found)
 */
export function parseJsonArrayFromText(text: string | null | undefined): any[] {
  if (!text) return [];
  const trimmed = text.trim();

  // Try to find JSON array in the text
  const arrayMatch = trimmed.match(/\[[\s\S]*\]/);
  if (!arrayMatch) {
    return [];
  }

  try {
    return JSON.parse(arrayMatch[0]);
  } catch (err) {
    console.warn("Không thể parse JSON array từ phản hồi AI:", text);
    return [];
  }
}

