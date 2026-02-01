"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeMcpConfigs = exports.detectGenericPattern = exports.detectAppFromConfig = exports.APP_CONFIGS = void 0;
exports.APP_CONFIGS = {
    claude: { name: "Claude Desktop", file: "claude_desktop_config.json", key: "mcpServers" },
    cursor: { name: "Cursor", file: "mcp.json", key: "mcpServers" },
    zed: { name: "Zed Editor", file: "settings.json", key: "context_servers" },
    vscode: { name: "VS Code", file: "settings.json", key: "mcpServers" },
    windsurf: { name: "Windsurf", file: "mcp_config.json", key: "mcpServers" },
    generic: { name: "Generic/Other", file: "config.json", key: "auto" }
};
var detectAppFromConfig = function (jsonString) {
    try {
        var obj = JSON.parse(jsonString);
        if (obj.context_servers)
            return 'zed';
        if (obj.mcpServers)
            return 'claude';
        return null;
    }
    catch (_a) {
        return null;
    }
};
exports.detectAppFromConfig = detectAppFromConfig;
var detectGenericPattern = function (source) {
    var commonKeys = ['mcpServers', 'context_servers', 'servers', 'mcp'];
    for (var _i = 0, commonKeys_1 = commonKeys; _i < commonKeys_1.length; _i++) {
        var key = commonKeys_1[_i];
        if (source[key] && typeof source[key] === 'object')
            return key;
    }
    return Object.keys(source).find(function (key) {
        var val = source[key];
        if (typeof val === 'object' && !Array.isArray(val)) {
            var firstEntry = Object.values(val)[0];
            return firstEntry && (firstEntry.command || firstEntry.url);
        }
        return false;
    }) || 'mcpServers';
};
exports.detectGenericPattern = detectGenericPattern;
var mergeMcpConfigs = function (existing, newSnippet, targetKey) {
    var merged = __assign({}, existing);
    if (!merged[targetKey])
        merged[targetKey] = {};
    // Extract server name from snippet
    var serverName = Object.keys(newSnippet)[0];
    if (serverName) {
        merged[targetKey][serverName] = newSnippet[serverName];
    }
    return merged;
};
exports.mergeMcpConfigs = mergeMcpConfigs;
