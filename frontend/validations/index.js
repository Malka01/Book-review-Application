import { z } from "zod";

// login schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email field has to be filled." })
    .email("This is not a valid email."),
  password: z
    .string()
    .min(1, { message: "Password field has to be filled." })
    .max(32, { message: "Password should contain maximum 32 characters." }),
});

// register schema
export const registerSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "First name field has to be filled." }),
  lastName: z.string().min(1, { message: "Last name field has to be filled." }),
  email: z
    .string()
    .min(1, { message: "Email field has to be filled." })
    .email("This is not a valid email."),
  password: z
    .string()
    .min(1, { message: "Password field has to be filled." })
    .max(32, { message: "Password should contain maximum 32 characters." }),
  confirmPassword: z
    .string()
    .min(1, { message: "Confirm Password field has to be filled." })
    .max(32, {
      message: "Confirm Password should contain maximum 32 characters.",
    }),
});

// review schema
export const reviewSchema = z.object({
  isbn: z
    .string()
    .min(1, { message: "ISBN field has to be filled." })
    .max(13, { message: "ISBN should contain maximum 13 characters." }),
  title: z
    .string()
    .min(1, { message: "Title field has to be filled." })
    .max(100, { message: "Title should contain maximum 100 characters." }),
  author: z
    .string()
    .min(1, { message: "Author field has to be filled." })
    .max(100, { message: "Author should contain maximum 100 characters." }),
  rating: z.coerce
    .number()
    .refine((val) => val !== undefined, {
      message: "Rating field has to be filled.",
    })
    .refine((val) => !isNaN(val), {
      message: "Rating must be a number.",
    })
    .refine((val) => val > 0, {
      message: "Rating must be greater than 0.",
    })
    .refine((val) => val <= 5, {
      message: "Rating must be less than or equal to 5.",
    }),
  review: z
    .string()
    .min(1, { message: "Review field has to be filled." })
    .max(1000, { message: "Review should contain maximum 1000 characters." }),
});
