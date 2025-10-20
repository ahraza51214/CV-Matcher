from typing import Protocol, BinaryIO

class DocumentReader(Protocol):
    """Strategy interface for reading different formats into text."""
    def read(self, stream: BinaryIO) -> str: ...
