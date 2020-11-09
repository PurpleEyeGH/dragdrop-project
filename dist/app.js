"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// Project State Management
class ProjectState {
    constructor() {
        this.listeners = [];
        this.projects = [];
    }
    static getInstance() {
        if (ProjectState.instance) {
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance;
    }
    addListener(listenerFn) {
        this.listeners.push(listenerFn);
    }
    addProject(title, description, people) {
        const newProject = {
            id: Math.random().toString(),
            title: title,
            description: description,
            people: people,
        };
        this.projects.push(newProject);
        for (const listenersFn of this.listeners) {
            listenersFn(this.projects.slice());
        }
    }
}
const projectState = ProjectState.getInstance();
function validate(validatableInput) {
    let isValid = true;
    if (validatableInput.required) {
        isValid = isValid && validatableInput.value.toString().trim().length !== 0;
    }
    if (validatableInput.minLenght != null &&
        typeof validatableInput.value === "string") {
        isValid =
            isValid && validatableInput.value.length > validatableInput.minLenght;
    }
    if (validatableInput.maxLenght != null &&
        typeof validatableInput.value === "string") {
        isValid =
            isValid && validatableInput.value.length < validatableInput.maxLenght;
    }
    if (validatableInput.min != null &&
        typeof validatableInput.value === "number") {
        isValid = isValid && validatableInput.value >= validatableInput.min;
    }
    if (validatableInput.max != null &&
        typeof validatableInput.value === "number") {
        isValid = isValid && validatableInput.value <= validatableInput.max;
    }
    return isValid;
}
// Autobind decorateur
function Autobind(_, _2, descriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        },
    };
    return adjDescriptor;
}
// ProjectList Class
class ProjectList {
    constructor(type) {
        this.type = type;
        // get form and app elements
        this.templateElement = document.getElementById("project-list");
        this.hostElement = document.getElementById("app");
        this.assignedProjects = [];
        // import formElement to a node
        const importedNode = document.importNode(this.templateElement.content, true);
        this.listElement = importedNode.firstElementChild;
        this.listElement.id = `${type}-projects`;
        projectState.addListener((projects) => {
            this.assignedProjects = projects;
            this.renderProjects();
        });
        this.attach();
        this.renderContent();
    }
    renderProjects() {
        const listEl = document.getElementById(`${this.type}-projects-list`);
        for (const prjItem of this.assignedProjects) {
            const listItem = document.createElement('li');
            listItem.textContent = prjItem.title;
            listEl.appendChild(listItem);
        }
    }
    renderContent() {
        const listId = `${this.type}-projects-list`;
        this.listElement.querySelector("h2").textContent = `${this.type.toUpperCase()} projects`;
        this.listElement.querySelector("ul").id = listId;
    }
    attach() {
        this.hostElement.insertAdjacentElement("beforeend", this.listElement);
    }
}
// ProjectInput class
class ProjectInput {
    constructor() {
        // get form and app elements
        this.templateElement = document.getElementById("project-input");
        this.hostElement = document.getElementById("app");
        // import formElement to a node
        const importedNode = document.importNode(this.templateElement.content, true);
        this.formElement = importedNode.firstElementChild;
        this.formElement.id = "form-project";
        this.titleInputElement = this.formElement.querySelector("#title");
        this.descriptionInputElement = this.formElement.querySelector("#description");
        this.peopleInputElement = this.formElement.querySelector("#people");
        this.configure();
        this.attach();
    }
    gatherUserInput() {
        const enteredTitle = this.titleInputElement.value;
        const enteredDescription = this.descriptionInputElement.value;
        const enteredPeople = this.peopleInputElement.value;
        const titleValidatable = {
            value: enteredTitle,
            required: true,
            minLenght: 5,
        };
        const descriptionValidatable = {
            value: enteredDescription,
            required: true,
            minLenght: 5,
        };
        const peopleValidatable = {
            value: +enteredPeople,
            required: true,
            min: 1,
            max: 5,
        };
        if (!validate(titleValidatable) ||
            !validate(descriptionValidatable) ||
            !validate(peopleValidatable)) {
            alert("Invalid input, please try again !");
            return;
        }
        else {
            return [enteredTitle, enteredDescription, +enteredPeople];
        }
    }
    clearInputs() {
        this.titleInputElement.value = "";
        this.descriptionInputElement.value = "";
        this.peopleInputElement.value = "";
    }
    submitHandler(event) {
        event.preventDefault();
        const userInput = this.gatherUserInput();
        if (Array.isArray(userInput)) {
            const [title, desc, people] = userInput;
            projectState.addProject(title, desc, people);
            this.clearInputs();
        }
    }
    configure() {
        this.formElement.addEventListener("submit", this.submitHandler);
    }
    attach() {
        this.hostElement.insertAdjacentElement("afterbegin", this.formElement);
    }
}
__decorate([
    Autobind
], ProjectInput.prototype, "submitHandler", null);
const prjInput = new ProjectInput();
const activePrjList = new ProjectList("active");
const finishedPrjList = new ProjectList("finished");
