# Model Context Protocol (MCP) Basics

## Overview

The Model Context Protocol (MCP) is an open standard that enables developers to build secure, two-way connections between their data sources and AI-powered tools. It standardizes how applications provide context to Large Language Models (LLMs), functioning like a "USB-C port for AI applications" - providing a standardized way to connect AI models to different data sources and tools.

## Core Architecture

MCP follows a client-server architecture where:

- **Hosts**: LLM applications (like Claude Desktop or IDEs) that initiate connections
- **Clients**: Maintain 1:1 connections with servers, inside the host application
- **Servers**: Provide context, tools, and prompts to clients

### Protocol Layer

The protocol layer handles message framing, request/response linking, and high-level communication patterns.

Key classes include:
- `Protocol`
- `Client`
- `Server`

### Transport Layer

The transport layer handles the actual communication between clients and servers. MCP supports multiple transport mechanisms:

1. **Stdio transport**
   - Uses standard input/output for communication
   - Ideal for local processes

2. **HTTP with SSE transport**
   - Uses Server-Sent Events for server-to-client messages
   - HTTP POST for client-to-server messages

All transports use JSON-RPC 2.0 to exchange messages.

### Message Types

MCP has these main types of messages:

1. **Requests**: Expect a response from the other side
2. **Results**: Successful responses to requests
3. **Errors**: Indicate that a request failed
4. **Notifications**: One-way messages that don't expect a response

## Benefits of MCP

MCP helps build agents and complex workflows on top of LLMs. LLMs frequently need to integrate with data and tools, and MCP provides:

- A growing list of pre-built integrations that your LLM can directly plug into
- The flexibility to switch between LLM providers and vendors
- Best practices for securing your data within your infrastructure

## Example Server Implementation: Filesystem MCP Server

The Filesystem MCP Server is a Node.js implementation that provides filesystem operations through the Model Context Protocol. It demonstrates how to create an MCP server that can:

- Read/write files
- Create/list/delete directories
- Move files/directories
- Search files
- Get file metadata

### Key Features

The server exposes a resource `file://system` that provides a file system operations interface with methods like:

- **read_file**: Read complete contents of a file
- **write_file**: Create new file or overwrite existing
- **edit_file**: Make selective edits using advanced pattern matching and formatting
- **create_directory**: Create new directory or ensure it exists
- **list_directory**: List directory contents
- **move_file**: Move or rename files and directories
- **search_files**: Recursively search for files/directories
- **get_file_info**: Get detailed file/directory metadata
- **list_allowed_directories**: List all directories the server is allowed to access

### Implementation Details

The server is implemented in TypeScript and uses the MCP SDK:

```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ToolSchema,
} from "@modelcontextprotocol/sdk/types.js";
```

The server only allows operations within directories specified via command-line arguments, providing a security boundary.

### Usage with Claude Desktop

The server can be configured in Claude Desktop's configuration file:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "--mount", "type=bind,src=/Users/username/Desktop,dst=/projects/Desktop",
        "--mount", "type=bind,src=/path/to/other/allowed/dir,dst=/projects/other/allowed/dir,ro",
        "--mount", "type=bind,src=/path/to/file.txt,dst=/projects/path/to/file.txt",
        "mcp/filesystem",
        "/projects"
      ]
    }
  }
}
```

Or using NPX:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/username/Desktop",
        "/path/to/other/allowed/dir"
      ]
    }
  }
}
```

## Key Concepts for MCP Server Implementation

1. **Resource Definition**: MCP servers expose resources (like `file://system`) that provide specific functionality
2. **Method Implementation**: Each resource has methods that can be called by clients
3. **Security Boundaries**: Servers should implement appropriate security measures (like path restrictions)
4. **Transport Handling**: Servers need to implement a transport mechanism (stdio or HTTP+SSE)
5. **Message Processing**: Servers must handle the MCP message types correctly

## Conclusion

The Model Context Protocol provides a standardized way for AI models to interact with external data sources and tools. By implementing MCP servers, developers can extend the capabilities of AI applications like Claude, allowing them to access and manipulate data in a secure and controlled manner.
