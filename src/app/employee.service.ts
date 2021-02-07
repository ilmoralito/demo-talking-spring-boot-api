import { Injectable } from '@angular/core';
import { IEmployee } from './employee';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiEndpoint = environment.apiBaseUrl;

  constructor(private httpClient: HttpClient) {}

  getEmployee(id: number): Observable<IEmployee> {
    return this.httpClient.get<IEmployee>(`${this.apiEndpoint}/employees${id}`);
  }

  getEmployees(): Observable<IEmployee[]> {
    return this.httpClient.get<IEmployee[]>(`${this.apiEndpoint}/employees`);
  }

  addEmployee(employee: IEmployee): Observable<IEmployee> {
    return this.httpClient.post<IEmployee>(
      `${this.apiEndpoint}/employees`,
      employee
    );
  }

  updateEmployee(id: number, employee: IEmployee): Observable<IEmployee> {
    return this.httpClient.put<IEmployee>(
      `${this.apiEndpoint}/employees/${id}`,
      employee
    );
  }

  deleteEmployee(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiEndpoint}/employees/${id}`);
  }
}
