export const userValidationSchema = {
  username: {
    notEmpty: {
      errorMessage: "Username must not be empty",
    },
    isString: {
      errorMessage: "Username must be of type string",
    },
    isEmail: {
      errorMessage: "Invalid username",
    },
    isLength: {
      options: { min: 8, max: 32 },
      errorMessage: "Must be at least 5 and max of 32 characters",
    },
  },
  displayName: {
    notEmpty: {
      errorMessage: "Display name must not be empty",
    },
  },
  password: {
    notEmpty: {
      errorMessage: "Password must not be empty",
    },
  },
};

export const userAuthSchema = {
  username: {
    notEmpty: true,
    isEmail: true,
    errorMessage: "Invalid username",
  },
  password: {
    notEmpty: true,
    errorMessage: "Invalid password",
  },
};
