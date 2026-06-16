// Главный файл приложения - точка входа
// Тут только запускаем контроллер, вся логика в других файлах
import { init } from './controller.js';

// Когда страница полностью загрузится - запускаем приложение
document.addEventListener('DOMContentLoaded', init);
