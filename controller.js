import * as model from './model.js';
import * as view from './view.js';

// Функция обновления всего UI
function updateUI() {
    const state = model.getAllState();
    view.renderPreview(state);
    view.renderWorkList(state.workExperiences, {
        onUpdate: (id, field, value) => {
            model.updateWorkField(id, field, value);
            updateUI();
        },
        onRemove: (id) => {
            model.removeWorkItem(id);
            updateUI();
        }
    });
    view.renderEducationList(state.educationItems, {
        onUpdate: (id, field, value) => {
            model.updateEducationField(id, field, value);
            updateUI();
        },
        onRemove: (id) => {
            model.removeEducationItem(id);
            updateUI();
        }
    });
    view.renderSkillsTags(state.skills, {
        onRemove: (index) => {
            model.removeSkill(index);
            updateUI();
        }
    });
}

// ---- Экспорт в PDF ----
async function exportToPDF() {
    const resumeElement = document.getElementById('resumeContent');
    if (!resumeElement) {
        alert('Ошибка: содержимое резюме не найдено');
        return;
    }

    const state = model.getAllState();
    if (state.fullName === '' && state.jobTitle === '' && state.workExperiences.length === 0 && state.educationItems.length === 0 && state.skills.length === 0) {
        alert('Нет данных для экспорта. Заполните резюме.');
        return;
    }

    const exportBtn = document.getElementById('exportPDF');
    const originalText = exportBtn.innerHTML;
    exportBtn.innerHTML = '⏳ Создание PDF...';
    exportBtn.disabled = true;

    try {
        const exportContainer = document.createElement('div');
        exportContainer.style.cssText = `
            position: fixed;
            top: -10000px;
            left: -10000px;
            background: white;
            padding: 20px;
            width: 800px;
        `;
        
        exportContainer.innerHTML = resumeElement.cloneNode(true).innerHTML;
        document.body.appendChild(exportContainer);
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const canvas = await html2canvas(exportContainer, {
            scale: 2,
            backgroundColor: 'white',
            logging: false,
            useCORS: true
        });
        
        document.body.removeChild(exportContainer);
        
        const imgData = canvas.toDataURL('image/png');
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait'
        });
        
        const imgWidth = 210;
        const pageHeight = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        let position = 0;
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        
        let heightLeft = imgHeight - pageHeight;
        let currentPosition = -pageHeight;
        
        while (heightLeft > 0) {
            position = currentPosition;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
            currentPosition -= pageHeight;
        }
        
        pdf.save(`resume_${state.fullName || 'document'}.pdf`);
        
    } catch (error) {
        console.error('Ошибка при создании PDF:', error);
        alert('Ошибка при создании PDF. Попробуйте снова.\n' + error.message);
    } finally {
        exportBtn.innerHTML = originalText;
        exportBtn.disabled = false;
    }
}

// ---- Инициализация ----
export function init() {
    // Загружаем сохранённые данные
    const hasSavedData = model.loadFromLocalStorage();
    if (hasSavedData) {
        console.log('Данные загружены из localStorage');
    }

    // Обновляем поля ввода (значения из модели)
    document.getElementById('fullName').value = model.getFullName();
    document.getElementById('jobTitle').value = model.getJobTitle();
    document.getElementById('salary').value = model.getSalary();
    document.getElementById('email').value = model.getEmail();
    document.getElementById('phone').value = model.getPhone();

    // Первоначальная отрисовка
    updateUI();

    // ---- Обработчики событий для основных полей ----
    document.getElementById('fullName').addEventListener('input', (e) => {
        model.setFullName(e.target.value);
        updateUI();
    });
    document.getElementById('jobTitle').addEventListener('input', (e) => {
        model.setJobTitle(e.target.value);
        updateUI();
    });
    document.getElementById('salary').addEventListener('input', (e) => {
        model.setSalary(e.target.value);
        updateUI();
    });
    document.getElementById('email').addEventListener('input', (e) => {
        model.setEmail(e.target.value);
        updateUI();
    });
    document.getElementById('phone').addEventListener('input', (e) => {
        model.setPhone(e.target.value);
        updateUI();
    });

    // ---- Кнопки добавления ----
    document.getElementById('addWork').addEventListener('click', () => {
        model.addWorkExperience();
        updateUI();
    });
    document.getElementById('addEducation').addEventListener('click', () => {
        model.addEducation();
        updateUI();
    });
    document.getElementById('addSkill').addEventListener('click', () => {
        const input = document.getElementById('skillInput');
        const skill = input.value.trim();
        if (model.addSkill(skill)) {
            input.value = '';
            updateUI();
        } else if (skill !== '') {
            alert('Этот навык уже добавлен или пустой');
        }
    });

    // ---- Навык по Enter ----
    document.getElementById('skillInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            document.getElementById('addSkill').click();
        }
    });

    // ---- Сброс ----
    document.getElementById('resetBtn').addEventListener('click', () => {
        if (confirm('Вы уверены, что хотите сбросить все данные? Это действие нельзя отменить.')) {
            model.resetData();
            // Очищаем поля ввода
            document.getElementById('fullName').value = '';
            document.getElementById('jobTitle').value = '';
            document.getElementById('salary').value = '';
            document.getElementById('email').value = '';
            document.getElementById('phone').value = '';
            document.getElementById('skillInput').value = '';
            updateUI();
        }
    });

    // ---- Экспорт PDF ----
    document.getElementById('exportPDF').addEventListener('click', exportToPDF);
}