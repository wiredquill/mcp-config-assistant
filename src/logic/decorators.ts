// src/logic/decorators.ts
export const getMcpDecorations = (json: string) => {
  try {
    const obj = JSON.parse(json);
    const servers = obj.mcpServers || obj.context_servers || {};
    // This logic calculates the line numbers (simplified for Beta)
    // In a real app, you'd use a JSON parser that tracks line/column
    return Object.keys(servers).map((name, index) => ({
      name,
      colorClass: ['mcp-block-blue', 'mcp-block-purple', 'mcp-block-teal'][index % 3]
    }));
  } catch {
    return [];
  }
};