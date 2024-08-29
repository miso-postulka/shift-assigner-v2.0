import React, { useState } from 'react';
import EmployeeSchedule from './EmployeeSchedule';
import { assignShifts } from './assignShifts';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface Employee {
  name: string;
  availability: number[];
  maxShifts: number;
}

const App: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([
    { name: 'Cen', availability: Array(31).fill(1), maxShifts: 10 },
    { name: 'Dle', availability: Array(31).fill(1), maxShifts: 10 },
    { name: 'Buc', availability: Array(31).fill(1), maxShifts: 10 },
    { name: 'Pos', availability: Array(31).fill(1), maxShifts: 10 },
    { name: 'Chn', availability: Array(31).fill(1), maxShifts: 10 },
    { name: 'Pav', availability: Array(31).fill(1), maxShifts: 10 },
    { name: 'Rep', availability: Array(31).fill(1), maxShifts: 10 },
  ]);

  const [schedule, setSchedule] = useState<(number | null)[]>(Array(31).fill(null));
  const [shiftCounts, setShiftCounts] = useState<number[]>(Array(employees.length).fill(0));

  const handleChangeAvailability = (employeeIndex: number, dayIndex: number) => {
    setEmployees((prevEmployees) => {
      const newEmployees = prevEmployees.map((employee, index) => {
        if (index === employeeIndex) {
          const newAvailability = [...employee.availability];
          newAvailability[dayIndex] = newAvailability[dayIndex] === 1 ? -1 : 1;
          return { ...employee, availability: newAvailability };
        }
        return employee;
      });
      return newEmployees;
    });
  };

  const handleMaxShiftsChange = (employeeIndex: number, value: number) => {
    setEmployees((prevEmployees) => {
      const newEmployees = prevEmployees.map((employee, index) => {
        if (index === employeeIndex) {
          return { ...employee, maxShifts: value };
        }
        return employee;
      });
      return newEmployees;
    });
  };

  const handleGenerateSchedule = () => {
    const result = assignShifts(
      employees.map((emp) => emp.availability),
      employees.map((emp) => emp.maxShifts)
    );
    setSchedule(result);

    // Calculate the shift counts for each employee
    const counts = employees.map((_, index) =>
      result.filter((employeeIndex) => employeeIndex === index).length
    );
    setShiftCounts(counts);
  };

  const handleGeneratePDF = () => {
    const doc = new jsPDF();

    const tableData = schedule
      .map((employeeIndex, day) => {
        if (employeeIndex !== null) {
          return [day + 1, employees[employeeIndex].name];
        }
        return null;
      })
      .filter((row) => row !== null) as [number, string][];

    doc.autoTable({
      body: tableData,
    });

    doc.save('table.pdf');
  };

  return (
    <div className="container-fluid">
      <div className="row d-flex justify-content-start">
        {employees.map((employee, index) => (
          <div key={index} className="col-md-1 pt-3">
            <EmployeeSchedule
              employee={employee}
              employeeIndex={index}
              onChangeAvailability={handleChangeAvailability}
              onMaxShiftsChange={handleMaxShiftsChange}
            />
          </div>
        ))}
      </div>
      <button className="btn btn-primary mt-" onClick={handleGenerateSchedule}>
        Generate Schedule
      </button>
      <button className="btn btn-primary m-4 " onClick={handleGeneratePDF}>
        Generate PDF
      </button>
      <div className="mt-4">
        <h2>Counts</h2>
        <ul className="list-group">
          {employees.map((employee, index) => (
            <li key={index} className="list-group-item">
              {employee.name}: {shiftCounts[index]} shifts assigned
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4">
        <h2>Schedule</h2>
        <ul className="list-group">
          {schedule.map((employeeIndex, day) => (
            <li key={day} className="list-group-item">
              {day + 1}: {employeeIndex !== null ? employees[employeeIndex].name : 'Unassigned'}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
