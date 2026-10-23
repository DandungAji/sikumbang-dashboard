import React, { useEffect, useState } from 'react';
import { 
  Server, 
  Activity, 
  Box, 
  ExternalLink, 
  CheckCircle2, 
  XCircle,
  RefreshCw
} from 'lucide-react';

const CARD_BG_COLORS = [
  'bg-[#7dd3fc]', // Soft Blue
  'bg-[#bef264]', // Soft Lime Green
  'bg-[#fde047]', // Soft Yellow
  'bg-[#f472b6]', // Soft Pink
  'bg-[#c084fc]', // Soft Purple
  'bg-[#fb923c]', // Soft Orange
];

// Mapping URL dan nama bersih sesuai dokumentasi Homelab
const SERVICE_CONFIG = {
  'sikumbang-dashboard': {
    name: 'Sikumbang Dashboard',
    url: 'https://sikumbang.web.id',
    description: 'Custom Soft-Brutalism Landing Page'
  },
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

  const fetchContainers = () => {
    setLoading(true);
    fetch('/api/portainer/')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch from Portainer API');
        return res.json();
      })
      .then((data) => {
        const formatted = data
          // 1. FILTER: Blacklist kontainer pendukung/database internal
          .filter((item) => {
            const rawName = item.Names[0] ? item.Names[0].replace('/', '') : '';
            const isInternal = 
              rawName.includes('postgres') || 
              rawName.includes('redis') || 
              rawName.includes('machine_learning') ||
              rawName.includes('sentinel');
            return !isInternal;
          })
          // 2. MAP: Cocokkan nama & URL berdasarkan SERVICE_CONFIG
          .map((item, index) => {
            const rawName = item.Names[0] ? item.Names[0].replace('/', '') : 'unnamed';
            
            // Cari konfigurasi kustom, jika tidak ada buatkan fallback rapi
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

  useEffect(() => {
    fetchContainers();
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f4f0] text-black font-sans p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b-4 border-black">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-black text-white rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]">
                <Server size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight uppercase">HOME LAB</h1>
                <p className="text-sm font-semibold text-gray-700">Server Dashboard & Service Discovery</p>
              </div>
            </div>
          </div>

          <button
            onClick={fetchContainers}
            disabled={loading}
            className="flex items-center gap-2 self-start sm:self-auto px-4 py-2 bg-[#fde047] hover:bg-[#facc15] border-2 border-black rounded-xl font-bold text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh Services
          </button>
        </header>

        {/* Content Section */}
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 border-4 border-black rounded-2xl bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <Activity size={40} className="animate-bounce mb-3" />
            <p className="font-extrabold text-lg">Loading active services from Portainer...</p>
          </div>
        ) : containers.length === 0 ? (
          <div className="p-8 border-4 border-black rounded-2xl bg-[#f472b6] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
            <h2 className="font-black text-xl mb-2">Tidak Ada Service Aktif</h2>
            <p className="font-semibold text-sm">Pastikan kontainer di Portainer sedang berjalan.</p>
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