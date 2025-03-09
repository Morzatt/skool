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