# check_pytest_opts.py
import pytest
import sys

class MyPlugin:
    def pytest_addoption(self, parser):
        group = parser.getgroup("asyncio")
        print(f"Asyncio group options: {group.options}")
        for opt in group.options:
            print(f"Option: {opt.names}, default: {opt.default}, help: {opt.help}")

if __name__ == "__main__":
    # Запускаем pytest с этим плагином, чтобы он вывел опции
    # Передаем '-h' чтобы он не пытался собирать тесты, а просто показал помощь/опции
    # и завершился.
    sys.exit(pytest.main(["-h"], plugins=[MyPlugin()]))