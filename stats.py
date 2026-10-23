from flask import Flask, jsonify
from flask_cors import CORS
import psutil

app = Flask(__name__)
CORS(app)

@app.route('/api/system-stats')
def system_stats():
    # Hitung CPU %
    cpu_percent = psutil.cpu_percent(interval=0.5)
    
    # Hitung RAM
    ram = psutil.virtual_memory()
    ram_used_gb = round(ram.used / (1024 ** 3), 2)
    ram_total_gb = round(ram.total / (1024 ** 3), 2)
    ram_percent = ram.percent
    
    # Hitung Disk (SSD OS)
    disk = psutil.disk_usage('/')
    disk_used_gb = round(disk.used / (1024 ** 3), 2)
    disk_total_gb = round(disk.total / (1024 ** 3), 2)
    disk_percent = disk.percent

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
    app.run(host='0.0.0.0', port=5000)