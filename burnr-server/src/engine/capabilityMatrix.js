 
const capabilityMatrix = {

    "Cursor": {
      coding: {
        fit: "Perfect",
        score: 25,
        reason: "Purpose-built code editor with codebase context, tab completion, and agent mode for multi-file edits.",
      },
      writing: {
        fit: "Poor",
        score: 2,
        reason: "Cursor is a code editor with no writing interface — paying for it to write emails wastes every feature you're billed for.",
      },
      research: {
        fit: "Poor",
        score: 2,
        reason: "Cursor has no document handling, web search, or long-form reasoning interface needed for research workflows.",
      },
      customer_support: {
        fit: "Poor",
        score: 2,
        reason: "Cursor is a coding tool — it has no features relevant to drafting or managing customer support responses.",
      },
      data: {
        fit: "Partial",
        score: 10,
        reason: "Cursor can write data scripts and SQL but has no data analysis or visualisation interface.",
      },
      mixed: {
        fit: "Partial",
        score: 10,
        reason: "Cursor covers the coding portion of a mixed workflow well but adds no value for writing or research tasks.",
      },
    },
   
    "ChatGPT": {
      coding: {
        fit: "Good",
        score: 16,
        reason: "ChatGPT handles code explanation and generation well but lacks IDE integration and codebase context.",
      },
      writing: {
        fit: "Perfect",
        score: 24,
        reason: "ChatGPT excels at emails, docs, blog posts, and content — one of the strongest writing tools available.",
      },
      research: {
        fit: "Good",
        score: 17,
        reason: "GPT-4o handles research and synthesis well with web browsing, but Claude Sonnet edges it on deep reasoning.",
      },
      customer_support: {
        fit: "Perfect",
        score: 23,
        reason: "ChatGPT drafts support responses accurately and consistently — a natural fit for customer-facing text.",
      },
      data: {
        fit: "Good",
        score: 16,
        reason: "Advanced data analysis mode handles CSV uploads and Python execution well for most data tasks.",
      },
      mixed: {
        fit: "Perfect",
        score: 22,
        reason: "ChatGPT is the strongest generalist tool — covers writing, research, coding, and data in one interface.",
      },
    },
   

    "Claude": {
      coding: {
        fit: "Perfect",
        score: 22,
        reason: "Claude Sonnet scores top marks on coding benchmarks and handles large codebases with 200K context.",
      },
      writing: {
        fit: "Perfect",
        score: 25,
        reason: "Claude produces the most natural, nuanced writing of any model — ideal for long-form content and documentation.",
      },
      research: {
        fit: "Perfect",
        score: 25,
        reason: "Claude's 200K context window and deep reasoning make it the strongest tool for research and document analysis.",
      },
      customer_support: {
        fit: "Good",
        score: 18,
        reason: "Claude writes excellent support responses but ChatGPT or GPT-4o-mini offer lower-cost alternatives for this use case.",
      },
      data: {
        fit: "Good",
        score: 16,
        reason: "Claude handles data interpretation and analysis well but lacks native code execution for data workflows.",
      },
      mixed: {
        fit: "Perfect",
        score: 23,
        reason: "Claude is the best all-rounder for teams that mix writing, research, and coding in one tool.",
      },
    },
   
    "GitHub Copilot": {
      coding: {
        fit: "Perfect",
        score: 24,
        reason: "GitHub Copilot is purpose-built for IDE-native code completion and works in VS Code, JetBrains, Neovim, and more.",
      },
      writing: {
        fit: "Poor",
        score: 2,
        reason: "GitHub Copilot is an IDE tool — it has no interface or capability for writing emails, docs, or content.",
      },
      research: {
        fit: "Poor",
        score: 2,
        reason: "Copilot has no research interface, web access, or document handling outside of a code context.",
      },
      customer_support: {
        fit: "Poor",
        score: 2,
        reason: "Copilot is a developer tool — entirely unsuitable for customer support drafting or ticket management.",
      },
      data: {
        fit: "Partial",
        score: 10,
        reason: "Copilot can suggest data scripts inside an IDE but has no data analysis or visualisation features.",
      },
      mixed: {
        fit: "Partial",
        score: 8,
        reason: "Copilot only covers the coding slice of a mixed workflow — you will need separate tools for everything else.",
      },
    },
   
    
    "Gemini": {
      coding: {
        fit: "Good",
        score: 15,
        reason: "Gemini Pro handles code well but lacks the IDE-native integration that Cursor or Copilot provide.",
      },
      writing: {
        fit: "Good",
        score: 16,
        reason: "Gemini writes competently but ChatGPT and Claude consistently outperform it on nuanced writing tasks.",
      },
      research: {
        fit: "Perfect",
        score: 24,
        reason: "Gemini's 1M token context window makes it the best tool for processing large documents and deep research.",
      },
      customer_support: {
        fit: "Good",
        score: 15,
        reason: "Gemini drafts support responses adequately but GPT-4o-mini is cheaper for high-volume support use cases.",
      },
      data: {
        fit: "Perfect",
        score: 23,
        reason: "Gemini integrates natively with Google Sheets, BigQuery, and Workspace — the best choice for data-heavy teams.",
      },
      mixed: {
        fit: "Good",
        score: 17,
        reason: "Gemini covers research and data excellently and writing adequately — strong for Google Workspace teams.",
      },
    },
   
    "Windsurf": {
      coding: {
        fit: "Perfect",
        score: 23,
        reason: "Windsurf is purpose-built for coding with Cascade agent flows, codebase awareness, and VS Code compatibility.",
      },
      writing: {
        fit: "Poor",
        score: 2,
        reason: "Windsurf is a code editor with no writing interface — it adds zero value for writing tasks.",
      },
      research: {
        fit: "Poor",
        score: 2,
        reason: "Windsurf has no research interface, document handling, or web access outside of a coding context.",
      },
      customer_support: {
        fit: "Poor",
        score: 2,
        reason: "Windsurf is a developer coding tool — entirely wrong for customer support workflows.",
      },
      data: {
        fit: "Partial",
        score: 9,
        reason: "Windsurf can write data scripts in an IDE but has no data analysis or visualisation capability.",
      },
      mixed: {
        fit: "Partial",
        score: 9,
        reason: "Windsurf only serves the coding portion of a mixed workflow — you need separate tools for the rest.",
      },
    },
   
    "OpenAI API": {
      coding: {
        fit: "Perfect",
        score: 25,
        reason: "GPT-4o and o1 via API give full programmatic control for coding tools, agents, and automation.",
      },
      writing: {
        fit: "Perfect",
        score: 25,
        reason: "GPT-4o via API is the industry standard for writing automation, content pipelines, and document generation.",
      },
      research: {
        fit: "Good",
        score: 18,
        reason: "OpenAI API handles research tasks well but lacks built-in document upload compared to chat interfaces.",
      },
      customer_support: {
        fit: "Perfect",
        score: 25,
        reason: "GPT-4o-mini via API is the most cost-effective model for high-volume customer support automation.",
      },
      data: {
        fit: "Perfect",
        score: 24,
        reason: "OpenAI API with function calling is ideal for structured data extraction, classification, and transformation.",
      },
      mixed: {
        fit: "Perfect",
        score: 25,
        reason: "Direct API access covers every use case programmatically — the most flexible option for any workflow.",
      },
    },
   
    "Anthropic API": {
      coding: {
        fit: "Perfect",
        score: 24,
        reason: "Claude Sonnet & Opus via API ranks top on coding benchmarks — ideal for code generation and review pipelines.",
      },
      writing: {
        fit: "Perfect",
        score: 25,
        reason: "Claude via API produces the highest quality long-form writing of any model — best for content pipelines.",
      },
      research: {
        fit: "Perfect",
        score: 25,
        reason: "Claude's 200K context and deep reasoning make Anthropic API the best choice for research automation.",
      },
      customer_support: {
        fit: "Good",
        score: 18,
        reason: "Claude Haiku via API handles support tasks well — but GPT-4o-mini is cheaper for high-volume support.",
      },
      data: {
        fit: "Good",
        score: 17,
        reason: "Claude handles data analysis and extraction well via API but OpenAI edges it on structured output reliability.",
      },
      mixed: {
        fit: "Perfect",
        score: 24,
        reason: "Anthropic API covers all use cases with high quality — best choice for teams building on Claude models.",
      },
    },
   
  };

  const getUsecaseFit = (toolname, useCase) => {
    const tool = capabilityMatrix[toolname];
    if (!tool) {
        return { fit: "Poor", score: 0, reason: "This tool is not yet in our capability database." };
    };
    const useCaseFit = tool[useCase];
    if(!useCaseFit){
        return {
            fit: "Poor", score: 0, reason: "This use case is not supported for the selected tool."
        };
        
    }
    return useCaseFit;
  }

  module.exports = [capabilityMatrix , getUsecaseFit];