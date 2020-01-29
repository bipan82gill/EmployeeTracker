var inquirer = require('inquirer');
var express = require("express");
var mysql = require("mysql");
const consoleTable = require('console.table');

var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "root",
    database: "employees_DB"
  });
  
  connection.connect(function(err) {
    if (err) throw err;
    enterData();
  });
  function enterData(){
    inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        "Add New Deaprtment",
        "Add New Role",
        "Add New Employee",
        "Update Employee",
        "Delete Employee",
        "View employees Data"
               
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
      case "Add New Deaprtment":
       addDepartment();
        break;

      case "Add New Role":
        addRole();
        break;

      case "Add New Employee":
        addEmployee();
        break;

      case "Update Employee":
        updateEmployee();
        break;

      case "Delete Employee":
        deleteEmployee();
        break;

      case "View employees Data":
        viewData();
        break;
    
      }
    });
}
    
function addDepartment() {
    inquirer
      .prompt({
        name: "department",
        type: "input",
        message: "Which manager  you want to assign for department?"
      })
      .then(function(answer) {
        var query = "INSERT INTO department(name)values(?)";
        connection.query(query, [answer.department], function(err, res) {
          console.table({
            "name": answer.department
          });
          enterData();
        });
      });
  }

  function addRole() {
    inquirer
      .prompt([{
        name: "role",
        type: "input",
        message: "Enter Role Title:"
      },{
        name: "salary",
        type: "input",
        message: "Enter salary:"
      }]
      )
      .then(function(answer) {
        var query = "INSERT INTO role(title, salary) VALUES(?, ?)";
        connection.query(query, [answer.role, answer.salary], function(err, res) {
          console.table({
            "Title":answer.role,
            "Salary":answer.salary
          });
          enterData();
        });
      });
  }

  function addEmployee() {
    inquirer
      .prompt([{
        name: "firstName",
        type: "input",
        message: "Enter First Name:"
      },
     {  name: "lastName",
        type: "input",
        message: "Enter Last Name:"
      },
      { 
        name: "role_Id",
        type: "input",
        message: "Enter Role_Id:"
       
      },
      {  
        name: "manager_Id",
        type: "input",
        message: "Enter Manager_Id:"
        
      }]
      )
      .then(function(answer) {
          var query ="INSERT INTO employee(first_name, last_name, role_id, manager_id)values(?, ?, ?, ?)";
          connection.query(query,
            [
                answer.firstName,
                answer.lastName,
                answer.role_Id, 
                answer.manager_Id
            ], function(err,res){
                if(err) throw err;
                console.table({
                "First_Name":  answer.firstName,
                "Last_Name":answer.lastName,
                "Role_ID":answer.role_Id, 
                "Manager_ID":answer.manager_Id
                })
                enterData();
          });      
          
        });
      
  }

  function updateEmployee() {
    inquirer
      .prompt([{
                    name: "table",
                    type: "input",
                    message: "Which Table you want to change?"
              },
              {
                    name: "field",
                    type: "input",
                    message: "Enter field name:"

                },
                {
                  name: "value",
                  type: "input",
                  message: "Enter value that you want to set:"

              },
                {
                    name: "id",
                    type: "input",
                    message: "Enter  Id:"

                }]).then(function(answer){
                    var query = "update ? set ? = ? where id =?;"
        connection.query(query, [answer.table, answer.field, answer.value, answer.id], function(err, res) {
          if(err) throw err;
          console.table(res);
        
          enterData(); 
                });
      });
    }
    


function deleteEmployee(){
        inquirer
       .prompt([{
                name: "table",
                type: "input",
                message: "Which TABLE record you want to delete?"
              },
              {
                name: "record",
                type: "input",
                message: "Which record you want to delete?" 
              }]
              )
              .then(function(answer) {
                var query = "DELETE FROM ? WHERE id = ?";
                connection.query(query, [answer.table, answer.record], function(err, res) {
                  console.table({
                    "table":answer.table,
                    "id":answer.record
                  })
                  enterData();
                });
              });

 }   
function viewData(){
  inquirer
  .prompt([{
           name: "info",
           type: "input",
           message: "Which information  you want to select?"
         },
         {
          name: "table",
           type: "input",
           message: "Which table  you want to view?"
         },
         {
           name: "condition",
           type: "input",
           message: "Which condition you want to apply?" 
         }]
         )
         .then(function(answer) {
           var query = "Select employee.first_name, employee.last_name, role.title, role.salary from employee, role where employee.role_id = role.id;";
           connection.query(query,function(err, res) {
             enterData();
           });
         });
        //  SELECT 	employee.first_name,employee.last_name, role.title, department.name from employee, role, department where role.id = department.id; 
        }