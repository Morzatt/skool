import { differenceInYears, differenceInMonths, isValid, parse } from 'date-fns';

export function getAge(birthDate: string) {
    const birthday = new Date(birthDate);
    const today = new Date();
    let ageDifMs = today.getTime() - birthday.getTime();
    let ageYearInMs = 365 * 24 * 60 * 60 * 1000;
    if (today.getFullYear() % 4 === 0 && today.getFullYear() % 100 !== 0 || today.getFullYear() % 400 === 0) {
        ageYearInMs = 366 * 24 * 60 * 60 * 1000;
    }

    let age = Math.floor(ageDifMs / ageYearInMs);

    const monthDiff = today.getMonth() - birthday.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthday.getDate())) {
        age--;
    }

    return age.toString();
}

export function calculateTime(dateString: string): string {
  const regex = /^(\d{4}|\d{2})-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) {
    return "Error: Formato de fecha inválido. Se esperaba 'YY-MM-DD' o 'YYYY-MM-DD'.";
  }
  const yearPart = dateString.split('-')[0];
  const parseFormat = yearPart.length === 4 ? 'yyyy-MM-dd' : 'yy-MM-dd';

  const inputDate = parse(dateString, parseFormat, new Date());
  if (!isValid(inputDate)) {
    return "Error: La fecha proporcionada es inválida (ej. día o mes inexistente).";
  }

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const inputDateOnly = new Date(inputDate);
  inputDateOnly.setHours(0, 0, 0, 0);

  if (inputDateOnly > currentDate) {
     return "Error: La fecha proporcionada es futura.";
  }

  const now = new Date();
  const yearsPassed = differenceInYears(now, inputDate);
  const monthsPassed = differenceInMonths(now, inputDate);

  if (yearsPassed >= 1) {
    return `${yearsPassed} ${yearsPassed === 1 ? 'año' : 'años'}`;
  } else if (monthsPassed >= 1) {
    return `${monthsPassed} ${monthsPassed === 1 ? 'mes' : 'meses'}`;
  } else {
    return "Menos de un mes";
  }
}