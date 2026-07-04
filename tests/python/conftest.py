import sys
from pathlib import Path

# pyeek_core.py はパッケージ化していない単一モジュールなので、テストから
# import できるよう py/ を sys.path に足す。
sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "py"))
