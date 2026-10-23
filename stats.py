from flask import Flask, jsonify
from flask_cors import CORS
import psutil

app = Flask(__name__)
CORS(app)

@app.route('/api/system-stats')
def system_stats():
    # Fix CPU %: Panggil dua kali atau tanpa interval biar psutil nge-sample beban sistem dengan benar
    cpu_percent = psutil.cpu_percent(interval=None)
    
    # RAM Total System (OS + Semua Container Docker)
    ram = psutil.virtual_memory()
    ram_used_gb = round(ram.used / (1024 ** 3), 2)
    ram_total_gb = round(ram.total / (1024 ** 3), 2)
    ram_percent = ram.percent
    
    # Storage 1: SSD OS ( Root / )
    disk_root = psutil.disk_usage('/')
    
    # Storage 2: HDD Data ( /mnt/storage ) -> Tempat data Immich!
    try:
        disk_data = psutil.disk_usage('/mnt/storage')
        total_used_bytes = disk_root.used + disk_data.used
        total_size_bytes = disk_root.total + disk_data.total
    except Exception:
        # Fallback kalau mount point /mnt/storage tidak terbaca di dalam kontainer
        total_used_bytes = disk_root.used
        total_size_bytes = disk_root.total

    disk_used_gb = round(total_used_bytes / (1024 ** 3), 2)
    disk_total_gb = round(total_size_bytes / (1024 ** 3), 2)
    disk_percent = round((total_used_bytes / total_size_bytes) * 100, 1)

    return jsonify({
        'cpuUsage': cpu_percent,
        'ramUsedGb': ram_used_gb,
        'ramTotalGb': ram_total_gb,
        'ramPercent': ram_percent,
        'diskUsedGb': disk_used_gb,
        'diskTotalGb': disk_total_gb,
        'diskPercent': disk_percent
    })

if __name__ == '__main__':
    # Force psutil insialisasi sample CPU awal
    psutil.cpu_percent(interval=None)
    app.run(host='0.0.0.0', port=5000)