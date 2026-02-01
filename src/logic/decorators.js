"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMcpDecorations = void 0;
// src/logic/decorators.ts
var getMcpDecorations = function (json) {
    try {
        var obj = JSON.parse(json);
        var servers = obj.mcpServers || obj.context_servers || {};
        // This logic calculates the line numbers (simplified for Beta)
        // In a real app, you'd use a JSON parser that tracks line/column
        return Object.keys(servers).map(function (name, index) { return ({
            name: name,
            colorClass: ['mcp-block-blue', 'mcp-block-purple', 'mcp-block-teal'][index % 3]
        }); });
    }
    catch (_a) {
        return [];
    }
};
exports.getMcpDecorations = getMcpDecorations;
