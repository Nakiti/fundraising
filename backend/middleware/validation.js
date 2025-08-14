import { ValidationError } from "../utils/errors.js";
import { sendValidationError } from "../utils/response.js";

// Input validation middleware
export const validateLogin = (req, res, next) => {
   const { email, password } = req.body;
   const errors = [];

   // Check if required fields are present
   if (!email) {
      errors.push("Email is required");
   }
   if (!password) {
      errors.push("Password is required");
   }

   // Validate email format
   if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
         errors.push("Please provide a valid email address");
      }
   }
 
   // Validate password length
   // if (password && password.length < 6) {
   //    errors.push("Password must be at least 6 characters long");
   // }

   if (errors.length > 0) {
      return sendValidationError(res, errors, "Login validation failed");
   }

   next();
};

export const validateRegistration = (req, res, next) => {
   const { firstName, lastName, email, password } = req.body;
   const errors = [];

   // Check if required fields are present
   if (!firstName) {
      errors.push("First name is required");
   }
   if (!lastName) {
      errors.push("Last name is required");
   }
   if (!email) {
      errors.push("Email is required");
   }
   if (!password) {
      errors.push("Password is required");
   }

   // Validate name length
   if (firstName && firstName.length < 2) {
      errors.push("First name must be at least 2 characters long");
   }
   if (lastName && lastName.length < 2) {
      errors.push("Last name must be at least 2 characters long");
   }

   // Validate email format
   if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
         errors.push("Please provide a valid email address");
      }
   }

   // Validate password strength
   if (password) {
      if (password.length < 8) {
         errors.push("Password must be at least 8 characters long");
      }

      // Check for at least one uppercase letter, one lowercase letter, and one number
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
      if (!passwordRegex.test(password)) {
         errors.push("Password must contain at least one uppercase letter, one lowercase letter, and one number");
      }
   }

   if (errors.length > 0) {
      return sendValidationError(res, errors, "Registration validation failed");
   }

   next();
};

export const validatePasswordUpdate = (req, res, next) => {
   const { password } = req.body;
   const errors = [];

   if (!password) {
      errors.push("Password is required");
   }

   // Validate password strength
   if (password) {
      if (password.length < 8) {
         errors.push("Password must be at least 8 characters long");
      }

      // Check for at least one uppercase letter, one lowercase letter, and one number
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
      if (!passwordRegex.test(password)) {
         errors.push("Password must contain at least one uppercase letter, one lowercase letter, and one number");
      }
   }

   if (errors.length > 0) {
      return sendValidationError(res, errors, "Password update validation failed");
   }

   next();
};
