"""
Dummy tool adapter that wraps the existing static data source.
Useful for demos; swap this with real adapters later without touching routes.
"""
from typing import List, Optional, Dict, Any
from ..context import data as demo_data
from ...domain.ports import ToolPort


class DummyToolAdapter(ToolPort):
    """Adapter that forwards to the in-memory demo data module."""

    def list_tools(self) -> List[Dict[str, Any]]:
        # Returns a list of available tools (id + name).
        return demo_data.list_tools()

    def list_options(self, tool_id: str) -> List[Dict[str, Any]]:
        # Returns options for a specific tool (id + label + description/content).
        return demo_data.list_options(tool_id)

    def get_content(self, tool_id: str, option_id: str) -> Optional[Dict[str, Any]]:
        # Returns the content payload for the given tool/option, or None if missing.
        return demo_data.get_content(tool_id, option_id)
