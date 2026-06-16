import { generateId } from './utils.js';

// Состояние приложения
let fullName = '';
let jobTitle = '';
let salary = '';
let email = '';
let phone = '';
let workExperiences = [];
let educationItems = [];
let skills = [];

// ---- Геттеры ----
export function getFullName() { return fullName; }
export function getJobTitle() { return jobTitle; }
export function getSalary() { return salary; }
export function getEmail() { return email; }
export function getPhone() { return phone; }
export function getWorkExperiences() { return workExperiences; }
export function getEducationItems() { return educationItems; }
export function getSkills() { return skills; }

// Получить всё состояние одним объектом
export function getAllState() {
    return { fullName, jobTitle, salary, email, phone, workExperiences, educationItems, skills };
}

// ---- Сеттеры для простых полей ----
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
    workExperiences = workExperiences.filter(exp => exp.id !== id);
    saveToLocalStorage();
}

export function updateWorkField(id, field, value) {
    const exp = workExperiences.find(item => item.id === id);
    if (exp) {
        exp[field] = value;
        saveToLocalStorage();
    }
}

// ---- Работа с образованием ----
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
    if (skill.trim() === '') return false;
    if (skills.includes(skill)) return false;
    skills.push(skill);
    saveToLocalStorage();
    return true;
}

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

// ---- localStorage ----
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
    localStorage.setItem('resumeData', JSON.stringify(data));
}

export function loadFromLocalStorage() {
    const savedData = localStorage.getItem('resumeData');
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            fullName = data.fullName || '';
            jobTitle = data.jobTitle || '';
            salary = data.salary || '';
            email = data.email || '';
            phone = data.phone || '';
            workExperiences = data.workExperiences || [];
            educationItems = data.educationItems || [];
            skills = data.skills || [];
            return true;
        } catch (e) {
            console.error('Ошибка загрузки данных:', e);
        }
    }
    return false;
}