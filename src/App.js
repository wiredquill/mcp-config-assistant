"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = App;
var react_1 = require("react");
var react_2 = require("@monaco-editor/react");
var lucide_react_1 = require("lucide-react");
var file_saver_1 = require("file-saver");
// Internal Logic Imports
var mcpEngine_1 = require("./logic/mcpEngine");
var Inspector_1 = require("./components/Inspector");
function App() {
    // --- State Management ---
    var _a = (0, react_1.useState)('claude'), targetApp = _a[0], setTargetApp = _a[1];
    var _b = (0, react_1.useState)('{\n  "mcpServers": {}\n}'), sourceJson = _b[0], setSourceJson = _b[1];
    var _c = (0, react_1.useState)('{\n  "everything-server": {\n    "command": "npx",\n    "args": ["-y", "@modelcontextprotocol/server-everything"],\n    "env": {\n       "API_KEY": "YOUR_KEY_HERE"\n    }\n  }\n}'), snippetJson = _c[0], setSnippetJson = _c[1];
    var _d = (0, react_1.useState)(''), resultJson = _d[0], setResultJson = _d[1];
    var _e = (0, react_1.useState)(false), copySuccess = _e[0], setCopySuccess = _e[1];
    var _f = (0, react_1.useState)(null), selectedBlock = _f[0], setSelectedBlock = _f[1];
    // --- Effects ---
    // Auto-detect app based on Panel 1 content
    (0, react_1.useEffect)(function () {
        var detected = (0, mcpEngine_1.detectAppFromConfig)(sourceJson);
        if (detected && targetApp !== detected && targetApp !== 'generic') {
            setTargetApp(detected);
        }
    }, [sourceJson, targetApp]);
    // Sync the Inspector with whatever is in the Snippet Panel (Panel 2)
    (0, react_1.useEffect)(function () {
        try {
            var parsed = JSON.parse(snippetJson);
            var firstKey = Object.keys(parsed)[0];
            if (firstKey)
                setSelectedBlock(parsed[firstKey]);
        }
        catch (e) {
            // Snippet is currently invalid JSON while typing
        }
    }, [snippetJson]);
    // --- Handlers ---
    var handleMerge = function () {
        try {
            var source = JSON.parse(sourceJson);
            var snippet = JSON.parse(snippetJson);
            var key = mcpEngine_1.APP_CONFIGS[targetApp].key;
            if (targetApp === 'generic') {
                key = (0, mcpEngine_1.detectGenericPattern)(source);
            }
            var result = (0, mcpEngine_1.mergeMcpConfigs)(source, snippet, key);
            setResultJson(JSON.stringify(result, null, 2));
        }
        catch (e) {
            alert("Validation Error: Please ensure both input panels contain valid JSON code.");
        }
    };
    var handleCopy = function () {
        navigator.clipboard.writeText(resultJson);
        setCopySuccess(true);
        setTimeout(function () { return setCopySuccess(false); }, 2000);
    };
    var updateSnippetFromInspector = function (updatedServerData) {
        try {
            var parsed = JSON.parse(snippetJson);
            var firstKey = Object.keys(parsed)[0];
            if (firstKey) {
                parsed[firstKey] = updatedServerData;
                setSnippetJson(JSON.stringify(parsed, null, 2));
            }
        }
        catch (e) {
            console.error("Could not sync inspector to snippet");
        }
    };
    return (<div className="flex flex-col h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans selection:bg-blue-500/20">
      
      {/* Liquid Glass Header */}
      <header className="h-16 bg-white/80 backdrop-blur-md border-b border-[#D2D2D7] flex items-center justify-between px-8 z-20 sticky top-0">
        <div className="flex items-center gap-3 group">
          <div className="w-9 h-9 bg-gradient-to-br from-[#0071E3] to-[#AF52DE] rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:rotate-12 transition-transform duration-300">
            <lucide_react_1.Zap size={20} className="text-white fill-white"/>
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">MCP Config Assistant</h1>
            <p className="text-[10px] uppercase tracking-widest text-[#0071E3] font-black">2026 Production Beta</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 bg-[#F5F5F7] p-1.5 rounded-2xl border border-gray-200">
            <span className="text-[10px] font-black text-gray-400 ml-3 uppercase tracking-tighter">Destination</span>
            <select value={targetApp} onChange={function (e) { return setTargetApp(e.target.value); }} className="bg-white border-none rounded-xl text-sm font-bold px-4 py-1.5 shadow-sm focus:ring-2 focus:ring-[#0071E3] outline-none cursor-pointer hover:bg-gray-50 transition-colors">
              {Object.entries(mcpEngine_1.APP_CONFIGS).map(function (_a) {
            var key = _a[0], cfg = _a[1];
            return (<option key={key} value={key}>{cfg.name}</option>);
        })}
            </select>
          </div>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-black transition-colors">
            <lucide_react_1.Github size={20}/>
          </a>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden p-6 gap-6">
        
        {/* Main Editor Section */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          <div className="flex-1 flex gap-6 min-h-0">
            
            {/* Panel 1: Original Config (Indigo) */}
            <section className="flex-1 flex flex-col bg-white rounded-3xl border border-gray-200 shadow-xl shadow-gray-200/40 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-50 flex justify-between items-center bg-indigo-50/40">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-400"/>
                  <h2 className="text-[11px] font-black uppercase tracking-widest text-indigo-500">1. Original Config</h2>
                </div>
                <lucide_react_1.Info size={14} className="text-indigo-300 cursor-help"/>
              </div>
              <div className="flex-1 pt-2">
                <react_2.default height="100%" defaultLanguage="json" value={sourceJson} onChange={function (v) { return setSourceJson(v || ''); }} options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: 'off',
            padding: { top: 10 },
            fontFamily: 'JetBrains Mono, Menlo, monospace'
        }}/>
              </div>
            </section>

            {/* Panel 2: New Snippet (Purple) */}
            <section className="flex-1 flex flex-col bg-white rounded-3xl border border-gray-200 shadow-xl shadow-gray-200/40 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-50 flex justify-between items-center bg-purple-50/40">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#AF52DE]"/>
                  <h2 className="text-[11px] font-black uppercase tracking-widest text-[#AF52DE]">2. New MCP Server</h2>
                </div>
                <lucide_react_1.Settings2 size={14} className="text-purple-300"/>
              </div>
              <div className="flex-1 pt-2">
                <react_2.default height="100%" defaultLanguage="json" value={snippetJson} onChange={function (v) { return setSnippetJson(v || ''); }} options={{ minimap: { enabled: false }, fontSize: 13, lineNumbers: 'off', padding: { top: 10 } }}/>
              </div>
              <div className="p-4 bg-gray-50/30">
                <button onClick={handleMerge} className="w-full bg-gradient-to-r from-[#0071E3] to-[#AF52DE] text-white py-3.5 rounded-2xl font-black shadow-lg shadow-blue-500/25 hover:brightness-110 active:scale-[0.97] transition-all flex items-center justify-center gap-3 uppercase text-[11px] tracking-[0.15em]">
                  <lucide_react_1.Zap size={16} fill="white"/> Construct Merge
                </button>
              </div>
            </section>
          </div>

          {/* Panel 3: Merged Result (Green/Success) */}
          <section className="h-[35%] bg-white rounded-3xl border-2 border-green-500/10 shadow-2xl shadow-green-500/5 overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 bg-green-50/30 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
                  <lucide_react_1.Check size={18} color="white" strokeWidth={3}/>
                </div>
                <div>
                  <h2 className="text-sm font-bold tracking-tight">Deployment Ready</h2>
                  <p className="text-[10px] font-mono text-gray-400">{mcpEngine_1.APP_CONFIGS[targetApp].file}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={handleCopy} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F5F5F7] text-xs font-bold hover:bg-gray-200 transition-all active:scale-95">
                  {copySuccess ? <lucide_react_1.Check size={14} className="text-green-500"/> : <lucide_react_1.Copy size={14}/>} 
                  {copySuccess ? "Copied to Clipboard" : "Copy Code"}
                </button>
                <button onClick={function () { return (0, file_saver_1.saveAs)(new Blob([resultJson]), mcpEngine_1.APP_CONFIGS[targetApp].file); }} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1D1D1F] text-white text-xs font-bold hover:bg-black shadow-lg shadow-black/10 transition-all active:scale-95">
                  <lucide_react_1.Download size={14}/> Download File
                </button>
              </div>
            </div>
            <div className="flex-1 bg-[#FBFBFD]">
              <react_2.default height="100%" defaultLanguage="json" value={resultJson} options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13, padding: { top: 12 } }}/>
            </div>
          </section>
        </div>

        {/* Sidebar Inspector Column */}
        <aside className="w-80 flex flex-col gap-6 shrink-0">
           <Inspector_1.default data={selectedBlock} onUpdate={updateSnippetFromInspector}/>
        </aside>

      </main>
    </div>);
}
