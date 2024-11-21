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
  USERS_NOT_FOUND: () => `There are currently no users`,
};

export const SUCCESS_MESSAGES = {
  USER_CREATED: 'User successfully created',
  USER_UPDATED: 'User successfully updated',
  USER_DELETED: 'User successfully deleted',
  PROFILE_CREATED: 'Profile successfully created',
  PROFILE_UPDATED: 'Profile successfully updated',
  PROFILE_DELETED: 'Profile successfully deleted',
  USER_FOUND: (id: number) => `User with ID ${id} fetched successfully`,
  PROFILE_FOUND: (id: number) => `Profile with ID ${id} fetched successfully`,
  USER_EMAIL_FOUND: (email: string) =>
    `User with Email ${email} fetched successfully`,
  USERS_FOUND: 'Users fetched successfully',
  PROFILES_FOUND: 'Profiles fetched successfully',
};

// Add more constants as needed
