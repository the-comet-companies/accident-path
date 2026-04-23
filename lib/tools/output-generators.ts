import type { ToolAnswers, ToolOutput } from '@/types/tool'

type OutputGenerator = (answers: ToolAnswers) => ToolOutput

export const outputGenerators: Record<string, OutputGenerator> = {}
