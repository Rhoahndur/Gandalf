import type { Language } from '@/types/language';
import type { HintLevel } from '@/types/hints';
import type { DifficultyLevel } from '@/types/difficulty';

/**
 * Hint level descriptions for each language
 */
const HINT_INSTRUCTIONS: Record<Language, Record<HintLevel, string>> = {
  en: {
    0: 'Generate a gentle nudge question that helps the student think about what they already know. Ask about foundational concepts. Do NOT give any specific methods or answers.',
    1: 'Suggest a general direction or approach without revealing the specific method. Guide them toward the right type of thinking.',
    2: 'Suggest a specific mathematical method, property, or formula that applies to this problem. Still ask questions rather than giving steps.',
    3: 'Show the very first step they should take, but don\'t complete it. Leave the rest for them to figure out.',
    4: 'Provide a fully worked similar example problem with complete step-by-step explanation and reasoning.',
  },
  es: {
    0: 'Genere una pregunta de empujón suave que ayude al estudiante a pensar en lo que ya sabe. Pregunte sobre conceptos fundamentales. NO dé ningún método o respuesta específica.',
    1: 'Sugiera una dirección o enfoque general sin revelar el método específico. Guíelos hacia el tipo correcto de pensamiento.',
    2: 'Sugiera un método matemático específico, propiedad o fórmula que se aplique a este problema. Siga haciendo preguntas en lugar de dar pasos.',
    3: 'Muestre el primer paso que deben tomar, pero no lo complete. Deje el resto para que lo descubran.',
    4: 'Proporcione un problema de ejemplo similar completamente trabajado con explicación completa paso a paso y razonamiento.',
  },
  fr: {
    0: 'Générez une question d\'encouragement douce qui aide l\'étudiant à réfléchir à ce qu\'il sait déjà. Posez des questions sur les concepts fondamentaux. NE donnez PAS de méthodes ou de réponses spécifiques.',
    1: 'Suggérez une direction ou une approche générale sans révéler la méthode spécifique. Guidez-les vers le bon type de réflexion.',
    2: 'Suggérez une méthode mathématique spécifique, une propriété ou une formule qui s\'applique à ce problème. Continuez à poser des questions plutôt que de donner des étapes.',
    3: 'Montrez la toute première étape qu\'ils devraient entreprendre, mais ne la complétez pas. Laissez le reste à découvrir.',
    4: 'Fournissez un exemple de problème similaire entièrement résolu avec une explication complète étape par étape et un raisonnement.',
  },
  de: {
    0: 'Generieren Sie eine sanfte Anregungsfrage, die dem Schüler hilft, darüber nachzudenken, was er bereits weiß. Fragen Sie nach grundlegenden Konzepten. Geben Sie KEINE spezifischen Methoden oder Antworten.',
    1: 'Schlagen Sie eine allgemeine Richtung oder einen Ansatz vor, ohne die spezifische Methode zu verraten. Führen Sie sie zur richtigen Art des Denkens.',
    2: 'Schlagen Sie eine spezifische mathematische Methode, Eigenschaft oder Formel vor, die auf dieses Problem zutrifft. Stellen Sie weiterhin Fragen, anstatt Schritte zu geben.',
    3: 'Zeigen Sie den allerersten Schritt, den sie unternehmen sollten, aber vervollständigen Sie ihn nicht. Lassen Sie den Rest für sie zum Herausfinden.',
    4: 'Geben Sie ein vollständig durchgearbeitetes ähnliches Beispielproblem mit vollständiger schrittweiser Erklärung und Begründung.',
  },
  zh: {
    0: '生成一个温和的提示问题，帮助学生思考他们已经知道的内容。询问基础概念。不要给出任何具体的方法或答案。',
    1: '建议一个总体方向或方法，但不透露具体方法。引导他们朝正确的思维方式发展。',
    2: '建议适用于此问题的特定数学方法、性质或公式。仍然要问问题而不是给出步骤。',
    3: '展示他们应该采取的第一步，但不要完成它。让他们自己弄清楚其余部分。',
    4: '提供一个完全解决的类似示例问题，包含完整的逐步解释和推理。',
  },
  ja: {
    0: '生徒が既に知っていることを考えるのに役立つ優しい促しの質問を生成します。基本的な概念について質問してください。特定の方法や答えを与えないでください。',
    1: '特定の方法を明かさずに、一般的な方向性やアプローチを提案してください。正しい考え方の種類に向けて導いてください。',
    2: 'この問題に適用される特定の数学的方法、性質、または公式を提案してください。ステップを与えるのではなく、質問を続けてください。',
    3: '彼らが取るべき最初のステップを示しますが、それを完成させないでください。残りは彼らに任せてください。',
    4: '完全な段階的説明と推論を含む、完全に解決された類似の例題を提供してください。',
  },
};

/**
 * Difficulty-specific guidance for each language
 */
const DIFFICULTY_GUIDANCE: Record<Language, Record<DifficultyLevel, string>> = {
  en: {
    'elementary': 'Use very simple language appropriate for grades K-5. Use concrete examples like counting objects or simple shapes.',
    'middle-school': 'Use clear language appropriate for grades 6-8. Balance formal math terms with accessibility.',
    'high-school': 'Use standard mathematical terminology appropriate for grades 9-12. Assume familiarity with algebra and geometry.',
    'college': 'Use precise mathematical language appropriate for university level. Reference theorems and formal definitions.',
  },
  es: {
    'elementary': 'Use un lenguaje muy simple apropiado para los grados K-5. Use ejemplos concretos como contar objetos o formas simples.',
    'middle-school': 'Use un lenguaje claro apropiado para los grados 6-8. Equilibre los términos matemáticos formales con la accesibilidad.',
    'high-school': 'Use terminología matemática estándar apropiada para los grados 9-12. Asuma familiaridad con álgebra y geometría.',
    'college': 'Use un lenguaje matemático preciso apropiado para el nivel universitario. Referencie teoremas y definiciones formales.',
  },
  fr: {
    'elementary': 'Utilisez un langage très simple approprié pour les classes K-5. Utilisez des exemples concrets comme compter des objets ou des formes simples.',
    'middle-school': 'Utilisez un langage clair approprié pour les classes 6-8. Équilibrez les termes mathématiques formels avec l\'accessibilité.',
    'high-school': 'Utilisez une terminologie mathématique standard appropriée pour les classes 9-12. Présumez une familiarité avec l\'algèbre et la géométrie.',
    'college': 'Utilisez un langage mathématique précis approprié pour le niveau universitaire. Référencez des théorèmes et des définitions formelles.',
  },
  de: {
    'elementary': 'Verwenden Sie sehr einfache Sprache, die für die Klassen K-5 geeignet ist. Verwenden Sie konkrete Beispiele wie das Zählen von Objekten oder einfachen Formen.',
    'middle-school': 'Verwenden Sie klare Sprache, die für die Klassen 6-8 geeignet ist. Balancieren Sie formale mathematische Begriffe mit Zugänglichkeit.',
    'high-school': 'Verwenden Sie standardmäßige mathematische Terminologie, die für die Klassen 9-12 geeignet ist. Gehen Sie von Vertrautheit mit Algebra und Geometrie aus.',
    'college': 'Verwenden Sie präzise mathematische Sprache, die für das Universitätsniveau geeignet ist. Verweisen Sie auf Theoreme und formale Definitionen.',
  },
  zh: {
    'elementary': '使用适合幼儿园到5年级的非常简单的语言。使用具体的例子，如数物体或简单的形状。',
    'middle-school': '使用适合6-8年级的清晰语言。平衡正式的数学术语和可理解性。',
    'high-school': '使用适合9-12年级的标准数学术语。假设熟悉代数和几何。',
    'college': '使用适合大学水平的精确数学语言。引用定理和正式定义。',
  },
  ja: {
    'elementary': '幼稚園から5年生に適した非常に簡単な言葉を使用してください。物を数えたり、簡単な形などの具体的な例を使用してください。',
    'middle-school': '6-8年生に適した明確な言葉を使用してください。正式な数学用語と理解しやすさのバランスをとってください。',
    'high-school': '9-12年生に適した標準的な数学用語を使用してください。代数と幾何学に精通していると仮定してください。',
    'college': '大学レベルに適した正確な数学的言語を使用してください。定理と正式な定義を参照してください。',
  },
};

/**
 * Language-specific instruction headers
 */
const INSTRUCTION_HEADERS: Record<Language, {
  hintLevel: string;
  difficulty: string;
  language: string;
  problem: string;
  context: string;
  important: string;
  provide: string;
}> = {
  en: {
    hintLevel: 'HINT LEVEL',
    difficulty: 'DIFFICULTY LEVEL',
    language: 'RESPOND IN',
    problem: 'STUDENT\'S CURRENT PROBLEM',
    context: 'CONVERSATION CONTEXT',
    important: 'IMPORTANT',
    provide: 'Now provide hint level',
  },
  es: {
    hintLevel: 'NIVEL DE PISTA',
    difficulty: 'NIVEL DE DIFICULTAD',
    language: 'RESPONDER EN',
    problem: 'PROBLEMA ACTUAL DEL ESTUDIANTE',
    context: 'CONTEXTO DE LA CONVERSACIÓN',
    important: 'IMPORTANTE',
    provide: 'Ahora proporcione el nivel de pista',
  },
  fr: {
    hintLevel: 'NIVEAU D\'INDICE',
    difficulty: 'NIVEAU DE DIFFICULTÉ',
    language: 'RÉPONDRE EN',
    problem: 'PROBLÈME ACTUEL DE L\'ÉTUDIANT',
    context: 'CONTEXTE DE CONVERSATION',
    important: 'IMPORTANT',
    provide: 'Maintenant, fournissez le niveau d\'indice',
  },
  de: {
    hintLevel: 'HINWEISSTUFE',
    difficulty: 'SCHWIERIGKEITSSTUFE',
    language: 'ANTWORTEN IN',
    problem: 'AKTUELLES PROBLEM DES SCHÜLERS',
    context: 'GESPRÄCHSKONTEXT',
    important: 'WICHTIG',
    provide: 'Geben Sie jetzt die Hinweisstufe',
  },
  zh: {
    hintLevel: '提示级别',
    difficulty: '难度级别',
    language: '回复语言',
    problem: '学生当前问题',
    context: '对话上下文',
    important: '重要',
    provide: '现在提供提示级别',
  },
  ja: {
    hintLevel: 'ヒントレベル',
    difficulty: '難易度レベル',
    language: '応答言語',
    problem: '生徒の現在の問題',
    context: '会話コンテキスト',
    important: '重要',
    provide: 'ヒントレベルを提供してください',
  },
};

/**
 * Language-specific important notes
 */
const IMPORTANT_NOTES: Record<Language, string[]> = {
  en: [
    'Stay in character for hint level {level}',
    'Use the Socratic method (guide through questions)',
    'Format math with LaTeX: $x^2$ or $$\\frac{a}{b}$$',
    'Be encouraging and supportive',
    'Match the difficulty level to the student\'s grade',
  ],
  es: [
    'Manténgase en el personaje para el nivel de pista {level}',
    'Use el método socrático (guíe a través de preguntas)',
    'Formatee las matemáticas con LaTeX: $x^2$ o $$\\frac{a}{b}$$',
    'Sea alentador y solidario',
    'Adapte el nivel de dificultad al grado del estudiante',
  ],
  fr: [
    'Restez dans le personnage pour le niveau d\'indice {level}',
    'Utilisez la méthode socratique (guidez par des questions)',
    'Formatez les mathématiques avec LaTeX: $x^2$ ou $$\\frac{a}{b}$$',
    'Soyez encourageant et solidaire',
    'Adaptez le niveau de difficulté au niveau scolaire de l\'étudiant',
  ],
  de: [
    'Bleiben Sie im Charakter für Hinweisstufe {level}',
    'Verwenden Sie die sokratische Methode (führen Sie durch Fragen)',
    'Formatieren Sie Mathematik mit LaTeX: $x^2$ oder $$\\frac{a}{b}$$',
    'Seien Sie ermutigend und unterstützend',
    'Passen Sie das Schwierigkeitsniveau an die Klassenstufe des Schülers an',
  ],
  zh: [
    '保持提示级别{level}的角色',
    '使用苏格拉底方法（通过问题引导）',
    '使用LaTeX格式化数学：$x^2$ 或 $$\\frac{a}{b}$$',
    '要鼓励和支持',
    '将难度级别与学生的年级相匹配',
  ],
  ja: [
    'ヒントレベル{level}のキャラクターを維持してください',
    'ソクラテス式方法を使用してください（質問を通じて導く）',
    'LaTeXで数学をフォーマットしてください：$x^2$ または $$\\frac{a}{b}$$',
    '励まし、サポートしてください',
    '難易度レベルを生徒の学年に合わせてください',
  ],
};

/**
 * Generate hint system prompt for AI
 * @param language - Target language for the hint
 * @param level - Hint level (0-4)
 * @param difficulty - Student difficulty level
 * @param problem - Current problem text
 * @param context - Recent conversation context
 * @returns Formatted system prompt
 */
export function getHintSystemPrompt(
  language: Language,
  level: HintLevel,
  difficulty: DifficultyLevel,
  problem: string,
  context: string[]
): string {
  const headers = INSTRUCTION_HEADERS[language];
  const hintInstruction = HINT_INSTRUCTIONS[language][level];
  const difficultyGuidance = DIFFICULTY_GUIDANCE[language][difficulty];
  const notes = IMPORTANT_NOTES[language];

  // Get last 5 context messages for brevity
  const recentContext = context.slice(-5);
  const contextText = recentContext.length > 0
    ? recentContext.join('\n')
    : `(${language === 'en' ? 'No previous context' :
         language === 'es' ? 'Sin contexto previo' :
         language === 'fr' ? 'Aucun contexte précédent' :
         language === 'de' ? 'Kein vorheriger Kontext' :
         language === 'zh' ? '无先前上下文' :
         '以前のコンテキストはありません'})`;

  return `You are providing hint level ${level} (0=gentlest, 4=most direct) for a math problem.

${headers.hintLevel} ${level} INSTRUCTIONS:
${hintInstruction}

${headers.difficulty}: ${difficulty}
${difficultyGuidance}

${headers.language}: ${language}

${headers.problem}:
${problem}

${headers.context}:
${contextText}

${headers.important}:
${notes.map(note => `- ${note.replace('{level}', level.toString())}`).join('\n')}

${headers.provide} ${level}:`;
}
