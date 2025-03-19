# Comprehensive Report: MCP Servers for Cursor AI

## Executive Summary

This report provides a comprehensive guide to implementing Model Context Protocol (MCP) servers specifically for Cursor AI integration. The Model Context Protocol is a standardized communication protocol that allows AI models like Claude to interact with external tools and data sources. This research focuses on how to create MCP servers that can be integrated with Cursor AI, enhancing its capabilities through custom tools and services.

The report covers the fundamentals of the MCP protocol, Claude's implementation, Cursor AI's specific requirements, technical specifications for MCP servers, step-by-step implementation guides, and practical code examples. This information is intended to provide developers with the knowledge and resources needed to create effective MCP servers for Cursor AI.

## Table of Contents

1. [Introduction to Model Context Protocol](#introduction-to-model-context-protocol)
2. [Claude's MCP Implementation](#claudes-mcp-implementation)
3. [Cursor AI Specifics](#cursor-ai-specifics)
4. [MCP Server Requirements](#mcp-server-requirements)
5. [Implementation Steps](#implementation-steps)
6. [Code Examples](#code-examples)
7. [Best Practices](#best-practices)
8. [Potential Challenges](#potential-challenges)
9. [Conclusion](#conclusion)

## Introduction to Model Context Protocol

### Core Concepts

The Model Context Protocol (MCP) is a standardized communication protocol that enables AI models to interact with external tools and data sources. It provides a structured way for AI assistants to access capabilities beyond their training data, allowing them to perform actions like retrieving information, manipulating files, or calling external APIs.

Key concepts of MCP include:

1. **JSON-RPC 2.0 Foundation**: MCP is built on the JSON-RPC 2.0 specification, providing a lightweight, transport-agnostic method for inter-process communication.

2. **Bidirectional Communication**: MCP enables two-way communication between AI models and external tools, allowing for request-response patterns and asynchronous notifications.

3. **Tool Registration and Discovery**: Tools register their capabilities with the protocol, allowing AI models to discover and utilize available functionality.

4. **Structured Parameters and Results**: Tools define their input parameters and result formats using JSON Schema, ensuring type safety and validation.

5. **Resource Namespaces**: Tools are organized into resource namespaces, providing logical grouping and preventing naming conflicts.

### Protocol Architecture

The MCP architecture consists of several key components:

1. **Transport Layer**: Handles the physical transmission of messages between the client (AI model) and server (tool provider). Common transports include:
   - **Stdio**: Uses standard input/output streams for communication
   - **SSE (Server-Sent Events)**: Uses HTTP for client-to-server messages and SSE for server-to-client messages

2. **Message Layer**: Defines the structure and format of messages exchanged between client and server, following JSON-RPC 2.0 conventions:
   - **Requests**: Messages from client to server requesting an action
   - **Responses**: Messages from server to client with results or errors
   - **Notifications**: One-way messages that don't require a response

3. **Tool Layer**: Defines the available tools, their parameters, and their behavior:
   - **Tool Definitions**: Metadata about tools, including name, description, and parameter schema
   - **Tool Handlers**: Functions that implement the tool's behavior
   - **Tool Results**: Structured data returned by tools

### Message Types

MCP uses several types of messages for communication:

1. **Initialization**: Establishes the connection and exchanges capabilities
2. **Tool Registration**: Defines available tools and their parameters
3. **Tool Execution**: Requests tool execution and returns results
4. **Error Handling**: Reports and manages error conditions
5. **Termination**: Gracefully ends the session

## Claude's MCP Implementation

### Claude Integration Overview

Claude implements MCP as a way to extend its capabilities beyond its training data. This allows Claude to interact with external tools and data sources, providing more accurate and up-to-date information to users.

Key aspects of Claude's MCP implementation include:

1. **Tool Use Framework**: Claude has a built-in framework for understanding when to use tools, how to format parameters, and how to interpret results.

2. **Natural Language Interface**: Users can request tool usage through natural language, and Claude determines when and how to use available tools.

3. **Permission Model**: Claude implements a permission system where users must approve tool usage before execution, ensuring transparency and control.

4. **Result Integration**: Claude can seamlessly integrate tool results into its responses, providing a cohesive user experience.

### Claude API Integration Points

Claude's API provides several integration points for MCP:

1. **Tool Registration**: Tools can be registered with Claude through the API, making them available for use in conversations.

2. **Tool Execution**: Claude can execute registered tools during conversations, with user approval.

3. **Message Handling**: Claude processes MCP messages according to the protocol specification, ensuring compatibility with standard MCP servers.

4. **Error Management**: Claude handles errors from MCP servers gracefully, providing informative messages to users.

### Claude-Specific Requirements

When implementing MCP servers for Claude, several requirements should be considered:

1. **Protocol Compliance**: Servers must strictly adhere to the MCP specification to ensure compatibility with Claude.

2. **Tool Documentation**: Tools should have clear descriptions and parameter documentation to help Claude understand when and how to use them.

3. **Error Handling**: Servers should provide informative error messages that Claude can relay to users.

4. **Performance Considerations**: Tools should respond quickly to maintain a smooth conversation flow.

5. **Security Boundaries**: Servers should implement appropriate security measures to prevent unauthorized access or actions.

## Cursor AI Specifics

### Cursor AI Architecture

Cursor AI is an intelligent code editor that integrates AI capabilities to assist with coding tasks. It supports the Model Context Protocol to extend its functionality through external servers.

Key components of Cursor AI's architecture include:

1. **Composer Feature**: Cursor's AI-powered coding assistant that integrates with MCP servers.

2. **MCP Configuration Interface**: A graphical interface for adding and managing MCP servers.

3. **Tool Discovery System**: Automatically discovers and lists tools provided by MCP servers.

4. **Permission System**: Requires user approval before executing MCP tool actions.

### Cursor AI MCP Integration

Cursor AI integrates with MCP servers through its Composer feature, allowing the AI to access external tools and data sources. The integration works as follows:

1. **Configuration Setup**: Cursor AI provides a dedicated MCP configuration section in its settings:
   - Navigate to Cursor Settings > Features > MCP
   - Click the "+ Add New MCP Server" button

2. **Server Definition**: Each MCP server is defined with:
   - Name: A nickname for the server
   - Type: The transport type (stdio or sse)
   - Command/URL: Either a shell command (for stdio) or URL endpoint (for SSE)

3. **Transport Options**:
   - **Stdio Server**: Uses standard input/output for communication
     - Example: `node ~/mcp-quickstart/weather-server-typescript/build/index.js`
   - **SSE Server**: Uses Server-Sent Events for server-to-client messages
     - Example: `http://example.com:8000/sse`

4. **Tool Discovery and Usage**:
   - After adding a server, it appears in the MCP servers list
   - Tools may need to be refreshed to populate in the tool list
   - The Composer Agent automatically uses MCP tools when relevant
   - Users can explicitly prompt tool usage by:
     - Referring to the tool by name
     - Describing the tool's function

5. **Tool Execution Process**:
   - Displays a message in chat requesting approval
   - Shows tool call arguments (expandable)
   - Executes the tool upon user approval
   - Displays the tool's response in the chat

### Cursor AI-Specific Requirements

1. **Integration Point**: Cursor AI integrates MCP through its Composer feature, which is its AI-powered coding assistant.

2. **Configuration Interface**: Cursor provides a graphical interface for adding and managing MCP servers.

3. **Transport Support**: Cursor supports both stdio and SSE transport mechanisms.

4. **Security Model**: Cursor implements a permission system where users must approve MCP server actions before execution.

5. **Tool Visibility**: Tools provided by MCP servers appear in Cursor's interface and can be invoked through natural language.

### MCP Server Ecosystem for Cursor

Cursor has a growing ecosystem of MCP servers available through platforms like:

1. **Smithery.ai**: A registry of MCP servers with installation instructions
   - Popular servers include Sequential Thinking, GitHub, and various database connectors

2. **Cursor Directory**: A collection of MCP servers specifically designed for Cursor
   - Includes servers for various services like Brave Search, PostgreSQL, Docker, etc.

## MCP Server Requirements

### Technical Requirements

#### 1. Transport Mechanisms

- **Stdio Transport**:
  - Most commonly used for local development with Cursor AI
  - Requires a command-line executable that can read from stdin and write to stdout
  - Must follow JSON-RPC 2.0 message format for communication
  - Example command: `node ~/path/to/server/index.js`

- **SSE Transport**:
  - Alternative for remote or web-based servers
  - Requires an HTTP endpoint that supports Server-Sent Events
  - Uses HTTP POST for client-to-server messages
  - Example URL: `http://example.com:8000/sse`

#### 2. Protocol Implementation

- Must implement the Model Context Protocol specification
- Must handle all required message types:
  - Requests (expecting responses)
  - Results (successful responses)
  - Errors (failed requests)
  - Notifications (one-way messages)
- Must support initialization handshake with Cursor AI
- Must properly register resources and tools

#### 3. Security Considerations

- Should implement appropriate security boundaries
- Should validate all inputs from the client
- Should restrict operations to authorized paths/resources
- Should provide clear information about tool capabilities for user approval

### Server Architecture

#### 1. Core Components

- **Transport Handler**:
  - Manages communication with Cursor AI
  - Parses incoming messages and formats outgoing messages
  - Implements either stdio or SSE transport

- **Protocol Handler**:
  - Processes JSON-RPC 2.0 messages
  - Maintains request/response mapping
  - Handles error conditions

- **Resource Manager**:
  - Defines available resources (e.g., `file://system`)
  - Registers tools associated with each resource
  - Provides tool metadata for discovery

- **Tool Implementations**:
  - Individual functions that perform specific tasks
  - Accept parameters and return results
  - Include proper error handling

#### 2. Message Flow

1. **Initialization**:
   - Server starts and waits for connection
   - Cursor AI connects and sends initialization message
   - Server responds with capabilities and available tools

2. **Tool Discovery**:
   - Cursor AI requests list of available tools
   - Server responds with tool definitions and metadata

3. **Tool Execution**:
   - Cursor AI sends tool execution request
   - Server validates request and executes tool
   - Server returns results or error

4. **Termination**:
   - Either party can send termination message
   - Server should clean up resources

### Dependencies and Prerequisites

#### 1. Development Environment

- **Node.js**: Most MCP servers for Cursor AI are built with Node.js
  - Minimum version: Node.js 14.x or higher
  - npm or yarn for package management

- **TypeScript** (recommended):
  - Provides type safety and better development experience
  - Requires compilation step before execution

#### 2. Required Libraries

- **MCP SDK**:
  - `@modelcontextprotocol/sdk` - Core MCP implementation
  - Provides server, client, and transport implementations

- **JSON-RPC Libraries**:
  - For parsing and formatting JSON-RPC 2.0 messages
  - Typically included in the MCP SDK

- **Domain-Specific Libraries**:
  - Depends on the functionality of your MCP server
  - Examples: file system access, database connectors, API clients

#### 3. Deployment Considerations

- **Local Development**:
  - Cursor AI can run MCP servers directly from local filesystem
  - Requires proper path configuration in Cursor settings

- **Containerization** (optional):
  - Docker for packaging and distribution
  - Simplifies dependency management
  - Requires proper volume mounting for file access

- **Distribution**:
  - npm package for easy installation
  - GitHub repository for source code access
  - Documentation for setup and usage

### Cursor AI-Specific Requirements

#### 1. Configuration Format

- Cursor AI expects a specific format in its MCP server configuration:
  - Name: Descriptive name for the server
  - Type: Transport type (stdio or sse)
  - Command/URL: Command line or URL endpoint

#### 2. Tool Discovery

- Tools must be properly registered to appear in Cursor's tool list
- Tool names should be descriptive and follow consistent naming conventions
- Tool descriptions should clearly explain functionality

#### 3. User Experience

- Tools should integrate naturally with Cursor's coding workflow
- Tool execution should provide clear feedback
- Error messages should be user-friendly and actionable

#### 4. Performance Considerations

- MCP servers should respond quickly to maintain a smooth user experience
- Long-running operations should provide progress updates
- Resource usage should be optimized for development environments

## Implementation Steps

### Step 1: Set Up Development Environment

#### Prerequisites Installation

1. **Install Node.js and npm**:
   ```bash
   # Using nvm (recommended)
   nvm install 16
   nvm use 16
   
   # Or download directly from nodejs.org
   ```

2. **Install TypeScript** (recommended):
   ```bash
   npm install -g typescript
   ```

3. **Create a new project directory**:
   ```bash
   mkdir my-cursor-mcp-server
   cd my-cursor-mcp-server
   ```

4. **Initialize npm project**:
   ```bash
   npm init -y
   ```

5. **Install MCP SDK and dependencies**:
   ```bash
   npm install @modelcontextprotocol/sdk
   npm install typescript ts-node @types/node --save-dev
   ```

6. **Create TypeScript configuration**:
   ```bash
   npx tsc --init
   ```

### Step 2: Define Server Structure

#### Create Basic Project Structure

1. **Set up directory structure**:
   ```bash
   mkdir -p src/tools
   touch src/index.ts
   touch src/tools/index.ts
   ```

2. **Configure TypeScript** (tsconfig.json):
   ```json
   {
     "compilerOptions": {
       "target": "ES2020",
       "module": "commonjs",
       "outDir": "./dist",
       "rootDir": "./src",
       "strict": true,
       "esModuleInterop": true,
       "skipLibCheck": true,
       "forceConsistentCasingInFileNames": true
     },
     "include": ["src/**/*"],
     "exclude": ["node_modules"]
   }
   ```

3. **Add build scripts** (package.json):
   ```json
   {
     "scripts": {
       "build": "tsc",
       "start": "node dist/index.js",
       "dev": "ts-node src/index.ts"
     }
   }
   ```

### Step 3: Implement Core Server Logic

#### Create Server Entry Point

1. **Implement the main server file** (src/index.ts):
   ```typescript
   #!/usr/bin/env node
   import { Server } from "@modelcontextprotocol/sdk/server/index.js";
   import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
   import { registerTools } from "./tools/index.js";
   
   async function main() {
     // Create server with stdio transport
     const transport = new StdioServerTransport();
     const server = new Server({ transport });
     
     // Register tools
     registerTools(server);
     
     // Start the server
     await server.start();
     
     console.error("MCP Server started");
   }
   
   main().catch((error) => {
     console.error("Error starting server:", error);
     process.exit(1);
   });
   ```

2. **Create tool registration module** (src/tools/index.ts):
   ```typescript
   import { Server } from "@modelcontextprotocol/sdk/server/index.js";
   
   export function registerTools(server: Server) {
     // Define your resource namespace
     const resourceName = "my-resource://tools";
     
     // Register tools under this resource
     server.registerTool({
       name: `${resourceName}/hello_world`,
       description: "A simple hello world tool",
       parameters: {
         type: "object",
         properties: {
           name: {
             type: "string",
             description: "Name to greet"
           }
         },
         required: ["name"]
       },
       handler: async (params) => {
         const { name } = params;
         return `Hello, ${name}!`;
       }
     });
     
     // Add more tools as needed
   }
   ```

### Step 4: Implement Custom Tools

#### Create Specialized Tools

1. **Create a dedicated file for each tool category**:
   ```bash
   touch src/tools/file-tools.ts
   touch src/tools/data-tools.ts
   ```

2. **Implement file operation tools** (src/tools/file-tools.ts):
   ```typescript
   import { Server } from "@modelcontextprotocol/sdk/server/index.js";
   import * as fs from "fs/promises";
   import * as path from "path";
   
   export function registerFileTools(server: Server) {
     const resourceName = "my-resource://file";
     
     // Tool to read file
     server.registerTool({
       name: `${resourceName}/read_file`,
       description: "Read content from a file",
       parameters: {
         type: "object",
         properties: {
           path: {
             type: "string",
             description: "Path to the file"
           }
         },
         required: ["path"]
       },
       handler: async (params) => {
         try {
           const content = await fs.readFile(params.path, "utf-8");
           return content;
         } catch (error) {
           throw new Error(`Failed to read file: ${error.message}`);
         }
       }
     });
     
     // Add more file tools (write, list, etc.)
   }
   ```

3. **Update tool registration** (src/tools/index.ts):
   ```typescript
   import { Server } from "@modelcontextprotocol/sdk/server/index.js";
   import { registerFileTools } from "./file-tools.js";
   
   export function registerTools(server: Server) {
     // Register all tool categories
     registerFileTools(server);
     
     // Register basic tools
     const resourceName = "my-resource://tools";
     
     server.registerTool({
       name: `${resourceName}/hello_world`,
       description: "A simple hello world tool",
       parameters: {
         type: "object",
         properties: {
           name: {
             type: "string",
             description: "Name to greet"
           }
         },
         required: ["name"]
       },
       handler: async (params) => {
         const { name } = params;
         return `Hello, ${name}!`;
       }
     });
   }
   ```

### Step 5: Add Error Handling and Validation

#### Implement Robust Error Handling

1. **Create error utilities** (src/utils/errors.ts):
   ```typescript
   export class ValidationError extends Error {
     constructor(message: string) {
       super(message);
       this.name = "ValidationError";
     }
   }
   
   export class PermissionError extends Error {
     constructor(message: string) {
       super(message);
       this.name = "PermissionError";
     }
   }
   
   export function handleToolError(error: any): string {
     if (error instanceof ValidationError) {
       return `Validation error: ${error.message}`;
     } else if (error instanceof PermissionError) {
       return `Permission denied: ${error.message}`;
     } else {
       return `Error: ${error.message || "Unknown error"}`;
     }
   }
   ```

2. **Use error handling in tools**:
   ```typescript
   import { ValidationError, handleToolError } from "../utils/errors.js";
   
   // In tool handler:
   try {
     // Tool implementation
   } catch (error) {
     throw handleToolError(error);
   }
   ```

### Step 6: Build and Test Locally

#### Prepare for Testing

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Make the entry point executable** (Unix/Linux/macOS):
   ```bash
   chmod +x dist/index.js
   ```

3. **Test the server manually**:
   ```bash
   # Start the server
   npm start
   
   # In another terminal, you can test with curl if using HTTP transport
   # For stdio, you'll need to pipe JSON-RPC messages
   ```

### Step 7: Configure with Cursor AI

#### Add Server to Cursor

1. **Open Cursor AI**

2. **Navigate to Settings**:
   - Go to Cursor Settings > Features > MCP

3. **Add New MCP Server**:
   - Click the "+ Add New MCP Server" button
   - Enter a name for your server
   - Select "stdio" as the transport type
   - Enter the command to run your server:
     ```
     node /path/to/your/project/dist/index.js
     ```
   - Click "Add"

4. **Verify Server Connection**:
   - The server should appear in your MCP servers list
   - You may need to click the refresh button to populate the tool list

### Step 8: Test with Cursor AI

#### Verify Integration

1. **Open Cursor's Composer**

2. **Test Tool Invocation**:
   - Type a prompt that would trigger your tool
   - For example: "Can you use the hello_world tool to greet John?"

3. **Verify Tool Execution**:
   - Cursor should display a message requesting approval
   - After approval, the tool should execute
   - The result should appear in the chat

### Step 9: Package for Distribution

#### Prepare for Sharing

1. **Update package.json**:
   ```json
   {
     "name": "my-cursor-mcp-server",
     "version": "1.0.0",
     "description": "Custom MCP server for Cursor AI",
     "main": "dist/index.js",
     "bin": {
       "my-cursor-mcp": "./dist/index.js"
     },
     "files": [
       "dist"
     ],
     "scripts": {
       "build": "tsc",
       "start": "node dist/index.js",
       "prepublishOnly": "npm run build"
     }
   }
   ```

2. **Create README.md**:
   - Document installation instructions
   - Explain available tools
   - Provide usage examples with Cursor AI

3. **Publish to npm** (optional):
   ```bash
   npm publish
   ```

4. **Share on GitHub**:
   - Create a repository
   - Push your code
   - Add installation and usage instructions

## Code Examples

### Basic MCP Server (JavaScript)

This example demonstrates a simple MCP server implementation in JavaScript that provides basic text manipulation and calculation tools:

```javascript
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
```

### Advanced MCP Server (TypeScript)

This example demonstrates a more advanced MCP server implementation in TypeScript that provides file system operations with security boundaries:

```typescript
// TypeScript MCP Server Example for Cursor AI
// This example demonstrates a more advanced MCP server implementation using TypeScript

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import * as fs from "fs/promises";
import * as path from "path";

// Define error classes for better error handling
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

class PermissionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PermissionError";
  }
}

// Define our resource namespace
const RESOURCE_NAMESPACE = "cursor://filesystem";

// Define allowed directories (for security)
const ALLOWED_DIRECTORIES: string[] = [];

// Process command line arguments to get allowed directories
process.argv.slice(2).forEach(dir => {
  const resolvedPath = path.resolve(dir);
  ALLOWED_DIRECTORIES.push(resolvedPath);
});

// Utility function to check if a path is within allowed directories
function isPathAllowed(filePath: string): boolean {
  const resolvedPath = path.resolve(filePath);
  return ALLOWED_DIRECTORIES.some(dir => resolvedPath.startsWith(dir));
}

// Main function to start the server
async function main() {
  // Create server with stdio transport
  const transport = new StdioServerTransport();
  const server = new Server({ transport });
  
  // Register file reading tool
  server.registerTool({
    name: `${RESOURCE_NAMESPACE}/read_file`,
    description: "Read content from a file",
    parameters: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "Path to the file"
        }
      },
      required: ["path"]
    },
    handler: async (params) => {
      const { path: filePath } = params;
      
      // Validate path
      if (!filePath) {
        throw new ValidationError("File path is required");
      }
      
      // Check if path is allowed
      if (!isPathAllowed(filePath)) {
        throw new PermissionError(`Access to path '${filePath}' is not allowed`);
      }
      
      try {
        // Read file content
        const content = await fs.readFile(filePath, "utf-8");
        return {
          path: filePath,
          content: content
        };
      } catch (error: any) {
        throw new Error(`Failed to read file: ${error.message}`);
      }
    }
  });
  
  // Register file writing tool
  server.registerTool({
    name: `${RESOURCE_NAMESPACE}/write_file`,
    description: "Write content to a file",
    parameters: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "Path to the file"
        },
        content: {
          type: "string",
          description: "Content to write"
        },
        append: {
          type: "boolean",
          description: "Whether to append to the file instead of overwriting",
          default: false
        }
      },
      required: ["path", "content"]
    },
    handler: async (params) => {
      const { path: filePath, content, append = false } = params;
      
      // Validate parameters
      if (!filePath) {
        throw new ValidationError("File path is required");
      }
      
      if (content === undefined) {
        throw new ValidationError("Content is required");
      }
      
      // Check if path is allowed
      if (!isPathAllowed(filePath)) {
        throw new PermissionError(`Access to path '${filePath}' is not allowed`);
      }
      
      try {
        // Create directory if it doesn't exist
        const directory = path.dirname(filePath);
        await fs.mkdir(directory, { recursive: true });
        
        // Write or append to file
        const flag = append ? "a" : "w";
        await fs.writeFile(filePath, content, { flag });
        
        return {
          path: filePath,
          operation: append ? "append" : "write",
          success: true
        };
      } catch (error: any) {
        throw new Error(`Failed to write file: ${error.message}`);
      }
    }
  });
  
  // Register directory listing tool
  server.registerTool({
    name: `${RESOURCE_NAMESPACE}/list_directory`,
    description: "List contents of a directory",
    parameters: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "Path to the directory"
        }
      },
      required: ["path"]
    },
    handler: async (params) => {
      const { path: dirPath } = params;
      
      // Validate path
      if (!dirPath) {
        throw new ValidationError("Directory path is required");
      }
      
      // Check if path is allowed
      if (!isPathAllowed(dirPath)) {
        throw new PermissionError(`Access to path '${dirPath}' is not allowed`);
      }
      
      try {
        // Read directory contents
        const entries = await fs.readdir(dirPath, { withFileTypes: true });
        
        // Format results
        const files = entries
          .filter(entry => entry.isFile())
          .map(entry => ({ name: entry.name, type: "file" }));
        
        const directories = entries
          .filter(entry => entry.isDirectory())
          .map(entry => ({ name: entry.name, type: "directory" }));
        
        return {
          path: dirPath,
          contents: [...directories, ...files]
        };
      } catch (error: any) {
        throw new Error(`Failed to list directory: ${error.message}`);
      }
    }
  });
  
  // Register file search tool
  server.registerTool({
    name: `${RESOURCE_NAMESPACE}/search_files`,
    description: "Search for files matching a pattern",
    parameters: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "Base directory to search in"
        },
        pattern: {
          type: "string",
          description: "Search pattern (glob syntax)"
        },
        recursive: {
          type: "boolean",
          description: "Whether to search recursively",
          default: true
        }
      },
      required: ["path", "pattern"]
    },
    handler: async (params) => {
      const { path: dirPath, pattern, recursive = true } = params;
      
      // Validate parameters
      if (!dirPath) {
        throw new ValidationError("Directory path is required");
      }
      
      if (!pattern) {
        throw new ValidationError("Search pattern is required");
      }
      
      // Check if path is allowed
      if (!isPathAllowed(dirPath)) {
        throw new PermissionError(`Access to path '${dirPath}' is not allowed`);
      }
      
      try {
        // Simple implementation of file search
        // In a real implementation, you would use a proper glob library
        const results: string[] = [];
        
        // Helper function for recursive search
        async function searchDirectory(dir: string) {
          const entries = await fs.readdir(dir, { withFileTypes: true });
          
          for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            
            if (entry.isFile() && entry.name.includes(pattern)) {
              results.push(fullPath);
            } else if (entry.isDirectory() && recursive) {
              await searchDirectory(fullPath);
            }
          }
        }
        
        await searchDirectory(dirPath);
        
        return {
          pattern: pattern,
          matches: results
        };
      } catch (error: any) {
        throw new Error(`Failed to search files: ${error.message}`);
      }
    }
  });
  
  // Register tool to list allowed directories
  server.registerTool({
    name: `${RESOURCE_NAMESPACE}/list_allowed_directories`,
    description: "List all directories the server is allowed to access",
    parameters: {
      type: "object",
      properties: {},
      required: []
    },
    handler: async () => {
      return {
        allowedDirectories: ALLOWED_DIRECTORIES
      };
    }
  });
  
  // Start the server
  try {
    await server.start();
    console.error("MCP Server started successfully");
    console.error(`Allowed directories: ${ALLOWED_DIRECTORIES.join(", ")}`);
  } catch (error: any) {
    console.error("Failed to start MCP server:", error);
    process.exit(1);
  }
}

// Run the server
main();
```

### API Integration Example (TypeScript)

This example demonstrates how to create an MCP server that integrates with an external API (OpenWeatherMap) to provide weather information:

```typescript
// Integration Example: MCP Server for Cursor AI with External API
// This example demonstrates how to create an MCP server that integrates with an external API

import axios from 'axios';
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// Define our resource namespace
const RESOURCE_NAMESPACE = "cursor://weather";

// Main function to start the server
async function main() {
  // Create server with stdio transport
  const transport = new StdioServerTransport();
  const server = new Server({ transport });
  
  // Register weather lookup tool
  server.registerTool({
    name: `${RESOURCE_NAMESPACE}/get_weather`,
    description: "Get current weather information for a location",
    parameters: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "City name or location (e.g., 'New York', 'London, UK')"
        },
        units: {
          type: "string",
          description: "Units for temperature (metric, imperial, or standard)",
          enum: ["metric", "imperial", "standard"],
          default: "metric"
        }
      },
      required: ["location"]
    },
    handler: async (params) => {
      const { location, units = "metric" } = params;
      
      // API key should be stored securely, e.g., in environment variables
      // For this example, we're using a placeholder
      const API_KEY = process.env.OPENWEATHER_API_KEY || "your_api_key_here";
      
      try {
        // Make API request to OpenWeatherMap
        const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
          params: {
            q: location,
            units: units,
            appid: API_KEY
          }
        });
        
        const data = response.data;
        
        // Format the response
        return {
          location: `${data.name}, ${data.sys.country}`,
          temperature: {
            current: data.main.temp,
            feelsLike: data.main.feels_like,
            min: data.main.temp_min,
            max: data.main.temp_max,
            unit: units === 'metric' ? '°C' : units === 'imperial' ? '°F' : 'K'
          },
          humidity: data.main.humidity,
          wind: {
            speed: data.wind.speed,
            unit: units === 'metric' ? 'm/s' : 'mph',
            direction: data.wind.deg
          },
          conditions: {
            main: data.weather[0].main,
            description: data.weather[0].description,
            icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
          },
          timestamp: new Date(data.dt * 1000).toISOString()
        };
      } catch (error) {
        // Handle API errors
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          throw new Error(`Weather API error: ${error.response.data.message || 'Unknown error'}`);
        } else if (error.request) {
          // The request was made but no response was received
          throw new Error('No response from weather service. Please check your internet connection.');
        } else {
          // Something happened in setting up the request that triggered an Error
          throw new Error(`Error fetching weather data: ${error.message}`);
        }
      }
    }
  });
  
  // Register forecast tool
  server.registerTool({
    name: `${RESOURCE_NAMESPACE}/get_forecast`,
    description: "Get 5-day weather forecast for a location",
    parameters: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "City name or location (e.g., 'New York', 'London, UK')"
        },
        units: {
          type: "string",
          description: "Units for temperature (metric, imperial, or standard)",
          enum: ["metric", "imperial", "standard"],
          default: "metric"
        },
        days: {
          type: "number",
          description: "Number of days to forecast (1-5)",
          minimum: 1,
          maximum: 5,
          default: 3
        }
      },
      required: ["location"]
    },
    handler: async (params) => {
      const { location, units = "metric", days = 3 } = params;
      
      // API key should be stored securely
      const API_KEY = process.env.OPENWEATHER_API_KEY || "your_api_key_here";
      
      try {
        // Make API request to OpenWeatherMap 5-day forecast
        const response = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
          params: {
            q: location,
            units: units,
            appid: API_KEY
          }
        });
        
        const data = response.data;
        
        // Process the forecast data
        // The API returns forecast in 3-hour steps, so we need to aggregate by day
        const forecastMap = new Map();
        
        // Group forecast data by day
        data.list.forEach(item => {
          const date = new Date(item.dt * 1000);
          const day = date.toISOString().split('T')[0]; // YYYY-MM-DD
          
          if (!forecastMap.has(day)) {
            forecastMap.set(day, {
              date: day,
              temperatures: [],
              conditions: [],
              humidity: [],
              wind: []
            });
          }
          
          const dayData = forecastMap.get(day);
          dayData.temperatures.push(item.main.temp);
          dayData.conditions.push(item.weather[0].main);
          dayData.humidity.push(item.main.humidity);
          dayData.wind.push(item.wind.speed);
        });
        
        // Convert map to array and sort by date
        const forecastArray = Array.from(forecastMap.values())
          .sort((a, b) => a.date.localeCompare(b.date))
          .slice(0, days); // Limit to requested number of days
        
        // Calculate daily averages and most common condition
        const forecast = forecastArray.map(day => {
          // Find most common weather condition
          const conditionCounts = day.conditions.reduce((acc, condition) => {
            acc[condition] = (acc[condition] || 0) + 1;
            return acc;
          }, {});
          
          const mostCommonCondition = Object.entries(conditionCounts)
            .sort((a, b) => b[1] - a[1])[0][0];
          
          // Calculate averages
          const avgTemp = day.temperatures.reduce((sum, temp) => sum + temp, 0) / day.temperatures.length;
          const avgHumidity = day.humidity.reduce((sum, hum) => sum + hum, 0) / day.humidity.length;
          const avgWind = day.wind.reduce((sum, wind) => sum + wind, 0) / day.wind.length;
          
          return {
            date: day.date,
            temperature: {
              average: Math.round(avgTemp * 10) / 10,
              unit: units === 'metric' ? '°C' : units === 'imperial' ? '°F' : 'K'
            },
            condition: mostCommonCondition,
            humidity: Math.round(avgHumidity),
            wind: {
              speed: Math.round(avgWind * 10) / 10,
              unit: units === 'metric' ? 'm/s' : 'mph'
            }
          };
        });
        
        return {
          location: `${data.city.name}, ${data.city.country}`,
          forecast: forecast
        };
      } catch (error) {
        // Handle API errors
        if (error.response) {
          throw new Error(`Weather API error: ${error.response.data.message || 'Unknown error'}`);
        } else if (error.request) {
          throw new Error('No response from weather service. Please check your internet connection.');
        } else {
          throw new Error(`Error fetching forecast data: ${error.message}`);
        }
      }
    }
  });
  
  // Start the server
  try {
    await server.start();
    console.error("Weather MCP Server started successfully");
  } catch (error) {
    console.error("Failed to start MCP server:", error);
    process.exit(1);
  }
}

// Run the server
main();
```

## Best Practices

### Tool Design

1. **Keep tools focused on single responsibilities**:
   - Each tool should do one thing well
   - Break complex operations into multiple tools
   - Use clear, descriptive names

2. **Provide detailed descriptions**:
   - Tool descriptions should clearly explain functionality
   - Parameter descriptions should specify expected values
   - Include examples in descriptions when helpful

3. **Validate all inputs**:
   - Check parameter types and values
   - Provide informative error messages
   - Handle edge cases gracefully

4. **Return structured results**:
   - Use consistent result formats
   - Include all relevant information
   - Format results for easy consumption

### Security

1. **Implement proper permission checks**:
   - Restrict file operations to safe directories
   - Validate and sanitize all inputs
   - Avoid executing arbitrary code
   - Use environment variables for sensitive information

2. **Error handling**:
   - Catch and handle all exceptions
   - Provide informative error messages
   - Don't expose sensitive information in errors
   - Log errors for debugging

3. **Resource limitations**:
   - Implement timeouts for long-running operations
   - Limit resource usage (memory, CPU)
   - Prevent denial-of-service attacks

### Performance

1. **Optimize for quick response times**:
   - Use async/await for I/O operations
   - Implement caching where appropriate
   - Minimize unnecessary processing

2. **Progress updates**:
   - Provide progress updates for long-running operations
   - Allow cancellation when possible
   - Use streaming for large data transfers

3. **Resource management**:
   - Clean up resources after use
   - Implement proper error handling
   - Use connection pooling for database operations

### User Experience

1. **Design tools that integrate naturally with coding workflows**:
   - Focus on common coding tasks
   - Provide tools that complement Cursor's features
   - Consider the context in which tools will be used

2. **Return formatted results**:
   - Use structured data for complex results
   - Format text for readability
   - Include relevant metadata

3. **Provide clear error messages**:
   - Explain what went wrong
   - Suggest possible solutions
   - Use consistent error formats

### Documentation

1. **Document each tool thoroughly**:
   - Provide clear descriptions
   - Explain parameter requirements
   - Include usage examples

2. **Explain limitations and constraints**:
   - Document known issues
   - Specify performance characteristics
   - Note security considerations

3. **Provide setup and configuration instructions**:
   - Include installation steps
   - Document configuration options
   - Provide troubleshooting guidance

## Potential Challenges

### Transport Compatibility

1. **Stdio Implementation**:
   - Ensure proper handling of stdin/stdout
   - Handle process termination gracefully
   - Implement proper error handling

2. **SSE Implementation**:
   - Handle connection interruptions
   - Implement proper HTTP status codes
   - Ensure compatibility with Cursor's SSE client

3. **Connection Management**:
   - Handle reconnection attempts
   - Implement proper timeout handling
   - Clean up resources on disconnection

### Tool Discovery

1. **Registration Issues**:
   - Tools may not appear immediately in Cursor's tool list
   - Ensure proper tool registration
   - Use the refresh button if tools don't appear

2. **Naming Conventions**:
   - Use consistent naming patterns
   - Avoid name conflicts with other servers
   - Use descriptive names for better discovery

3. **Metadata Accuracy**:
   - Ensure descriptions accurately reflect functionality
   - Provide complete parameter documentation
   - Update metadata when tool behavior changes

### Error Handling

1. **User-Friendly Messages**:
   - Cursor will display errors to users
   - Implement comprehensive error handling
   - Provide actionable error messages

2. **Error Recovery**:
   - Implement graceful degradation
   - Provide fallback options when possible
   - Maintain server stability during errors

3. **Debugging Support**:
   - Implement proper logging
   - Provide diagnostic information
   - Include error codes for common issues

### Security Boundaries

1. **Permission Model**:
   - Cursor runs MCP servers with user permissions
   - Implement proper security checks
   - Be cautious with file system operations

2. **Input Validation**:
   - Validate all user inputs
   - Sanitize data before processing
   - Prevent injection attacks

3. **Resource Access**:
   - Restrict access to sensitive resources
   - Implement proper authentication when needed
   - Use least privilege principle

### Versioning and Updates

1. **Backward Compatibility**:
   - Plan for backward compatibility
   - Document breaking changes
   - Provide migration guides for users

2. **Update Mechanism**:
   - Implement version checking
   - Provide update notifications
   - Support seamless updates

3. **Dependency Management**:
   - Handle dependency updates
   - Test with different versions of Cursor
   - Document compatibility requirements

## Conclusion

Implementing MCP servers for Cursor AI provides a powerful way to extend its capabilities with custom tools and services. By following the guidelines and examples in this report, developers can create MCP servers that seamlessly integrate with Cursor AI, enhancing its functionality for specific use cases.

The Model Context Protocol offers a standardized approach to connecting AI models with external tools, and Cursor AI's implementation provides a user-friendly interface for discovering and using these tools. By leveraging this ecosystem, developers can create specialized tools that enhance the coding experience and improve productivity.

Key takeaways from this research include:

1. **MCP Fundamentals**: Understanding the core concepts of the Model Context Protocol is essential for creating compatible servers.

2. **Cursor AI Integration**: Cursor AI provides specific integration points and configuration options for MCP servers.

3. **Implementation Approach**: Following a structured approach to server implementation ensures compatibility and reliability.

4. **Best Practices**: Adhering to best practices for tool design, security, and user experience creates a better overall experience.

5. **Code Examples**: The provided code examples demonstrate practical implementations that can be adapted for specific needs.

By leveraging the information in this report, developers can create MCP servers that enhance Cursor AI's capabilities, providing specialized tools for various coding tasks and workflows.
