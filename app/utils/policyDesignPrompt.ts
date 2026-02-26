import { extractPageContent } from '@/app/utils/contentExtractor';

type BuildPolicyDesignPromptParams = {
  t: (key: string) => string;
  lang: string;
  customConfig?: string;
};

const casbinPolicyGuide = `
Key Casbin notes:
- Policy rules are CSV lines like "p, sub, obj, act" (ACL example).
- RBAC role inheritance uses "g, user, role" (or g2/g3 if defined in model).
- Follow the model's [policy_definition] and [role_definition] fields strictly.
- Keep the rule set minimal and consistent with the request definition.
`;

// Key function: build the prompt for AI policy design using extracted page context.
export const buildPolicyDesignPrompt = ({ t, lang, customConfig }: BuildPolicyDesignPromptParams) => {
  // Core logic: reuse content extraction to assemble context and avoid duplicate parsing.
  const { extractedContent } = extractPageContent('policy', t, lang, customConfig);

  // Edge case: if context is missing (e.g. "No ... found"), treat it as empty and be conservative.
  return [
    `Please answer in ${lang} language.`,
    `You are a Casbin policy expert.`,
    `Task: Design Casbin policy rules based on the context and produce a short explanation.`,
    `Output format:`,
    `1) Policy Rules (CSV, one rule per line, only p/g/g2/g3 lines).`,
    `2) Explanation (brief, 3-6 sentences).`,
    casbinPolicyGuide.trim(),
    `Context:`,
    extractedContent,
    `Notes: If any section says "No ... found", treat it as empty and infer safely.`,
  ].join('\n');
};
