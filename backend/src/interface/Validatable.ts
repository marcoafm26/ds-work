export interface ValidationResult {
    isValid: boolean;
    errors: string[];
}

export interface Validatable {
    validate(): ValidationResult;
}
