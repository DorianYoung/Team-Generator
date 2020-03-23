const fs = require("fs");
const inquirer = require("inquirer");
const path = require("path");
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");
const render = require("./lib/htmlRenderer");

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)
const collectInputs = async (inputs = []) => {
  const prompts = [
    {
      type: "list",
      message: "What is your role?",
      choices: ["Manager", "Engineer", "Employee", "Intern"],
      name: "role"
    },
    {
      message: "Please enter your name",
      name: "name"
    },
    {
      message: "Please enter your Identication #",
      name: "id"
    },
    {
      message: "Please enter your email address",
      name: "email"
    },
    {
      message: "Please enter your office number",
      name: "officeNumber",
      when: function(answers) {
        const roleSpecific = answers.role == "Manager";
        return roleSpecific;
      }
    },
    {
      message: "Please enter your github username",
      name: "github",
      when: function(answers) {
        const roleSpecific = answers.role == "Engineer";
        return roleSpecific;
      }
    },
    {
      message: "Please enter the school you attend",
      name: "school",
      when: function(answers) {
        const roleSpecific = answers.role == "Intern";
        return roleSpecific;
      }
    },
    {
      type: "confirm",
      name: "again",
      message: "Enter another user? ",
      default: true
    }
  ];

  const { again, ...answers } = await inquirer.prompt(prompts);
  const newInputs = [...inputs, answers];
  return again ? collectInputs(newInputs) : newInputs;
};

const generate = async () => {
  const employees = await collectInputs();
  console.log(employees);

  var employeeObjects = [];
  employees.forEach(employee => {
    switch (employee.role) {
      case "Manager":
        employeeObjects.push(
          new Manager(
            employee.name,
            employee.id,
            employee.email,
            employee.officeNumber
          )
        );
        break;
      case "Engineer":
        employeeObjects.push(
          new Engineer(
            employee.name,
            employee.id,
            employee.email,
            employee.github
          )
        );
        break;
      case "Employee":
        employeeObjects.push(
          new Employee(employee.name, employee.id, employee.email)
        );
        break;
      case "Intern":
        employeeObjects.push(
          new Intern(
            employee.name,
            employee.id,
            employee.email,
            employee.school
          )
        );
        break;
    }
  });
  const html = render(employeeObjects);
  fs.writeFileSync("./output.html", html, "utf-8");
  // return html;
};

generate();