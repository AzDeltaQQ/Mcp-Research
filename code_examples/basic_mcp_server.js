#!/usr/bin/env node

/**
 * Basic MCP Server for Cursor AI
 * 
 * This example demonstrates a simple MCP server implementation that can be integrated with Cursor AI.
 * It provides basic tools for text manipulation and calculation.
 */

// Import required modules from the MCP SDK
const { Server } = require("@modelcontextprotocol/sdk/server/index.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");

// Create a new server with stdio transport
const transport = new StdioServerTransport();
const server = new Server({ transport });

// Define our resource namespace
const RESOURCE_NAMESPACE = "cursor://tools";

// Register text manipulation tools
server.registerTool({
  name: `${RESOURCE_NAMESPACE}/text_analyze`,
  description: "Analyze text and provide statistics like word count, character count, etc.",
  parameters: {
    type: "object",
    properties: {
      text: {
        type: "string",
        description: "The text to analyze"
      }
    },
    required: ["text"]
  },
  handler: async (params) => {
    const { text } = params;
    
    // Simple text analysis
    const charCount = text.length;
    const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
    const lineCount = text.split('\n').length;
    const sentenceCount = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0).length;
    
    return {
      characterCount: charCount,
      wordCount: wordCount,
      lineCount: lineCount,
      sentenceCount: sentenceCount,
      averageWordLength: charCount / wordCount
    };
  }
});

// Register calculation tool
server.registerTool({
  name: `${RESOURCE_NAMESPACE}/calculate`,
  description: "Perform mathematical calculations",
  parameters: {
    type: "object",
    properties: {
      expression: {
        type: "string",
        description: "Mathematical expression to evaluate (e.g., '2 + 2 * 3')"
      }
    },
    required: ["expression"]
  },
  handler: async (params) => {
    const { expression } = params;
    
    try {
      // SECURITY WARNING: In a production environment, you should use a safer
      // method to evaluate mathematical expressions, as eval() can execute arbitrary code
      // This is just for demonstration purposes
      const result = eval(expression);
      return {
        expression: expression,
        result: result
      };
    } catch (error) {
      throw new Error(`Failed to evaluate expression: ${error.message}`);
    }
  }
});

// Register code formatting tool
server.registerTool({
  name: `${RESOURCE_NAMESPACE}/format_code`,
  description: "Format code with proper indentation",
  parameters: {
    type: "object",
    properties: {
      code: {
        type: "string",
        description: "Code to format"
      },
      language: {
        type: "string",
        description: "Programming language (e.g., 'javascript', 'python')"
      }
    },
    required: ["code", "language"]
  },
  handler: async (params) => {
    const { code, language } = params;
    
    // This is a simplified formatter that just adds consistent indentation
    // In a real implementation, you would use a proper formatter for each language
    
    let formattedCode = code;
    
    // Simple indentation for demonstration purposes
    if (language.toLowerCase() === 'javascript' || language.toLowerCase() === 'python') {
      const lines = code.split('\n');
      let indentLevel = 0;
      
      formattedCode = lines.map(line => {
        // Adjust indent level based on brackets/braces
        const trimmedLine = line.trim();
        
        // Check for closing brackets/braces at the beginning
        if (trimmedLine.startsWith('}') || trimmedLine.startsWith(')') || 
            (language.toLowerCase() === 'python' && trimmedLine.startsWith('elif ')) ||
            (language.toLowerCase() === 'python' && trimmedLine.startsWith('else:')) ||
            (language.toLowerCase() === 'python' && trimmedLine.startsWith('except:'))) {
          indentLevel = Math.max(0, indentLevel - 1);
        }
        
        // Add indentation
        const indentedLine = ' '.repeat(indentLevel * 2) + trimmedLine;
        
        // Check for opening brackets/braces at the end
        if (trimmedLine.endsWith('{') || trimmedLine.endsWith(':') || 
            (trimmedLine.includes('{') && !trimmedLine.includes('}')) ||
            (trimmedLine.includes('(') && !trimmedLine.includes(')'))) {
          indentLevel += 1;
        }
        
        return indentedLine;
      }).join('\n');
    }
    
    return {
      formattedCode: formattedCode,
      language: language
    };
  }
});

// Start the server
async function main() {
  try {
    await server.start();
    console.error("MCP Server started successfully");
  } catch (error) {
    console.error("Failed to start MCP server:", error);
    process.exit(1);
  }
}

main();
