// app.js - Генератор резюме с зарплатой, образованием и localStorage

// ---------- Глобальное состояние ----------
let fullName = "";
let jobTitle = "";
let salary = "";
let email = "";
let phone = "";

let workExperiences = [];     // массив объектов { id, company, position, period, description }
let educationItems = [];      // массив объектов { id, institution, degree, year, description }
let skills = [];              // массив строк

// ---------- Работа с localStorage ----------
function saveToLocalStorage() {
    const data = {
        fullName,
        jobTitle,
        salary,
        email,
        phone,
        workExperiences,
        educationItems,
        skills
    };
    localStorage.setItem('resumeData', JSON.stringify(data));
}

function loadFromLocalStorage() {
    const savedData = localStorage.getItem('resumeData');
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            fullName = data.fullName || "";
            jobTitle = data.jobTitle || "";
            salary = data.salary || "";
            email = data.email || "";
            phone = data.phone || "";
            workExperiences = data.workExperiences || [];
            educationItems = data.educationItems || [];
            skills = data.skills || [];
            
            // Обновляем поля ввода
            document.getElementById('fullName').value = fullName;
            document.getElementById('jobTitle').value = jobTitle;
            document.getElementById('salary').value = salary;
            document.getElementById('email').value = email;
            document.getElementById('phone').value = phone;
            
            return true;
        } catch (e) {
            console.error('Ошибка загрузки данных:', e);
        }
    }
    return false;
}

function generateId() {
    return Date.now() + '-' + Math.random().toString(36).substr(2, 6);
}

// ---------- Обновление предпросмотра ----------
function updatePreview() {
    const previewDiv = document.getElementById('preview');
    if (!previewDiv) return;

    // Опыт работы HTML
    let workHtml = '';
    if (workExperiences.length === 0) {
        workHtml = '<p style="color: #999;">Нет добавленного опыта работы</p>';
    } else {
        workExperiences.forEach(exp => {
            workHtml += `
                <div style="margin-bottom: 20px;">
                    <div style="font-weight: bold; font-size: 16px;">
                        ${exp.company ? escapeHtml(exp.company) : '—'} — ${exp.position ? escapeHtml(exp.position) : 'Должность не указана'}
                        ${exp.period ? `<span style="font-weight: normal; color: #666; margin-left: 10px;">${escapeHtml(exp.period)}</span>` : ''}
                    </div>
                    ${exp.description ? `<div style="margin-top: 5px; color: #444; padding-left: 15px;">${escapeHtml(exp.description)}</div>` : ''}
                </div>
            `;
        });
    }

    // Образование HTML
    let educationHtml = '';
    if (educationItems.length === 0) {
        educationHtml = '<p style="color: #999;">Нет добавленного образования</p>';
    } else {
        educationItems.forEach(edu => {
            educationHtml += `
                <div style="margin-bottom: 20px;">
                    <div style="font-weight: bold; font-size: 16px;">
                        ${edu.institution ? escapeHtml(edu.institution) : '—'} — ${edu.degree ? escapeHtml(edu.degree) : 'Специальность не указана'}
                        ${edu.year ? `<span style="font-weight: normal; color: #666; margin-left: 10px;">${escapeHtml(edu.year)}</span>` : ''}
                    </div>
                    ${edu.description ? `<div style="margin-top: 5px; color: #444; padding-left: 15px;">${escapeHtml(edu.description)}</div>` : ''}
                </div>
            `;
        });
    }

    // Навыки HTML
    let skillsHtml = '';
    if (skills.length === 0) {
        skillsHtml = '<p style="color: #999;">Навыки не добавлены</p>';
    } else {
        skillsHtml = '<div style="display: flex; flex-wrap: wrap; gap: 8px;">';
        skills.forEach(s => {
            skillsHtml += `<span style="background: #e9ecef; padding: 5px 12px; border-radius: 20px; font-size: 14px;">${escapeHtml(s)}</span>`;
        });
        skillsHtml += '</div>';
    }

    // Контактная информация (телефон и email)
    const contactHtml = `
        <div style="margin: 15px 0 10px 0; color: #6c757d; display: flex; justify-content: center; gap: 24px; flex-wrap: wrap; font-size: 14px;">
            ${email ? `<div style="display: flex; align-items: center; gap: 6px;">📧 <span>${escapeHtml(email)}</span></div>` : ''}
            ${phone ? `<div style="display: flex; align-items: center; gap: 6px;">📞 <span>${escapeHtml(phone)}</span></div>` : ''}
        </div>
    `;

    // Зарплата под контактами, без рамки
    let salaryHtml = '';
    if (salary) {
        salaryHtml = `
            <div style="margin-top: 5px; text-align: center;">
                <span style="font-size: 13px; color: #6c757d;">Желаемый уровень дохода: </span>
                <span style="font-size: 16px; font-weight: 500; color: #003467;">${escapeHtml(salary)}</span>
            </div>
        `;
    }

    const resumeHtml = `
        <div id="resumeContent" style="background: white; padding: 30px; max-width: 800px; margin: 0 auto; font-family: 'Segoe UI', Arial, sans-serif;">
            <div style="text-align: center; margin-bottom: 25px;">
                <h1 style="margin-bottom: 5px; font-size: 28px; color: #333;">${escapeHtml(fullName) || 'Ваше Имя'}</h1>
                <h3 style="color: #4361ee; font-size: 18px; margin-bottom: 15px; font-weight: 500;">${escapeHtml(jobTitle) || 'Желаемая должность'}</h3>
                ${contactHtml}
                ${salaryHtml}
            </div>
            <div style="margin-bottom: 25px;">
                <h3 style="border-bottom: 2px solid #4361ee; padding-bottom: 8px; margin-bottom: 15px; color: #333; font-size: 18px;">Опыт работы</h3>
                ${workHtml}
            </div>
            <div style="margin-bottom: 25px;">
                <h3 style="border-bottom: 2px solid #4361ee; padding-bottom: 8px; margin-bottom: 15px; color: #333; font-size: 18px;">Образование</h3>
                ${educationHtml}
            </div>
            <div>
                <h3 style="border-bottom: 2px solid #4361ee; padding-bottom: 8px; margin-bottom: 15px; color: #333; font-size: 18px;">Ключевые навыки</h3>
                ${skillsHtml}
            </div>
        </div>
    `;

    previewDiv.innerHTML = resumeHtml;
}

// ---------- Рендер блоков опыта работы ----------
function renderWorkList() {
    const container = document.getElementById('workList');
    if (!container) return;

    if (workExperiences.length === 0) {
        container.innerHTML = '<p style="color: #999; margin: 10px 0;">Нет опыта работы. Добавьте первый блок.</p>';
        return;
    }

    container.innerHTML = '';
    workExperiences.forEach(exp => {
        const workDiv = document.createElement('div');
        workDiv.style.cssText = 'border: 1px solid #ddd; padding: 12px; margin-bottom: 15px; border-radius: 8px; background: #f9f9f9;';
        workDiv.dataset.id = exp.id;

        const companyInput = document.createElement('input');
        companyInput.type = 'text';
        companyInput.placeholder = 'Компания';
        companyInput.value = exp.company || '';
        companyInput.style.cssText = 'width: 100%; margin-bottom: 8px; padding: 8px; border: 1px solid #ddd; border-radius: 4px;';
        companyInput.addEventListener('input', (e) => {
            updateWorkField(exp.id, 'company', e.target.value);
            saveToLocalStorage();
        });

        const positionInput = document.createElement('input');
        positionInput.type = 'text';
        positionInput.placeholder = 'Должность';
        positionInput.value = exp.position || '';
        positionInput.style.cssText = 'width: 100%; margin-bottom: 8px; padding: 8px; border: 1px solid #ddd; border-radius: 4px;';
        positionInput.addEventListener('input', (e) => {
            updateWorkField(exp.id, 'position', e.target.value);
            saveToLocalStorage();
        });

        const periodInput = document.createElement('input');
        periodInput.type = 'text';
        periodInput.placeholder = 'Период (например, 2020-2023)';
        periodInput.value = exp.period || '';
        periodInput.style.cssText = 'width: 100%; margin-bottom: 8px; padding: 8px; border: 1px solid #ddd; border-radius: 4px;';
        periodInput.addEventListener('input', (e) => {
            updateWorkField(exp.id, 'period', e.target.value);
            saveToLocalStorage();
        });

        const descTextarea = document.createElement('textarea');
        descTextarea.placeholder = 'Обязанности, достижения';
        descTextarea.value = exp.description || '';
        descTextarea.rows = 2;
        descTextarea.style.cssText = 'width: 100%; margin-bottom: 8px; padding: 8px; border: 1px solid #ddd; border-radius: 4px;';
        descTextarea.addEventListener('input', (e) => {
            updateWorkField(exp.id, 'description', e.target.value);
            saveToLocalStorage();
        });

        const removeBtn = document.createElement('button');
        removeBtn.textContent = '✖ Удалить';
        removeBtn.style.cssText = 'background: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;';
        removeBtn.addEventListener('click', () => {
            removeWorkItem(exp.id);
            saveToLocalStorage();
        });

        workDiv.appendChild(companyInput);
        workDiv.appendChild(positionInput);
        workDiv.appendChild(periodInput);
        workDiv.appendChild(descTextarea);
        workDiv.appendChild(removeBtn);
        container.appendChild(workDiv);
    });
}

function updateWorkField(id, field, value) {
    const exp = workExperiences.find(item => item.id === id);
    if (exp) {
        exp[field] = value;
        updatePreview();
    }
}

function removeWorkItem(id) {
    workExperiences = workExperiences.filter(exp => exp.id !== id);
    renderWorkList();
    updatePreview();
}

function addWorkExperience() {
    const newExp = {
        id: generateId(),
        company: '',
        position: '',
        period: '',
        description: ''
    };
    workExperiences.push(newExp);
    renderWorkList();
    updatePreview();
    saveToLocalStorage();
}

// ---------- Рендер блоков образования ----------
function renderEducationList() {
    const container = document.getElementById('educationList');
    if (!container) return;

    if (educationItems.length === 0) {
        container.innerHTML = '<p style="color: #999; margin: 10px 0;">Нет образования. Добавьте первый блок.</p>';
        return;
    }

    container.innerHTML = '';
    educationItems.forEach(edu => {
        const eduDiv = document.createElement('div');
        eduDiv.style.cssText = 'border: 1px solid #ddd; padding: 12px; margin-bottom: 15px; border-radius: 8px; background: #f9f9f9;';
        eduDiv.dataset.id = edu.id;

        const institutionInput = document.createElement('input');
        institutionInput.type = 'text';
        institutionInput.placeholder = 'Учебное заведение';
        institutionInput.value = edu.institution || '';
        institutionInput.style.cssText = 'width: 100%; margin-bottom: 8px; padding: 8px; border: 1px solid #ddd; border-radius: 4px;';
        institutionInput.addEventListener('input', (e) => {
            updateEducationField(edu.id, 'institution', e.target.value);
            saveToLocalStorage();
        });

        const degreeInput = document.createElement('input');
        degreeInput.type = 'text';
        degreeInput.placeholder = 'Специальность / Степень';
        degreeInput.value = edu.degree || '';
        degreeInput.style.cssText = 'width: 100%; margin-bottom: 8px; padding: 8px; border: 1px solid #ddd; border-radius: 4px;';
        degreeInput.addEventListener('input', (e) => {
            updateEducationField(edu.id, 'degree', e.target.value);
            saveToLocalStorage();
        });

        const yearInput = document.createElement('input');
        yearInput.type = 'text';
        yearInput.placeholder = 'Год окончания';
        yearInput.value = edu.year || '';
        yearInput.style.cssText = 'width: 100%; margin-bottom: 8px; padding: 8px; border: 1px solid #ddd; border-radius: 4px;';
        yearInput.addEventListener('input', (e) => {
            updateEducationField(edu.id, 'year', e.target.value);
            saveToLocalStorage();
        });

        const descTextarea = document.createElement('textarea');
        descTextarea.placeholder = 'Дополнительная информация (факультет, достижения)';
        descTextarea.value = edu.description || '';
        descTextarea.rows = 2;
        descTextarea.style.cssText = 'width: 100%; margin-bottom: 8px; padding: 8px; border: 1px solid #ddd; border-radius: 4px;';
        descTextarea.addEventListener('input', (e) => {
            updateEducationField(edu.id, 'description', e.target.value);
            saveToLocalStorage();
        });

        const removeBtn = document.createElement('button');
        removeBtn.textContent = '✖ Удалить';
        removeBtn.style.cssText = 'background: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;';
        removeBtn.addEventListener('click', () => {
            removeEducationItem(edu.id);
            saveToLocalStorage();
        });

        eduDiv.appendChild(institutionInput);
        eduDiv.appendChild(degreeInput);
        eduDiv.appendChild(yearInput);
        eduDiv.appendChild(descTextarea);
        eduDiv.appendChild(removeBtn);
        container.appendChild(eduDiv);
    });
}

function updateEducationField(id, field, value) {
    const edu = educationItems.find(item => item.id === id);
    if (edu) {
        edu[field] = value;
        updatePreview();
    }
}

function removeEducationItem(id) {
    educationItems = educationItems.filter(edu => edu.id !== id);
    renderEducationList();
    updatePreview();
}

function addEducation() {
    const newEdu = {
        id: generateId(),
        institution: '',
        degree: '',
        year: '',
        description: ''
    };
    educationItems.push(newEdu);
    renderEducationList();
    updatePreview();
    saveToLocalStorage();
}

// ---------- Рендер тегов навыков ----------
function renderSkillsTags() {
    const tagsContainer = document.getElementById('skillsTags');
    if (!tagsContainer) return;

    tagsContainer.innerHTML = '';
    skills.forEach((skill, index) => {
        const tagSpan = document.createElement('span');
        tagSpan.style.cssText = 'display: inline-block; background: #e9ecef; padding: 5px 12px; border-radius: 20px; margin: 4px;';
        tagSpan.textContent = skill;
        
        const removeBtn = document.createElement('button');
        removeBtn.textContent = '✖';
        removeBtn.style.cssText = 'background: transparent; color: #666; border: none; cursor: pointer; margin-left: 8px; font-size: 12px;';
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            removeSkill(index);
            saveToLocalStorage();
        });
        
        tagSpan.appendChild(removeBtn);
        tagsContainer.appendChild(tagSpan);
    });

    if (skills.length === 0) {
        const emptyHint = document.createElement('span');
        emptyHint.textContent = 'Нет навыков. Добавьте первый.';
        emptyHint.style.color = '#aaa';
        emptyHint.style.fontSize = '12px';
        tagsContainer.appendChild(emptyHint);
    }
}

function addSkill() {
    const skillInput = document.getElementById('skillInput');
    const newSkill = skillInput.value.trim();
    if (newSkill === '') return;
    if (skills.includes(newSkill)) {
        alert('Этот навык уже добавлен');
        return;
    }
    skills.push(newSkill);
    skillInput.value = '';
    renderSkillsTags();
    updatePreview();
    saveToLocalStorage();
}

function removeSkill(index) {
    skills.splice(index, 1);
    renderSkillsTags();
    updatePreview();
}

// ---------- Сброс всех данных ----------
function resetAllData() {
    if (confirm('Вы уверены, что хотите сбросить все данные? Это действие нельзя отменить.')) {
        fullName = '';
        jobTitle = '';
        salary = '';
        email = '';
        phone = '';
        workExperiences = [];
        educationItems = [];
        skills = [];
        
        document.getElementById('fullName').value = '';
        document.getElementById('jobTitle').value = '';
        document.getElementById('salary').value = '';
        document.getElementById('email').value = '';
        document.getElementById('phone').value = '';
        document.getElementById('skillInput').value = '';
        
        renderWorkList();
        renderEducationList();
        renderSkillsTags();
        updatePreview();
        saveToLocalStorage();
    }
}

// ---------- Прямое скачивание PDF ----------
async function exportToPDF() {
    const resumeElement = document.getElementById('resumeContent');
    if (!resumeElement) {
        alert('Ошибка: содержимое резюме не найдено');
        return;
    }

    if (fullName === '' && jobTitle === '' && workExperiences.length === 0 && educationItems.length === 0 && skills.length === 0) {
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
        
        pdf.save(`resume_${fullName || 'document'}.pdf`);
        
    } catch (error) {
        console.error('Ошибка при создании PDF:', error);
        alert('Ошибка при создании PDF. Попробуйте снова.\n' + error.message);
    } finally {
        exportBtn.innerHTML = originalText;
        exportBtn.disabled = false;
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// ---------- Инициализация ----------
function init() {
    // Загружаем сохранённые данные
    const hasSavedData = loadFromLocalStorage();
    
    const nameInput = document.getElementById('fullName');
    const titleInput = document.getElementById('jobTitle');
    const salaryInput = document.getElementById('salary');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    
    nameInput.addEventListener('input', (e) => { 
        fullName = e.target.value; 
        updatePreview();
        saveToLocalStorage();
    });
    titleInput.addEventListener('input', (e) => { 
        jobTitle = e.target.value; 
        updatePreview();
        saveToLocalStorage();
    });
    salaryInput.addEventListener('input', (e) => { 
        salary = e.target.value; 
        updatePreview();
        saveToLocalStorage();
    });
    emailInput.addEventListener('input', (e) => { 
        email = e.target.value; 
        updatePreview();
        saveToLocalStorage();
    });
    phoneInput.addEventListener('input', (e) => { 
        phone = e.target.value; 
        updatePreview();
        saveToLocalStorage();
    });
    
    document.getElementById('addWork').addEventListener('click', addWorkExperience);
    document.getElementById('addEducation').addEventListener('click', addEducation);
    document.getElementById('addSkill').addEventListener('click', addSkill);
    document.getElementById('resetBtn').addEventListener('click', resetAllData);
    document.getElementById('exportPDF').addEventListener('click', exportToPDF);
    
    const skillInput = document.getElementById('skillInput');
    skillInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); addSkill(); }
    });
    
    renderWorkList();
    renderEducationList();
    renderSkillsTags();
    updatePreview();
    
    if (hasSavedData) {
        console.log('Данные загружены из localStorage');
    }
}

document.addEventListener('DOMContentLoaded', init);