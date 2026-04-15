import prisma from "../db.server";

type RegistrationInput = {
  name: string;
  email: string;
  phone: string;
  orderNumber: string;
  kitRegistrationNumber: string;
};

export type RegistrationFormState = RegistrationInput;

export type RegistrationFormErrors = Partial<Record<keyof RegistrationInput, string>>;

export function getRegistrationDefaults(): RegistrationFormState {
  return {
    name: "",
    email: "",
    phone: "",
    orderNumber: "",
    kitRegistrationNumber: "",
  };
}

export function validateRegistration(
  input: Partial<RegistrationInput>,
): RegistrationFormErrors | null {
  const errors: RegistrationFormErrors = {};

  if (!input.name?.trim()) {
    errors.name = "Name is required.";
  }

  if (!input.email?.trim()) {
    errors.email = "Email is required.";
  }

  if (!input.phone?.trim()) {
    errors.phone = "Phone is required.";
  }

  if (!input.orderNumber?.trim()) {
    errors.orderNumber = "Order number is required.";
  }

  if (!input.kitRegistrationNumber?.trim()) {
    errors.kitRegistrationNumber = "Kit registration number is required.";
  }

  return Object.keys(errors).length ? errors : null;
}

export async function saveRegistration(input: RegistrationInput) {
  return prisma.registration.create({
    data: {
      name: input.name.trim(),
      email: input.email.trim(),
      phone: input.phone.trim(),
      orderNumber: input.orderNumber.trim(),
      kitRegistrationNumber: input.kitRegistrationNumber.trim(),
    },
  });
}
