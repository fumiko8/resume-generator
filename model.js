//модель - хранит все данные и работает с localStorage
//все изменения данных проходят через этот файл
import { generateId } from './utils.js';

//состояние приложения - все данные, которые мы храним
let fullName = '';
let jobTitle = '';
let salary = '';
let email = '';
let phone = '';
let workExperiences = [];
let educationItems = [];
let skills = [];

// ---- Геттеры (получить данные)----
export function getFullName() { return fullName; }
export function getJobTitle() { return jobTitle; }
export function getSalary() { return salary; }
export function getEmail() { return email; }
export function getPhone() { return phone; }
export function getWorkExperiences() { return workExperiences; }
export function getEducationItems() { return educationItems; }
export function getSkills() { return skills; }

//получить всё состояние одним объектом
export function getAllState() {
    return { fullName, jobTitle, salary, email, phone, workExperiences, educationItems, skills };
}

// ---- Сеттеры для простых полей(установить данные) ----
//каждый раз при изменении сохраняем в localStorage
export function setFullName(value) {
    fullName = value;
    saveToLocalStorage();
}

export function setJobTitle(value) {
    jobTitle = value;
    saveToLocalStorage();
}

export function setSalary(value) {
    salary = value;
    saveToLocalStorage();
}

export function setEmail(value) {
    email = value;
    saveToLocalStorage();
}

export function setPhone(value) {
    phone = value;
    saveToLocalStorage();
}

// ---- Работа с опытом работы ----
export function addWorkExperience() {
    //создаём новый объект с пустыми полями и уникальным id и сразу сохраняем
    const newExp = {
        id: generateId(),
        company: '',
        position: '',
        period: '',
        description: ''
    };
    workExperiences.push(newExp);
    saveToLocalStorage();
}

export function removeWorkItem(id) {
    //оставляем только те элементы, у которых id не совпадает
    workExperiences = workExperiences.filter(exp => exp.id !== id);
    saveToLocalStorage();
}

export function updateWorkField(id, field, value) {
    //находим нужный опыт по id и обновляем поле
    const exp = workExperiences.find(item => item.id === id);
    if (exp) {
        exp[field] = value;
        saveToLocalStorage();
    }
}

// ---- Работа с образованием  (аналогично опыту) ----
export function addEducation() {
    const newEdu = {
        id: generateId(),
        institution: '',
        degree: '',
        year: '',
        description: ''
    };
    educationItems.push(newEdu);
    saveToLocalStorage();
}

export function removeEducationItem(id) {
    educationItems = educationItems.filter(edu => edu.id !== id);
    saveToLocalStorage();
}

export function updateEducationField(id, field, value) {
    const edu = educationItems.find(item => item.id === id);
    if (edu) {
        edu[field] = value;
        saveToLocalStorage();
    }
}

// ---- Навыки ----
export function addSkill(skill) {
    //проверяем, что навык не пустой и не дублируется, возвращаем true, если добавили успешно
    if (skill.trim() === '') return false;
    if (skills.includes(skill)) return false;
    skills.push(skill);
    saveToLocalStorage();
    return true;
}

//удаляем по индексу в массиве
export function removeSkill(index) {
    skills.splice(index, 1);
    saveToLocalStorage();
}

// ---- Сброс ----
export function resetData() {
    fullName = '';
    jobTitle = '';
    salary = '';
    email = '';
    phone = '';
    workExperiences = [];
    educationItems = [];
    skills = [];
    saveToLocalStorage();
}

// ---- localStorage (сохранение и загрузка) ----
export function saveToLocalStorage() {
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
    //превращаем объект в JSON строку и сохраняем
    localStorage.setItem('resumeData', JSON.stringify(data));
}

export function loadFromLocalStorage() {
    const savedData = localStorage.getItem('resumeData');
    if (savedData) {
        try {
            //превращаем JSON строку обратно в объект
            const data = JSON.parse(savedData);
            fullName = data.fullName || '';
            jobTitle = data.jobTitle || '';
            salary = data.salary || '';
            email = data.email || '';
            phone = data.phone || '';
            workExperiences = data.workExperiences || [];
            educationItems = data.educationItems || [];
            skills = data.skills || [];
            return true; // данные загружены
        } catch (e) {
            console.error('Ошибка загрузки данных:', e);
        }
    }
    return false; // данных нет или ошибк
}
