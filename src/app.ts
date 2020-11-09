// Project State Management
class ProjectState {
    private projects: any[] = [];
    private static instance: ProjectState;

    private constructor() {}

    static getInstance() {
        if(ProjectState.instance) {
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance;
    }

    public addProject(title: string, description: string, people: number) {
        const newProject = {
            id: Math.random().toString(),
            title: title,
            description: description,
            people: people
        }
        this.projects.push(newProject);
    }
}

const projectState = ProjectState.getInstance();

// Validation
interface Validatable {
  value: string | number;
  required?: boolean;
  minLenght?: number;
  maxLenght?: number;
  min?: number;
  max?: number;
}

function validate(validatableInput: Validatable): boolean {
  let isValid = true;
  if (validatableInput.required) {
    isValid = isValid && validatableInput.value.toString().trim().length !== 0;
  }
  if (
    validatableInput.minLenght != null &&
    typeof validatableInput.value === "string"
  ) {
    isValid =
      isValid && validatableInput.value.length > validatableInput.minLenght;
  }
  if (
    validatableInput.maxLenght != null &&
    typeof validatableInput.value === "string"
  ) {
    isValid =
      isValid && validatableInput.value.length < validatableInput.maxLenght;
  }
  if (
    validatableInput.min != null &&
    typeof validatableInput.value === "number"
  ) {
    isValid = isValid && validatableInput.value >= validatableInput.min;
  }
  if (
    validatableInput.max != null &&
    typeof validatableInput.value === "number"
  ) {
    isValid = isValid && validatableInput.value <= validatableInput.max;
  }
  return isValid;
}

// Autobind decorateur
function Autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
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
    private templateElement: HTMLTemplateElement;
    private hostElement: HTMLDivElement;
    private listElement: HTMLElement

    constructor(private type: 'active' | 'finished') {
        // get form and app elements
    this.templateElement = document.getElementById(
        'project-list'
      )! as HTMLTemplateElement;
      this.hostElement = document.getElementById("app")! as HTMLDivElement;
  
      // import formElement to a node
      const importedNode = document.importNode(
        this.templateElement.content,
        true
      );
      this.listElement = importedNode.firstElementChild as HTMLElement;
      this.listElement.id = `${type}-projects`;
      this.attach();
      this.renderContent();
    }

    private attach() {
        this.hostElement.insertAdjacentElement('beforeend', this.listElement);
    }

    private renderContent() {
        const listId = `${this.type}-projects-list`;
        this.listElement.querySelector('h2')!.textContent = `${this.type.toUpperCase()} projects`;
        this.listElement.querySelector('ul')!.id = listId;
    }
}

// ProjectInput class
class ProjectInput {
  private templateElement: HTMLTemplateElement;
  private hostElement: HTMLDivElement;
  private formElement: HTMLFormElement;

  private titleInputElement: HTMLInputElement;
  private descriptionInputElement: HTMLInputElement;
  private peopleInputElement: HTMLInputElement;

  constructor() {
    // get form and app elements
    this.templateElement = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById("app")! as HTMLDivElement;

    // import formElement to a node
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.formElement = importedNode.firstElementChild as HTMLFormElement;
    this.formElement.id = "form-project";

    this.titleInputElement = this.formElement.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descriptionInputElement = this.formElement.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.peopleInputElement = this.formElement.querySelector(
      "#people"
    ) as HTMLInputElement;

    this.configure();
    this.attach();
  }

  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true,
      minLenght: 5
    };
    const descriptionValidatable: Validatable = {
      value: enteredDescription,
      required: true,
      minLenght: 5
    };
    const peopleValidatable: Validatable = {
      value: +enteredPeople,
      required: true,
      min: 1,
      max: 5
    };
    if (
      !validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(peopleValidatable)
    ) {
      alert("Invalid input, please try again !");
      return;
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople];
    }
  }

  private clearInputs() {
    this.titleInputElement.value = "";
    this.descriptionInputElement.value = "";
    this.peopleInputElement.value = "";
  }

  @Autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput;
      console.log(title, desc, people);
      this.clearInputs();
    }
  }

  private configure() {
    this.formElement.addEventListener("submit", this.submitHandler);
  }

  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.formElement);
  }
}

const prjInput = new ProjectInput();
const activePrjList = new ProjectList('active');
const finishedPrjList = new ProjectList('finished');