import { AzureChatOpenAI } from "@langchain/openai";

// Access environment variables
const AZURE_OPENAI_BASE_PATH = import.meta.env.VITE_AZURE_OPENAI_BASE_PATH;

export const getAzureOpenAIModel = (modelName: string = 'gpt-4o-mini') => {
  const model = new AzureChatOpenAI({
    azureOpenAIEndpoint: AZURE_OPENAI_BASE_PATH || '',
    apiKey: import.meta.env.VITE_AZURE_OPENAI_API_KEY || '',
    azureOpenAIApiDeploymentName:
      import.meta.env.VITE_AZURE_OPENAI_API_DEPLOYMENT_NAME || '',
    azureOpenAIApiVersion: import.meta.env.VITE_AZURE_OPENAI_API_VERSION || '',
    azureOpenAIApiInstanceName: import.meta.env
      .VITE_AZURE_OPENAI_API_INSTANCE_NAME,
    temperature: 0,
    model: modelName,
  });

  return model;
}; 