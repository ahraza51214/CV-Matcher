"""
Adapter scaffold for Copilot tool integration.
Implements ToolPort; replace stubs with real data/API calls.
"""
from typing import List, Optional, Dict, Any
from ...domain.ports import ToolPort


class CopilotAdapter(ToolPort):
    """Fetches tools/options/content from Copilot (scaffold)."""

    def list_tools(self) -> List[Dict[str, Any]]:
        return [{"id": "Copilot", "name": "Copilot"}]

    def list_options(self, tool_id: str) -> List[Dict[str, Any]]:
        return []

    def get_content(self, tool_id: str, option_id: str) -> Optional[Dict[str, Any]]:
        return None
