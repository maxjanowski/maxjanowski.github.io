#!/usr/bin/env python3

import subprocess

output = open('assets/downloads.json', 'w')

f = subprocess.Popen(['/opt/local/bin/rclone', 'lsjson',
                      'GDCatalog:/Downloads'], stdout=output, close_fds=True)
