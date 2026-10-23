import { Image, ListTodo, FileText, Activity, Server, Cpu, Database, HardDrive } from 'lucide-react';

const services = [
  {
    id: 'immich',
    name: 'Immich',
    description: 'Media & Photo Backup',
    url: 'https://immich.sikumbang.web.id',
    icon: <Image size={24} strokeWidth={2.5} />,
    color: 'bg-neo-cyan',
  },
  {
    id: 'vikunja',
    name: 'Vikunja',
    description: 'Task Management',
    url: 'https://tasks.sikumbang.web.id',
    icon: <ListTodo size={24} strokeWidth={2.5} />,
    color: 'bg-neo-lime',
  },
  {
    id: 'flatnotes',
    name: 'Flatnotes',
    description: 'Server Docs',
    url: 'http://100.87.126.58:8080',
    icon: <FileText size={24} strokeWidth={2.5} />,
    color: 'bg-neo-yellow',
  },
  {
    id: 'speedtest',
    name: 'Speedtest',
    description: 'Network Monitor',
    url: 'http://100.87.126.58:8081',
    icon: <Activity size={24} strokeWidth={2.5} />,
    color: 'bg-neo-pink',
  }
];

function App() {
  return (
    // max-w diperkecil ke 5xl dan padding utama dikurangi
    <div className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto">
      
      {/* Bagian Header */}
      <header className="mb-8 flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="neo-card p-3 bg-white flex-shrink-0">
          <Server size={36} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight uppercase border-b-4 border-neo-dark inline-block mb-1 pb-1">
            Home Lab
          </h1>
          <p className="text-lg font-bold text-gray-800">
            Server Dashboard
          </p>
        </div>
      </header>

      {/* Section Monitoring */}
      <section className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* CPU Card */}
        <div className="neo-card p-4 bg-white flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-black uppercase flex items-center gap-2">
              <Cpu size={20} strokeWidth={2.5} /> CPU
            </h3>
            <span className="neo-badge text-xs px-2 py-0.5 bg-neo-cyan">24%</span>
          </div>
          <div className="w-full h-4 border-2 border-neo-dark rounded-full bg-neo-bg overflow-hidden shadow-neo-sm">
            <div className="h-full bg-neo-cyan border-r-2 border-neo-dark" style={{ width: '24%' }}></div>
          </div>
        </div>

        {/* RAM Card */}
        <div className="neo-card p-4 bg-white flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-black uppercase flex items-center gap-2">
              <Database size={20} strokeWidth={2.5} /> RAM
            </h3>
            <span className="neo-badge text-xs px-2 py-0.5 bg-neo-lime">4.2 / 8 GB</span>
          </div>
          <div className="w-full h-4 border-2 border-neo-dark rounded-full bg-neo-bg overflow-hidden shadow-neo-sm">
            <div className="h-full bg-neo-lime border-r-2 border-neo-dark" style={{ width: '52%' }}></div>
          </div>
        </div>

        {/* Storage Card */}
        <div className="neo-card p-4 bg-white flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-black uppercase flex items-center gap-2">
              <HardDrive size={20} strokeWidth={2.5} /> Disk
            </h3>
            <span className="neo-badge text-xs px-2 py-0.5 bg-neo-pink">120 / 500 GB</span>
          </div>
          <div className="w-full h-4 border-2 border-neo-dark rounded-full bg-neo-bg overflow-hidden shadow-neo-sm">
            <div className="h-full bg-neo-pink border-r-2 border-neo-dark" style={{ width: '24%' }}></div>
          </div>
        </div>
      </section>

      {/* Grid Layanan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {services.map((service) => (
          <a
            key={service.id}
            href={service.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`neo-card neo-card-hover block p-4 cursor-pointer ${service.color} flex flex-col justify-between`}
          >
            {/* Lingkaran ikon diperkecil (w-12 h-12) dan margin bawah dikurangi (mb-4) */}
            <div className="bg-white border-2 border-neo-dark rounded-full w-12 h-12 flex items-center justify-center mb-4 shadow-neo-sm">
              {service.icon}
            </div>
            <div>
              <h2 className="text-xl font-black mb-1">{service.name}</h2>
              <p className="text-sm font-bold text-gray-800/80">{service.description}</p>
            </div>
          </a>
        ))}
      </div>

    </div>
  );
}

export default App;