import { ChatOllama } from '@langchain/community/chat_models/ollama'
import { ChatOpenAI } from '@langchain/openai'

type AIModel = 'ollama' | 'openai'

const getAIModel = (model: AIModel = 'ollama') => {
  switch (model) {
    case 'ollama':
      return new ChatOllama({
        baseUrl: 'http://localhost:11434',
        model: 'llama3',
        mirostatEta: 0.3,
      })
    case 'openai':
      return new ChatOpenAI({
        modelName: 'gpt-3.5-turbo-16k',
      })
  }
}

export { getAIModel, AIModel }
