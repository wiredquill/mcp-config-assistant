export const APP_CONFIGS: Record<string, { name: string; file: string; key: string }> = {
  claude: { name: "Claude Desktop", file: "claude_desktop_config.json", key: "mcpServers" },
  cursor: { name: "Cursor", file: "mcp.json", key: "mcpServers" },
  zed: { name: "Zed Editor", file: "settings.json", key: "context_servers" },
  vscode: { name: "VS Code", file: "settings.json", key: "mcpServers" },
  windsurf: { name: "Windsurf", file: "mcp_config.json", key: "mcpServers" },
  generic: { name: "Generic/Other", file: "config.json", key: "auto" }
};

export const detectAppFromConfig = (jsonString: string): string | null => {
  try {
    const obj = JSON.parse(jsonString);
    if (obj.context_servers) return 'zed';
    if (obj.mcpServers) return 'claude';
    return null;
  } catch { return null; }
};

export const detectGenericPattern = (source: any) => {
  const commonKeys = ['mcpServers', 'context_servers', 'servers', 'mcp'];
  for (const key of commonKeys) {
    if (source[key] && typeof source[key] === 'object') return key;
  }
  return Object.keys(source).find(key => {
    const val = source[key];
    if (typeof val === 'object' && !Array.isArray(val)) {
      const firstEntry: any = Object.values(val)[0];
      return firstEntry && (firstEntry.command || firstEntry.url);
    }
    return false;
  }) || 'mcpServers';
};

export const mergeMcpConfigs = (existing: any, newSnippet: any, targetKey: string) => {
  const merged = { ...existing };
  if (!merged[targetKey]) merged[targetKey] = {};
  
  // Extract server name from snippet
  const serverName = Object.keys(newSnippet)[0];
  if (serverName) {
    merged[targetKey][serverName] = newSnippet[serverName];
  }
  return merged;
};