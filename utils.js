//вспомогательные функции, которые используются в разных частях приложения

//генерируем уникальный ID для каждого элемента (опыта, образования) и используем время + случайные символы, чтобы ID точно не повторялись
export function generateId() {
    return Date.now() + '-' + Math.random().toString(36).substr(2, 6);
}

//экранируем HTML спецсимволы, чтобы пользователь не мог вставить вредоносный код
export function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
