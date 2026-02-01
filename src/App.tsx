import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Download, Copy, Check, Zap, Settings2 } from 'lucide-react';
import { APP_CONFIGS, detectAppFromConfig, mergeMcpConfigs, detectGenericPattern } from './logic/mcpEngine';
import Inspector from './components/Inspector';
import { saveAs } from 'file-saver';

export default function App() {
  const [targetApp, setTargetApp] = useState('claude');
  const [sourceJson, setSourceJson] = useState('{\n  "mcpServers": {}\n}');
  const [snippetJson, setSnippetJson] = useState('{\n  "everything-server": {\n    "command": "npx",\n    "args": ["@modelcontextprotocol/server-everything"]\n  }\n}');
  const [resultJson, setResultJson] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<any>(null);

  useEffect(() => {
    const detected = detectAppFromConfig(sourceJson);
    if (detected && targetApp !== detected) setTargetApp(detected);
  }, [sourceJson]);

  const handleMerge = () => {
    try {
      const source = JSON.parse(sourceJson);
      const snippet = JSON.parse(snippetJson);
      const key = targetApp === 'generic' ? detectGenericPattern(source) : APP_CONFIGS[targetApp].key;
      const result = mergeMcpConfigs(source, snippet, key);
      setResultJson(JSON.stringify(result, null, 2));
    } catch (e) { alert("Invalid JSON format in inputs."); }
  };

  return (
    <div className="flex flex-col h-screen bg-[#F5F5F7] text-[#1D1D1F]">
      <header className="h-14 bg-white border-b border-[#D2D2D7] flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-2">
          <Zap className="text-blue-600" size={20} fill="currentColor" />
          <span className="font-bold tracking-tight">MCP Config Assistant</span>
        </div>
        <select 
          value={targetApp} 
          onChange={(e) => setTargetApp(e.target.value)}
          className="bg-[#F5F5F7] border border-[#D2D2D7] rounded-md text-sm px-3 py-1"
        >
          {Object.entries(APP_CONFIGS).map(([key, cfg]) => <option key={key} value={key}>{cfg.name}</option>)}
        </select>
      </header>

      <main className="flex flex-1 overflow-hidden p-4 gap-4">
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <div className="flex-1 flex gap-4">
            <div className="flex-1 bg-white rounded-xl border border-[#D2D2D7] overflow-hidden flex flex-col">
              <div className="p-2 border-b text-[10px] font-bold text-gray-400 uppercase bg-gray-50">Source Config</div>
              <Editor height="100%" defaultLanguage="json" value={sourceJson} onChange={(v) => setSourceJson(v || '')} options={{ minimap: { enabled: false }, fontSize: 12 }} />
            </div>
            <div className="flex-1 bg-white rounded-xl border border-[#D2D2D7] overflow-hidden flex flex-col">
              <div className="p-2 border-b text-[10px] font-bold text-gray-400 uppercase bg-gray-50">New Snippet</div>
              <Editor height="100%" defaultLanguage="json" value={snippetJson} onChange={(v) => setSnippetJson(v || '')} options={{ minimap: { enabled: false }, fontSize: 12 }} />
              <button onClick={handleMerge} className="m-3 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">Merge Config</button>
            </div>
          </div>
          <div className="h-1/3 bg-[#FBFBFD] rounded-xl border border-[#D2D2D7] overflow-hidden flex flex-col">
            <div className="p-2 border-b text-[10px] font-bold text-blue-500 uppercase bg-white flex justify-between">
              <span>Output: {APP_CONFIGS[targetApp].file}</span>
              <div className="flex gap-4">
                <button onClick={() => { navigator.clipboard.writeText(resultJson); setCopySuccess(true); setTimeout(()=>setCopySuccess(false),2000)}} className="flex items-center gap-1 hover:text-blue-700">
                  {copySuccess ? <Check size={12}/> : <Copy size={12}/>} Copy
                </button>
                <button onClick={() => saveAs(new Blob([resultJson]), APP_CONFIGS[targetApp].file)} className="flex items-center gap-1 hover:text-blue-700">
                  <Download size={12}/> Download
                </button>
              </div>
            </div>
            <Editor height="100%" defaultLanguage="json" value={resultJson} options={{ readOnly: true, minimap: { enabled: false }, fontSize: 12 }} />
          </div>
        </div>
        <Inspector data={selectedBlock} onUpdate={setSelectedBlock} />
      </main>
    </div>
  );
}