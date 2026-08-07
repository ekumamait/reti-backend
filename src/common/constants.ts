export const USER_ROLES = {
  YOUTH: 'youth',
  MENTOR: 'mentor',
  EMPLOYER: 'employer',
  ADMIN: 'admin',
  SUPER: 'super',
  STAFF: 'staff',
};

export enum MentorshipSessionStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}

export const ERROR_MESSAGES = {
  USER_NOT_FOUND: (phoneNumber: string) =>
    `User with phone number ${phoneNumber} not found`,
  PROFILE_NOT_FOUND: (id: number) => `Profile with ID ${id} not found`,
  USER_ALREADY_EXISTS: (phoneNumber: string) =>
    `User with phone number ${phoneNumber} already exists`,
  USER_ROLE_FOUND: (role: string) => `User with role ${role} not found`,
  USER_ID_NOT_FOUND: (userId: number) => `User with id ${userId} not found`,
  USERS_NOT_FOUND: () => `There are currently no users`,

  CONVERSATION_NOT_FOUND: (id: number) =>
    `Conversation with ID ${id} not found`,
  MESSAGE_NOT_FOUND: (id: number) => `Message with ID ${id} not found`,
  PARTICIPANTS_NOT_FOUND: () => `One or more participants not found`,
  SENDER_RECEIVER_SAME: (userId: number) =>
    `Sender ${userId} and receiver cannot be same`,

  PRODUCT_NOT_FOUND: (id: string) =>
    `Product with ID ${id} not found or already inactive`,

  WELCOME_IMAGE_NOT_FOUND: (id: number) =>
    `Welcome image with ID ${id} not found`,

  INVALID_NIN: 'NIN must start with CM or CF followed by 12 characters',

  UNAUTHORIZED: 'You are not authorized to perform this action',
};

export const SUCCESS_MESSAGES = {
  USER_CREATED: 'User successfully created',
  USER_UPDATED: 'User successfully updated',
  USER_DELETED: 'User successfully deleted',
  PROFILE_CREATED: 'Profile successfully created',
  PROFILE_UPDATED: 'Profile successfully updated',
  PROFILE_DELETED: 'Profile successfully deleted',
  USER_FOUND: (phoneNumber: string) =>
    `User with phone number ${phoneNumber} fetched successfully`,
  PROFILE_FOUND: (id: number) => `Profile with ID ${id} fetched successfully`,
  USER_PHONE_FOUND: (phoneNumber: string) =>
    `User with phone number ${phoneNumber} fetched successfully`,
  USERS_FOUND: 'Users fetched successfully',
  PROFILES_FOUND: 'Profiles fetched successfully',
  INSPIRATIONS_FOUND: 'Inspirations fetched successfully',
  INSPIRATION_UPDATED: 'Inspiration successfully updated',
  NOTIFICATION_CREATED: 'Notification successfully created',
  INSPIRATION_CREATED: 'Inspiration successfully created',
  CONVERSATION_CREATED: 'Conversation successfully created',
  MESSAGE_SENT: 'Message successfully sent',
  MESSAGE_UPDATED: 'Message successfully updated',
  CONVERSATION_FOUND: (id: number) =>
    `Conversation with ID ${id} fetched successfully`,
  CONVERSATION_DELETED: (id: number) =>
    `Conversation with ID ${id} deleted successfully`,
  MESSAGES_FOUND: 'Messages fetched successfully',
  MESSAGES_MARKED_AS_READ: 'Messages successfully marked as read',
  CONVERSATIONS_FOUND: 'Conversations fetched successfully',
  PRODUCT_DELETED: (id: string) => `Product with ID ${id} deleted successfully`,
  PRODUCT_CREATED: 'Product successfully created',
  PRODUCT_UPDATED: 'Product successfully updated',
  PRODUCT_FOUND: (id: string) => `Product with ID ${id} fetched successfully`,
  PRODUCTS_FOUND: 'Products fetched successfully',
  JOB_CREATED: 'Job successfully created',
  JOBS_FOUND: 'Jobs fetched successfully',
  SESSION_CREATED: 'Session successfully created',
  SESSIONS_FOUND: 'Sessions fetched successfully',
  SESSION_UPDATED: 'Session successfully updated',
  JOB_UPDATED: 'Job successfully updated',
  JOB_DELETED: 'Job successfully deleted',
  INSPIRATION_DELETED: (id: number) =>
    `Inspiration with ID ${id} deleted successfully`,
  WELCOME_IMAGES_FOUND: 'Welcome images fetched successfully',
  WELCOME_IMAGE_CREATED: 'Welcome image successfully created',
  WELCOME_IMAGE_UPDATED: 'Welcome image successfully updated',
  WELCOME_IMAGE_DELETED: (id: number) =>
    `Welcome image with ID ${id} deleted successfully`,
};
