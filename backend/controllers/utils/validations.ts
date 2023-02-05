export type signupData = {
    userEmail: string,
    userPassword: string,
    confirmPassword: string,
    userName: string
}

export type loginData = {
    userEmail: string
    userPassword: string
}

export const applySignupValidations = (data: signupData): boolean => {
    if (
        data.userEmail &&
        data.userPassword &&
        data.confirmPassword &&
        data.userName &&
        data.userPassword === data.confirmPassword
    ) {
        return true
    }

    return false
}

export const applyLoginValidations = (data: loginData): boolean => {
    if (data.userEmail && data.userPassword) {
        return true
    }

    return false
}