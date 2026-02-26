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

// 关键函数用途：生成用于 AI 设计 Policy 的提示词，并复用页面内容提取结果作为上下文。
export const buildPolicyDesignPrompt = ({ t, lang, customConfig }: BuildPolicyDesignPromptParams) => {
  // 核心逻辑说明：通过页面内容抽取拼装上下文，避免重复实现解析逻辑。
  const { extractedContent } = extractPageContent('policy', t, lang, customConfig);

  // 边界条件：当上下文缺失时（如“未找到”），提示 AI 视为空并保守推断。
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
