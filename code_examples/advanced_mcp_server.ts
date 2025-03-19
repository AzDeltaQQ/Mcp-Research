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
