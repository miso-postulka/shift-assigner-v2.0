import React from 'react';

interface EmployeeScheduleProps {
  employee: {
    name: string;
    availability: number[];
    maxShifts: number;
  };
  employeeIndex: number;
  onChangeAvailability: (employeeIndex: number, dayIndex: number) => void;
  onMaxShiftsChange: (employeeIndex: number, value: number) => void;
}

const EmployeeSchedule: React.FC<EmployeeScheduleProps> = ({
  employee,
  employeeIndex,
  onChangeAvailability,
  onMaxShiftsChange,
}) => {
  const getClassForAvailability = (availability: number) => {
    return availability === 1 ? 'btn-success' : 'btn-danger';
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h5 className="card-title">{employee.name}</h5>
        <div className="mb-3">
          <label htmlFor={`maxShifts-${employeeIndex}`} className="form-label">
            Max Shifts
          </label>
          <input
            type="number"
            id={`maxShifts-${employeeIndex}`}
            className="form-control"
            value={employee.maxShifts}
            onChange={(e) => onMaxShiftsChange(employeeIndex, parseInt(e.target.value))}
          />
        </div>
        <div className="d-grid gap-2">
          {employee.availability.map((day, dayIndex) => (
            <button
              key={dayIndex}
              className={`btn ${getClassForAvailability(day)}`}
              onClick={() => onChangeAvailability(employeeIndex, dayIndex)}
            >
              {dayIndex + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeeSchedule;
