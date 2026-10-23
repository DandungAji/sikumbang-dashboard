import React, { useEffect, useState } from 'react';
import { 
  Server, 
  Activity, 
  Box, 
  ExternalLink, 
  CheckCircle2, 
  XCircle,
  RefreshCw,
  Cpu,
  HardDrive,
  Ram
} from 'lucide-react';

const CARD_BG_COLORS = [
  'bg-[#7dd3fc]', // Soft Blue
  'bg-[#bef264]', // Soft Lime Green
  'bg-[#fde047]', // Soft Yellow
  'bg-[#f472b6]', // Soft Pink
  'bg-[#c084fc]', // Soft Purple
  'bg-[#fb923c]', // Soft Orange
];

// Mapping URL dan deskripsi service Homelab
const SERVICE_CONFIG = {
  'immich_server': {
    name: 'Immich',
    url: 'https://immich.sikumbang.web.id',
    description: 'Google Photos Alternative'
  },
  'vikunja': {
    name: 'Vikunja',
    url: 'https://tasks.sikumbang.web.id',
    description: 'Task Management & Kanban Board'
  },
  'speedtest-tracker': {
    name: 'Speedtest Tracker',
    url: 'http://100.87.126.58:8081',
    description: 'Network Performance Monitor'
  },
  'flatnotes': {
    name: 'Flatnotes',
    url: 'http://100.87.126.58:8080',
    description: 'Server Docs & Markdown Notes'
  },
  'portainer': {
    name: 'Portainer CE',
    url: 'https://100.87.126.58:9443',
    description: 'Docker Container Management'
  }
};

export default function App() {
  const [containers, setContainers] = useState([]);
  const [loading, setLoading] = useState(true);

  // State telemetry hardware realtime dari Python/psutil
  const [sysStats, setSysStats] = useState({
    cpuUsage: 0,
    ramUsedGb: 0,
    ramTotalGb: 8.0,
    diskUsedGb: 0,
    diskTotalGb: 500
  });

  // 1. Fetch data kontainer dari Portainer API
  const fetchContainers = () => {
    setLoading(true);
    fetch('/api/portainer/')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch from Portainer API');
        return res.json();
      })
      .then((data) => {
        const formatted = data
          // Filter: buang kontainer internal, DB, dan dashboard ini sendiri
          .filter((item) => {
            const rawName = item.Names[0] ? item.Names[0].replace('/', '') : '';
            const isInternal = 
              rawName.includes('postgres') || 
              rawName.includes('redis') || 
              rawName.includes('machine_learning') ||
              rawName.includes('sentinel') ||
              rawName.includes('sikumbang-dashboard');

            return !isInternal;
          })
          .map((item, index) => {
            const rawName = item.Names[0] ? item.Names[0].replace('/', '') : 'unnamed';
            const matchedConfig = SERVICE_CONFIG[rawName] || {
              name: rawName.toUpperCase(),
              url: null,
              description: item.Image
            };

            return {
              id: item.Id,
              rawName: rawName,
              displayName: matchedConfig.name,
              description: matchedConfig.description,
              url: matchedConfig.url,
              status: item.State,
              bgColor: CARD_BG_COLORS[index % CARD_BG_COLORS.length]
            };
          });

        setContainers(formatted);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Gagal mengambil data kontainer:', err);
        setLoading(false);
      });
  };

  // 2. Fetch sensor hardware asli realtime dari endpoint Python
  const fetchSystemStats = () => {
    fetch('/api/system-stats')
      .then((res) => res.json())
      .then((data) => {
        setSysStats({
          cpuUsage: data.cpuUsage,
          ramUsedGb: data.ramUsedGb,
          ramTotalGb: data.ramTotalGb,
          diskUsedGb: data.diskUsedGb,
          diskTotalGb: data.diskTotalGb
        });
      })
      .catch((err) => console.error('Gagal fetch real stats:', err));
  };

  // 3. Lifecycle hook untuk auto-refresh data
  useEffect(() => {
    fetchContainers();
    fetchSystemStats();

    // Polling sensor hardware tiap 3 detik
    const interval = setInterval(() => {
      fetchSystemStats();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const ramPercent = Math.round((sysStats.ramUsedGb / sysStats.ramTotalGb) * 100) || 0;
  const diskPercent = Math.round((sysStats.diskUsedGb / sysStats.diskTotalGb) * 100) || 0;

  return (
    <div className="min-h-screen bg-[#f4f4f0] text-black font-sans p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b-4 border-black">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-black text-white rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]">
                <Server size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight uppercase">HOME LAB</h1>
                <p className="text-sm font-semibold text-gray-700">Server Dashboard & Realtime Monitoring</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              fetchContainers();
              fetchSystemStats();
            }}
            disabled={loading}
            className="flex items-center gap-2 self-start sm:self-auto px-4 py-2 bg-[#fde047] hover:bg-[#facc15] border-2 border-black rounded-xl font-bold text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </header>

        {/* Realtime Resource Usage Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* CPU Widget */}
          <div className="bg-white border-3 border-black p-4 rounded-2xl shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-2 font-black text-sm uppercase">
                <Cpu size={18} /> CPU Load
              </span>
              <span className="font-extrabold text-xs px-2 py-0.5 bg-sky-200 border border-black rounded-md">
                {sysStats.cpuUsage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 h-4 rounded-lg border-2 border-black overflow-hidden">
              <div 
                className="bg-[#7dd3fc] h-full transition-all duration-500" 
                style={{ width: `${sysStats.cpuUsage}%` }}
              />
            </div>
          </div>

          {/* RAM Widget */}
          <div className="bg-white border-3 border-black p-4 rounded-2xl shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-2 font-black text-sm uppercase">
                <Ram size={18} /> RAM
              </span>
              <span className="font-extrabold text-xs px-2 py-0.5 bg-lime-200 border border-black rounded-md">
                {sysStats.ramUsedGb} / {sysStats.ramTotalGb} GB
              </span>
            </div>
            <div className="w-full bg-gray-200 h-4 rounded-lg border-2 border-black overflow-hidden">
              <div 
                className="bg-[#bef264] h-full transition-all duration-500" 
                style={{ width: `${ramPercent}%` }}
              />
            </div>
          </div>

          {/* DISK Widget */}
          <div className="bg-white border-3 border-black p-4 rounded-2xl shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-2 font-black text-sm uppercase">
                <HardDrive size={18} /> Storage
              </span>
              <span className="font-extrabold text-xs px-2 py-0.5 bg-pink-200 border border-black rounded-md">
                {sysStats.diskUsedGb} / {sysStats.diskTotalGb} GB
              </span>
            </div>
            <div className="w-full bg-gray-200 h-4 rounded-lg border-2 border-black overflow-hidden">
              <div 
                className="bg-[#f472b6] h-full transition-all duration-500" 
                style={{ width: `${diskPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Container Cards Section */}
        {loading && containers.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 border-4 border-black rounded-2xl bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <Activity size={40} className="animate-bounce mb-3" />
            <p className="font-extrabold text-lg">Loading active services from Portainer...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {containers.map((container) => (
              <div
                key={container.id}
                className={`flex flex-col justify-between border-3 border-black p-5 rounded-2xl ${container.bgColor} shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="p-2 bg-white border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <Box size={22} />
                    </div>
                    
                    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border-2 border-black capitalize ${
                      container.status === 'running' ? 'bg-emerald-300 text-black' : 'bg-red-300 text-black'
                    }`}>
                      {container.status === 'running' ? (
                        <CheckCircle2 size={12} />
                      ) : (
                        <XCircle size={12} />
                      )}
                      {container.status}
                    </span>
                  </div>

                  <h2 className="font-black text-xl leading-snug tracking-tight mb-1" title={container.displayName}>
                    {container.displayName}
                  </h2>
                  <p className="text-xs font-bold text-gray-800 break-words line-clamp-2 mb-4 opacity-80">
                    {container.description}
                  </p>
                </div>

                {container.url && (
                  <a
                    href={container.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 mt-2 w-full py-2 px-3 bg-white hover:bg-gray-50 border-2 border-black rounded-xl font-bold text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
                  >
                    Open Service <ExternalLink size={14} />
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}