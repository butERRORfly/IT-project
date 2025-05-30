from math import ceil

class Paginator:
    def __init__(self, items: list, per_page: int = 5):
        self.items = items
        self.per_page = per_page
        self.total_items = len(items)
        self.total_pages = ceil(self.total_items / self.per_page) if self.total_items > 0 else 1

    def get_page(self, page: int) -> tuple[list, dict]:
        """Возвращает элементы страницы и метаданные пагинации"""
        page = max(1, min(page, self.total_pages))
        start = (page - 1) * self.per_page
        end = start + self.per_page
        return self.items[start:end], {
            "page": page,
            "total_pages": self.total_pages,
            "total_items": self.total_items,
            "per_page": self.per_page
        }