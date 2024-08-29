export const assignShifts = (
  availability: number[][],
  maxShifts: number[]
): (number | null)[] => {
  const assignedShifts: (number | null)[] = Array(availability[0].length).fill(null);
  const lastShiftAssigned: number[] = Array(availability.length).fill(-1);
  const shiftsCount: number[] = Array(availability.length).fill(0);

  for (let day = 0; day < availability[0].length; day++) {
    let candidate = -1;
    let maxRestDays = -1;

    for (let employee = 0; employee < availability.length; employee++) {
      if (availability[employee][day] === 1 && shiftsCount[employee] < maxShifts[employee]) {
        const restDays = day - lastShiftAssigned[employee];
        if (
          restDays > maxRestDays ||
          (restDays === maxRestDays && shiftsCount[employee] < shiftsCount[candidate])
        ) {
          candidate = employee;
          maxRestDays = restDays;
        }
      }
    }

    if (candidate !== -1) {
      assignedShifts[day] = candidate;
      lastShiftAssigned[candidate] = day;
      shiftsCount[candidate]++;
    }
  }

  return assignedShifts;
};
