const state = {
  employees: [],
  attendance: [],
  leaveRequests: []
};

const money = new Intl.NumberFormat("bn-BD", {
  style: "currency",
  currency: "BDT",
  maximumFractionDigits: 0
});

const employeeForm = document.getElementById("employee-form");
const attendanceForm = document.getElementById("attendance-form");
const leaveForm = document.getElementById("leave-form");

const employeesEl = document.getElementById("employees");
const attendanceEl = document.getElementById("attendance-log");
const leaveEl = document.getElementById("leave-log");

const attendanceEmployee = document.getElementById("attendance-employee");
const leaveEmployee = document.getElementById("leave-employee");

const totalEmployeesEl = document.getElementById("total-employees");
const totalPayrollEl = document.getElementById("total-payroll");

function employeeOption(employee) {
  const option = document.createElement("option");
  option.value = employee.id;
  option.textContent = `${employee.name} (${employee.role})`;
  return option;
}

function refreshEmployeeSelectors() {
  attendanceEmployee.innerHTML = "";
  leaveEmployee.innerHTML = "";

  state.employees.forEach((employee) => {
    attendanceEmployee.append(employeeOption(employee));
    leaveEmployee.append(employeeOption(employee));
  });
}

function renderEmployees() {
  employeesEl.innerHTML = "";

  state.employees.forEach((employee) => {
    const item = document.createElement("div");
    item.className = "item";
    item.innerHTML = `<strong>${employee.name}</strong> - ${employee.role}<br/><small>${money.format(employee.salary)}/month</small>`;
    employeesEl.append(item);
  });

  totalEmployeesEl.textContent = String(state.employees.length);
  const payroll = state.employees.reduce((sum, employee) => sum + employee.salary, 0);
  totalPayrollEl.textContent = money.format(payroll);
}

function renderAttendance() {
  attendanceEl.innerHTML = "";

  state.attendance.slice(-8).reverse().forEach((entry) => {
    const item = document.createElement("div");
    item.className = "item";
    item.innerHTML = `<strong>${entry.name}</strong> - ${entry.status}<br/><small>${entry.date}</small>`;
    attendanceEl.append(item);
  });
}

function renderLeave() {
  leaveEl.innerHTML = "";

  state.leaveRequests.slice(-8).reverse().forEach((entry) => {
    const item = document.createElement("div");
    item.className = "item";
    item.innerHTML = `<strong>${entry.name}</strong><br/><small>${entry.reason}</small>`;
    leaveEl.append(item);
  });
}

employeeForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const role = document.getElementById("role").value.trim();
  const salary = Number(document.getElementById("salary").value);

  if (!name || !role || salary <= 0) return;

  state.employees.push({
    id: crypto.randomUUID(),
    name,
    role,
    salary
  });

  employeeForm.reset();
  refreshEmployeeSelectors();
  renderEmployees();
});

attendanceForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const id = attendanceEmployee.value;
  const status = document.getElementById("attendance-status").value;
  const employee = state.employees.find((member) => member.id === id);
  if (!employee) return;

  state.attendance.push({
    name: employee.name,
    status,
    date: new Date().toLocaleString()
  });

  renderAttendance();
});

leaveForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const id = leaveEmployee.value;
  const reason = document.getElementById("leave-reason").value.trim();
  const employee = state.employees.find((member) => member.id === id);
  if (!employee || !reason) return;

  state.leaveRequests.push({
    name: employee.name,
    reason
  });

  leaveForm.reset();
  renderLeave();
});

refreshEmployeeSelectors();
renderEmployees();
renderAttendance();
renderLeave();
