// Вспомогательные функции

export function generateId() {
    return Date.now() + '-' + Math.random().toString(36).substr(2, 6);
}

export function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}