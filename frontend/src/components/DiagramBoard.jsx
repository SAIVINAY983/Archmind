import React, { useCallback, useMemo } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge
} from 'reactflow';
import 'reactflow/dist/style.css';
import { toPng } from 'html-to-image';
import { Download } from 'lucide-react';

const DiagramBoard = ({ data }) => {
  const initialNodes = useMemo(() => {
    return (data?.nodes || []).map((node, index) => ({
      ...node,
      position: node.position || {
        x: (index % 3) * 250 + 50,
        y: Math.floor(index / 3) * 150 + 50
      }
    }));
  }, [data]);
  const initialEdges = useMemo(() => data?.edges || [], [data]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Update nodes and edges when data changes
  React.useEffect(() => {
    if (data?.nodes) {
      const positionedNodes = data.nodes.map((node, index) => ({
        ...node,
        position: node.position || {
          x: (index % 3) * 250 + 50,
          y: Math.floor(index / 3) * 150 + 50
        }
      }));
      setNodes(positionedNodes);
    }
    if (data?.edges) setEdges(data.edges);
  }, [data, setNodes, setEdges]);

  const downloadImage = useCallback(() => {
    const element = document.querySelector('.react-flow');
    if (!element) return;
    toPng(element, { backgroundColor: '#080c14' })
      .then((dataUrl) => {
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = 'archmind-design.png';
        a.click();
      })
      .catch((err) => console.error('Failed to export diagram:', err));
  }, []);

  return (
    <div className="h-full w-full rounded-xl overflow-hidden border border-slate-700/50 bg-dark-800/80 shadow-inner relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-accent-500/5 pointer-events-none z-0"></div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        className="z-10 relative"
      >
        <div className="absolute top-4 right-4 z-50">
          <button 
            onClick={downloadImage}
            className="flex items-center gap-2 bg-dark-900 border border-slate-700/50 hover:border-primary-500/50 text-slate-300 hover:text-primary-400 px-4 py-2 rounded-lg transition-all shadow-[0_0_10px_rgba(0,0,0,0.5)] group"
          >
            <Download size={16} className="group-hover:-translate-y-0.5 transition-transform" />
            <span className="text-sm font-medium">Export PNG</span>
          </button>
        </div>
        <Background color="#1f2937" gap={20} size={1.5} />
        <Controls className="filter drop-shadow-[0_0_5px_rgba(56,189,248,0.2)]" />
        <MiniMap 
          nodeColor="#a78bfa" 
          maskColor="rgba(8, 12, 20, 0.8)" 
          style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px' }}
        />
      </ReactFlow>
    </div>
  );
};

export default DiagramBoard;
