"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var Inspector = function (_a) {
    var data = _a.data, onUpdate = _a.onUpdate;
    if (!data)
        return (<div className="w-64 bg-white border-l border-[#D2D2D7] p-4 text-[#86868B] text-xs italic">
      Select an MCP server to edit its variables.
    </div>);
    return (<div className="w-64 bg-white border-l border-[#D2D2D7] overflow-y-auto p-4">
      <div className="flex items-center gap-2 mb-6">
        <lucide_react_1.Settings size={16}/>
        <h3 className="font-bold text-sm">Server Settings</h3>
      </div>
      {/* ... rest of the inspector code ... */}
    </div>);
};
// THIS IS THE MISSING LINE CAUSING YOUR ERROR:
exports.default = Inspector;
