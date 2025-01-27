import bcrypt from "bcrypt"

export const hashPwd = (pwd: string): string => {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(pwd, salt);
    return hash
}