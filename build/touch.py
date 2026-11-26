from pathlib import Path
import sys
for arg in sys.argv[1:]:
	if arg == '--end':
		sys.exit(0)
	Path(arg).touch()
