import { Component, OnInit } from '@angular/core';
import { EmployeeService } from './employee.service';
import { IEmployee } from './employee';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { error } from 'protractor';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  filterText: string = '';
  id: number;
  employee: IEmployee;
  employees: IEmployee[];
  addEmployeeForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    jobTitle: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    imageUrl: new FormControl('', Validators.required),
  });
  editEmployeeForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    jobTitle: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    imageUrl: new FormControl('', Validators.required),
  });
  displayAddEmployeeModal: boolean = false;
  displayEditEmployeeModal: boolean = false;

  constructor(
    private employeeServcie: EmployeeService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.getEmployees();
  }

  getEmployees(): void {
    this.employeeServcie.getEmployees().subscribe(
      (employees: IEmployee[]) => (this.employees = employees),
      (error: HttpErrorResponse) => console.error(error.message)
    );
  }

  onAddEmployee(): void {
    this.displayAddEmployeeModal = !this.displayAddEmployeeModal;
  }

  onEditEmployee(employee: IEmployee): void {
    this.displayEditEmployeeModal = !this.displayEditEmployeeModal;
    this.id = employee.id;
    this.editEmployeeForm.setValue({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      jobTitle: employee.jobTitle,
      phone: employee.phone,
      imageUrl: employee.imageUrl,
    });
  }

  onSubmit(): void {
    const employee: IEmployee = this.addEmployeeForm.value;

    this.employeeServcie
      .addEmployee(employee)
      .subscribe((employee: IEmployee) => {
        this.addEmployeeForm.reset();
        this.employees = [...this.employees, employee];
      });
  }

  onUpdate(): void {
    const employee: IEmployee = this.editEmployeeForm.value;

    this.employeeServcie.updateEmployee(this.id, employee).subscribe(
      (employee: IEmployee) =>
        (this.employees = this.employees.map((entry) =>
          entry.id === employee.id ? { ...employee } : { ...entry }
        )),
      (error: HttpErrorResponse) => console.error(error.message)
    );

    this.id = null;
    this.displayEditEmployeeModal = false;
  }

  confirm(employee: IEmployee): void {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to perform this action?',
      accept: () => {
        this.employeeServcie
          .deleteEmployee(employee.id)
          .subscribe(
            () =>
              (this.employees = this.employees.filter(
                (entry: IEmployee) => entry.id !== employee.id
              ))
          );
      },
    });
  }

  getEmployeeList(): IEmployee[] {
    return this.employees.filter(
      (employee: IEmployee) =>
        employee.firstName
          .toLowerCase()
          .includes(this.filterText.toLowerCase()) ||
        employee.lastName.toLowerCase().includes(this.filterText.toLowerCase())
    );
  }
}
