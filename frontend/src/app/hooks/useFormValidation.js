import { useState, useCallback, useEffect, useRef } from 'react';
import { validators } from '../services/apiClient.js';

export const useFormValidation = (initialValues = {}, validationRules = {}, options = {}) => {
   const [values, setValues] = useState(initialValues);
   const [errors, setErrors] = useState({});
   const [touched, setTouched] = useState({});
   const [isValid, setIsValid] = useState(false);
   const [isDirty, setIsDirty] = useState(false);
   
   // Use ref to store initial values to avoid dependency issues
   const initialValuesRef = useRef(initialValues);
   initialValuesRef.current = initialValues;

   const validateField = useCallback((fieldName, value) => {
      const rules = validationRules[fieldName];
      if (!rules) return null;

      for (const rule of rules) {
         try {
            switch (rule.type) {
               case 'required':
                  validators.required(value, rule.fieldName || fieldName);
                  break;
               case 'email':
                  validators.email(value);
                  break;
               case 'password':
                  validators.password(value, rule.minLength);
                  break;
               case 'minLength':
                  validators.minLength(value, rule.minLength, rule.fieldName || fieldName);
                  break;
               case 'number':
                  validators.number(value, rule.fieldName || fieldName);
                  break;
               case 'positiveNumber':
                  validators.positiveNumber(value, rule.fieldName || fieldName);
                  break;
               case 'date':
                  validators.date(value, rule.fieldName || fieldName);
                  break;
               case 'url':
                  validators.url(value, rule.fieldName || fieldName);
                  break;
               case 'id':
                  validators.id(value, rule.fieldName || fieldName);
                  break;
               case 'custom':
                  if (rule.validator) {
                     rule.validator(value, fieldName);
                  }
                  break;
               default:
                  break;
            }
         } catch (error) {
            return error.message;
         }
      }
      return null;
   }, [validationRules]);

   const validateForm = useCallback(() => {
      const newErrors = {};
      let hasErrors = false;

      Object.keys(validationRules).forEach(fieldName => {
         const error = validateField(fieldName, values[fieldName]);
         if (error) {
            newErrors[fieldName] = error;
            hasErrors = true;
         }
      });

      setErrors(newErrors);
      setIsValid(!hasErrors);
      return !hasErrors;
   }, [values, validationRules, validateField]);

   const handleChange = useCallback((fieldName, value) => {
      setValues(prev => ({ ...prev, [fieldName]: value }));
      setIsDirty(true);

      // Real-time validation if enabled - validate regardless of touch state
      if (options.validateOnChange !== false) {
         const error = validateField(fieldName, value);
         setErrors(prev => ({
            ...prev,
            [fieldName]: error
         }));
      }

      console.log(errors)
   }, [options.validateOnChange, validateField]);

   const handleBlur = useCallback((fieldName) => {
      setTouched(prev => ({ ...prev, [fieldName]: true }));
      
      // Validate on blur
      if (options.validateOnBlur !== false) {
         const error = validateField(fieldName, values[fieldName]);
         setErrors(prev => ({
            ...prev,
            [fieldName]: error
         }));
      }
   }, [values, options.validateOnBlur, validateField]);

   const handleSubmit = useCallback((onSubmit) => {
      return async (e) => {
         if (e) e.preventDefault();
         
         // Mark all fields as touched
         const allTouched = {};
         Object.keys(validationRules).forEach(fieldName => {
            allTouched[fieldName] = true;
         });
         setTouched(allTouched);

         // Validate form
         const isValid = validateForm();
         
         if (isValid) {
            try {
               await onSubmit(values);
            } catch (error) {
               // Handle submission errors
               console.error('Form submission error:', error);
            }
         }
      };
   }, [values, validationRules, validateForm]);

   const reset = useCallback((newValues = null) => {
      const resetValues = newValues || initialValuesRef.current;
      setValues(resetValues);
      setErrors({});
      setTouched({});
      setIsValid(false);
      setIsDirty(false);
   }, []);

   const setFieldValue = useCallback((fieldName, value) => {
      handleChange(fieldName, value);
   }, [handleChange]);

   const setFieldError = useCallback((fieldName, error) => {
      setErrors(prev => ({
         ...prev,
         [fieldName]: error
      }));
   }, []);

   const clearFieldError = useCallback((fieldName) => {
      setErrors(prev => {
         const newErrors = { ...prev };
         delete newErrors[fieldName];
         return newErrors;
      });
   }, []);

   const clearAllErrors = useCallback(() => {
      setErrors({});
   }, []);

   // Validate form when values change
   useEffect(() => {
      if (options.validateOnMount) {
         validateForm();
      }
   }, [validateForm, options.validateOnMount]);

   // Check if form is dirty
   useEffect(() => {
      const dirty = JSON.stringify(values) !== JSON.stringify(initialValuesRef.current);
      setIsDirty(dirty);
   }, [values]);

   return {
      values,
      errors,
      touched,
      isValid,
      isDirty,
      handleChange,
      handleBlur,
      handleSubmit,
      reset,
      setFieldValue,
      setFieldError,
      clearFieldError,
      clearAllErrors,
      validateForm,
   };
};

// Predefined validation rules
export const validationRules = {
   email: [
      { type: 'required', fieldName: 'Email' },
      { type: 'email' }
   ],
   password: [
      { type: 'required', fieldName: 'Password' },
      { type: 'password', minLength: 8 }
   ],
   loginPassword: [
      { type: 'required', fieldName: 'Password' }
   ],
   firstName: [
      { type: 'required', fieldName: 'First Name' },
      { type: 'minLength', minLength: 2, fieldName: 'First Name' }
   ],
   lastName: [
      { type: 'required', fieldName: 'Last Name' },
      { type: 'minLength', minLength: 2, fieldName: 'Last Name' }
   ],
   organizationName: [
      { type: 'required', fieldName: 'Organization Name' },
      { type: 'minLength', minLength: 2, fieldName: 'Organization Name' }
   ],
   campaignName: [
      { type: 'required', fieldName: 'Campaign Name' },
      { type: 'minLength', minLength: 3, fieldName: 'Campaign Name' }
   ],
   amount: [
      { type: 'required', fieldName: 'Amount' },
      { type: 'positiveNumber', fieldName: 'Amount' }
   ],
   date: [
      { type: 'required', fieldName: 'Date' },
      { type: 'date', fieldName: 'Date' }
   ],
   url: [
      { type: 'url', fieldName: 'URL' }
   ],
   id: [
      { type: 'id', fieldName: 'ID' }
   ]
};

// Helper function to create validation rules
export const createValidationRules = (fields) => {
   const rules = {};
   Object.keys(fields).forEach(fieldName => {
      rules[fieldName] = fields[fieldName];
   });
   return rules;
};
