"""
Adapter scaffold for TalentRiver tool integration.
Implements ToolPort; replace stubs with real data/API calls.
"""
from typing import List, Optional, Dict, Any
from ...domain.ports import ToolPort


class TalentRiverAdapter(ToolPort):
    """Fetches tools/options/content from TalentRiver (scaffold)."""

    def list_tools(self) -> List[Dict[str, Any]]:
        return [{"id": "TalentRiver", "name": "TalentRiver"}]

    def list_options(self, tool_id: str) -> List[Dict[str, Any]]:
        return []

    def get_content(self, tool_id: str, option_id: str) -> Optional[Dict[str, Any]]:
        return None
