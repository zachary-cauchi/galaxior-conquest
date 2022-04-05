import ballerinax/mysql.driver as _;
import ballerinax/mysql;
import ballerina/sql as sql;
import ballerina/time;
import ballerina/http;

# Represents a standard employee.
#
# + employee_id - The employee's Id. Must be unique.
# + first_name - The Employee's first name.
# + last_name - The employee's last name.
# + email - Their work email address.
# + phone - Their work phone number
# + hire_date - The date when this employee was registered.
# + manager_id - The ID of their manager. This is the manager's employee_id.
# + job_title - Their job title.
public type Employee record {|
    int employee_id?;
    string first_name;
    string last_name;
    string email;
    string phone;
    time:Date hire_date;
    int? manager_id;
    string job_title;
|};

configurable string USER = ?;
configurable string PASSWORD = ?;
configurable string HOST = ?;
configurable int PORT = ?;
configurable string DATABASE = ?;

final mysql:Client dbClient = check new(
    host=HOST, user=USER, password=PASSWORD, port=PORT, database=DATABASE
);

# The REST API endpoint for this Employee table. Provides all basic CRUD operations.
service /employees on new http:Listener(8080) {

    isolated resource function post .(@http:Payload Employee emp) returns int|error? {
        return addEmployee(emp);
    }

    isolated resource function get [int id]() returns Employee|error? {
        return getEmployee(id);
    }

    isolated resource function get .() returns Employee[]|error? {
        return getAllEmployees();
    }

    isolated resource function put .(@http:Payload Employee emp) returns int|error? {
        return updateEmployee(emp);
    }

    isolated resource function delete [int id]() returns int|error? {
        return removeEmployee(id);
    }

}


# Add an employee to the table.
#
# + emp - The employee to insert.
# + return - Return their id on success
#            or an error on failure.
isolated function addEmployee(Employee emp) returns int|error {
    sql:ParameterizedQuery query = `
        INSERT INTO Employees (employee_id, first_name, last_name, email, phone,
                               hire_date, manager_id, job_title)
        VALUES (${emp.employee_id}, ${emp.first_name}, ${emp.last_name},
                ${emp.email}, ${emp.phone}, ${emp.hire_date}, ${emp.manager_id},
                ${emp.job_title})
    `;
    sql:ExecutionResult result = check dbClient->execute(query);
    int|string? lastInsertId = result.lastInsertId;

    if lastInsertId is int {
        return lastInsertId;
    } else {
        return error("Unable to obtain last insert ID");
    }
}

# Get an employee by their id.
#
# + id - The Id to search for.
# + return - The employee matching that Id, or an error.
isolated function getEmployee(int id) returns Employee|error {
    sql:ParameterizedQuery query = `SELECT * FROM Employees WHERE employee_id = ${id}`;
    Employee employee = check dbClient->queryRow(query);
    return employee;
}

# Get all the employees in the table.
# + return - An array of all stored employees, or an error.
isolated function getAllEmployees() returns Employee[]|error {
    Employee[] employees = [];
    stream<Employee, error?> resultStream = dbClient->query(`SELECT * FROM Employees`);

    check from Employee employee in resultStream
        do {
            employees.push(employee);
        };
    check resultStream.close();
    return employees;
}

# Update an employee with new property values.
#
# + emp - A new employee with the Id of the old employee.
# + return - The Id of the updated employee, or an error.
isolated function updateEmployee(Employee emp) returns int|error {
    sql:ParameterizedQuery query = `
        UPDATE Employees SET
            first_name = ${emp.first_name},
            last_name = ${emp.last_name},
            email = ${emp.email},
            phone = ${emp.phone},
            hire_date = ${emp.hire_date},
            manager_id = ${emp.manager_id},
            job_title = ${emp.job_title}
        WHERE employee_id = ${emp.employee_id}
    `;
    sql:ExecutionResult result = check dbClient->execute(query);
    int|string? lastInsertId = result.lastInsertId;

    if lastInsertId is int {
        return lastInsertId;
    } else {
        return error("Unable to obtain last insert ID");
    }
}

# Delete an employee from the database by their Id.
#
# + id - The id of the employee to delete.
# + return - The number of deleted rows:
#            1 if an employee was deleted.
#            0 if no employee was found.
#            An error otherwise.
isolated function removeEmployee(int id) returns int|error {
    sql:ParameterizedQuery query = `DELETE FROM Employees WHERE employee_id = ${id}`;
    sql:ExecutionResult result = check dbClient->execute(query);
    int? affectedRowCount = result.affectedRowCount;

    if affectedRowCount is int {
        return affectedRowCount;
    } else {
        return error("Unable to obtain the affected row count");
    }
}
