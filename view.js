//viev - отвечает за отрисовку интерфейса
//все функции здесь только показывают данные, но не меняют их
import { escapeHtml } from './utils.js';

// ---- Отрисовка предпросмотра ----
export function renderPreview(state) {
    const previewDiv = document.getElementById('preview');
    if (!previewDiv) return;

    //достаём все данные из состояния
    const { fullName, jobTitle, salary, email, phone, workExperiences, educationItems, skills } = state;

    //формируем HTML для опыта работы
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

    //формируем HTML для образования
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

    //формируем HTML для навыков
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

    //формируем HTML для контактов
    const contactHtml = `
        <div style="margin: 15px 0 10px 0; color: #6c757d; display: flex; justify-content: center; gap: 24px; flex-wrap: wrap; font-size: 14px;">
            ${email ? `<div style="display: flex; align-items: center; gap: 6px;">📧 <span>${escapeHtml(email)}</span></div>` : ''}
            ${phone ? `<div style="display: flex; align-items: center; gap: 6px;">📞 <span>${escapeHtml(phone)}</span></div>` : ''}
        </div>
    `;
   //формируем HTML для зарплаты (если указана)
    let salaryHtml = '';
    if (salary) {
        salaryHtml = `
            <div style="margin-top: 5px; text-align: center;">
                <span style="font-size: 13px; color: #6c757d;">Желаемый уровень дохода: </span>
                <span style="font-size: 16px; font-weight: 500; color: #003467;">${escapeHtml(salary)}</span>
            </div>
        `;
    }
    //собираем всё вместе
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
    //вставляем готовый HTML в блок предпросмотра
    previewDiv.innerHTML = resumeHtml;
}

// ---- Отрисовка списка опыта работы (для редактирования) ----
export function renderWorkList(workExperiences, callbacks) {
    const container = document.getElementById('workList');
    if (!container) return;

    if (workExperiences.length === 0) {
        container.innerHTML = '<p style="color: #999; margin: 10px 0;">Нет опыта работы. Добавьте первый блок.</p>';
        return;
    }
     //очищаем контейнер
    container.innerHTML = '';
    //для каждого опыта создаём блок с полями для редактирования
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
            callbacks.onUpdate(exp.id, 'company', e.target.value);
        });

        const positionInput = document.createElement('input');
        positionInput.type = 'text';
        positionInput.placeholder = 'Должность';
        positionInput.value = exp.position || '';
        positionInput.style.cssText = 'width: 100%; margin-bottom: 8px; padding: 8px; border: 1px solid #ddd; border-radius: 4px;';
        positionInput.addEventListener('input', (e) => {
            callbacks.onUpdate(exp.id, 'position', e.target.value);
        });

        const periodInput = document.createElement('input');
        periodInput.type = 'text';
        periodInput.placeholder = 'Период (например, 2020-2023)';
        periodInput.value = exp.period || '';
        periodInput.style.cssText = 'width: 100%; margin-bottom: 8px; padding: 8px; border: 1px solid #ddd; border-radius: 4px;';
        periodInput.addEventListener('input', (e) => {
            callbacks.onUpdate(exp.id, 'period', e.target.value);
        });

        const descTextarea = document.createElement('textarea');
        descTextarea.placeholder = 'Обязанности, достижения';
        descTextarea.value = exp.description || '';
        descTextarea.rows = 2;
        descTextarea.style.cssText = 'width: 100%; margin-bottom: 8px; padding: 8px; border: 1px solid #ddd; border-radius: 4px;';
        descTextarea.addEventListener('input', (e) => {
            callbacks.onUpdate(exp.id, 'description', e.target.value);
        });

        const removeBtn = document.createElement('button');
        removeBtn.textContent = '✖ Удалить';
        removeBtn.style.cssText = 'background: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;';
        removeBtn.addEventListener('click', () => {
            callbacks.onRemove(exp.id);
        });
        //собираем блок
        workDiv.appendChild(companyInput);
        workDiv.appendChild(positionInput);
        workDiv.appendChild(periodInput);
        workDiv.appendChild(descTextarea);
        workDiv.appendChild(removeBtn);
        container.appendChild(workDiv);
    });
}

// ---- Отрисовка списка образования (аналогично опыту) ----
export function renderEducationList(educationItems, callbacks) {
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
            callbacks.onUpdate(edu.id, 'institution', e.target.value);
        });

        const degreeInput = document.createElement('input');
        degreeInput.type = 'text';
        degreeInput.placeholder = 'Специальность / Степень';
        degreeInput.value = edu.degree || '';
        degreeInput.style.cssText = 'width: 100%; margin-bottom: 8px; padding: 8px; border: 1px solid #ddd; border-radius: 4px;';
        degreeInput.addEventListener('input', (e) => {
            callbacks.onUpdate(edu.id, 'degree', e.target.value);
        });

        const yearInput = document.createElement('input');
        yearInput.type = 'text';
        yearInput.placeholder = 'Год окончания';
        yearInput.value = edu.year || '';
        yearInput.style.cssText = 'width: 100%; margin-bottom: 8px; padding: 8px; border: 1px solid #ddd; border-radius: 4px;';
        yearInput.addEventListener('input', (e) => {
            callbacks.onUpdate(edu.id, 'year', e.target.value);
        });

        const descTextarea = document.createElement('textarea');
        descTextarea.placeholder = 'Дополнительная информация (факультет, достижения)';
        descTextarea.value = edu.description || '';
        descTextarea.rows = 2;
        descTextarea.style.cssText = 'width: 100%; margin-bottom: 8px; padding: 8px; border: 1px solid #ddd; border-radius: 4px;';
        descTextarea.addEventListener('input', (e) => {
            callbacks.onUpdate(edu.id, 'description', e.target.value);
        });

        const removeBtn = document.createElement('button');
        removeBtn.textContent = '✖ Удалить';
        removeBtn.style.cssText = 'background: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;';
        removeBtn.addEventListener('click', () => {
            callbacks.onRemove(edu.id);
        });

        eduDiv.appendChild(institutionInput);
        eduDiv.appendChild(degreeInput);
        eduDiv.appendChild(yearInput);
        eduDiv.appendChild(descTextarea);
        eduDiv.appendChild(removeBtn);
        container.appendChild(eduDiv);
    });
}

// ---- Отрисовка тегов навыков ----
export function renderSkillsTags(skills, callbacks) {
    const tagsContainer = document.getElementById('skillsTags');
    if (!tagsContainer) return;

    tagsContainer.innerHTML = '';

    //для каждого навыка создаём тег с кнопкой удаления
    skills.forEach((skill, index) => {
        const tagSpan = document.createElement('span');
        tagSpan.style.cssText = 'display: inline-block; background: #e9ecef; padding: 5px 12px; border-radius: 20px; margin: 4px;';
        tagSpan.textContent = skill;
        
        const removeBtn = document.createElement('button');
        removeBtn.textContent = '✖';
        removeBtn.style.cssText = 'background: transparent; color: #666; border: none; cursor: pointer; margin-left: 8px; font-size: 12px;';
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            callbacks.onRemove(index);
        });
        
        tagSpan.appendChild(removeBtn);
        tagsContainer.appendChild(tagSpan);
    });
    //если навыков нет - показываем подсказку
    if (skills.length === 0) {
        const emptyHint = document.createElement('span');
        emptyHint.textContent = 'Нет навыков. Добавьте первый.';
        emptyHint.style.color = '#aaa';
        emptyHint.style.fontSize = '12px';
        tagsContainer.appendChild(emptyHint);
    }
}
