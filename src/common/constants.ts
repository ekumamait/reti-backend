export const USER_ROLES = {
  YOUTH: 'youth',
  MENTOR: 'mentor',
  EMPLOYER: 'employer',
};

export const ERROR_MESSAGES = {
  USER_NOT_FOUND: (email: string) => `User with email ${email} not found`,
  PROFILE_NOT_FOUND: (id: number) => `Profile with ID ${id} not found`,
  USER_ALREADY_EXISTS: (email: string) =>
    `User with email ${email} already exists`,
  USER_ROLE_FOUND: (role: string) => `User with role ${role} not found`,
  USER_ID_NOT_FOUND: (userId: number) => `User with id ${userId} not found`,
};

// Add more constants as needed
