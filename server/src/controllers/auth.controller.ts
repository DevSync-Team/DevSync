import type { Request, Response, NextFunction } from "express";
import {
  signupService,
  loginService,
  logoutService,
  forgotPasswordService,
  resetPasswordService,
  getProfileService,
} from "../services/auth.service.js";

// Extend the Request type to include the userId set by the 'protect' middleware
interface AuthenticatedRequest extends Request {
    userId?: string;
}

/**
 * @swagger
 * /api/auth/signup:
 * post:
 * summary: Register a new user
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - email
 * - password
 * - full_name
 * properties:
 * email:
 * type: string
 * format: email
 * example: user@example.com
 * password:
 * type: string
 * format: password
 * example: MySecurePassword123
 * full_name:
 * type: string
 * example: John Doe
 * responses:
 * 201:
 * description: User created successfully
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message:
 * type: string
 * example: User created
 * userId:
 * type: string
 * example: 60d5ec49f13d8a0015b67d98
 * 400:
 * description: Email already exists
 * 500:
 * description: Server error
 */
export const signup = async (req: Request, res: Response) => {
  const { email, password, full_name } = req.body;
  try {
    const result = await signupService(email, password, full_name);
    res.status(201).json({ message: "User created", userId: result.userId });
  } catch (err) {
    const status = (err as Error).message.includes("exists") ? 400 : 500;
    res.status(status).json({ message: (err as Error).message, error: err });
  }
};

/**
 * @swagger
 * /api/auth/login:
 * post:
 * summary: Log in a user and get a JWT token
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - email
 * - password
 * properties:
 * email:
 * type: string
 * format: email
 * example: user@example.com
 * password:
 * type: string
 * format: password
 * example: MySecurePassword123
 * responses:
 * 200:
 * description: Login successful, returns JWT token
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * token:
 * type: string
 * example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 * 400:
 * description: Invalid credentials
 * 500:
 * description: Server error
 */
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const result = await loginService(email, password);
    res.json({ token: result.token });
  } catch (err) {
    const status = (err as Error).message.includes("Invalid") ? 400 : 500;
    res.status(status).json({ message: (err as Error).message, error: err });
  }
};

/**
 * @swagger
 * /api/auth/logout:
 * post:
 * summary: Log out a user (placeholder for stateless JWT)
 * tags: [Auth]
 * responses:
 * 200:
 * description: Logged out successfully
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message:
 * type: string
 * example: Logged out successfully
 * 500:
 * description: Server error
 */
export const logout = async (_req: Request, res: Response) => {
  try {
    const result = logoutService();
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

/**
 * @swagger
 * /api/auth/forgot-password:
 * post:
 * summary: Request a password reset email
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - email
 * properties:
 * email:
 * type: string
 * format: email
 * example: user@example.com
 * responses:
 * 200:
 * description: Password reset link sent (returns resetToken for demonstration)
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message:
 * type: string
 * example: Password reset link sent
 * resetToken:
 * type: string
 * example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 * 400:
 * description: User not found
 * 500:
 * description: Server error
 */
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const result = await forgotPasswordService(email);
    res.json(result);
  } catch (err) {
    const status = (err as Error).message.includes("User not found") ? 400 : 500;
    res.status(status).json({ message: (err as Error).message, error: err });
  }
};

/**
 * @swagger
 * /api/auth/reset-password/{token}:
 * post:
 * summary: Reset password with a valid token
 * tags: [Auth]
 * parameters:
 * - in: path
 * name: token
 * schema:
 * type: string
 * required: true
 * description: The password reset JWT token
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - newPassword
 * properties:
 * newPassword:
 * type: string
 * format: password
 * example: ANewSecurePassword123
 * responses:
 * 200:
 * description: Password updated successfully
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message:
 * type: string
 * example: Password updated successfully
 * 400:
 * description: Invalid or expired token
 * 500:
 * description: Server error
 */
export const resetPassword = async (req: Request, res: Response) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  try {
    const result = await resetPasswordService(token, newPassword);
    res.json(result);
  } catch (err) {
    const status = (err as Error).message.includes("Invalid or expired token") ? 400 : 500;
    res.status(status).json({ message: (err as Error).message, error: err });
  }
};

/**
 * @swagger
 * /api/auth/me:
 * get:
 * summary: Get the profile of the currently logged-in user
 * tags: [Auth]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: User profile retrieved successfully
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * user:
 * $ref: '#/components/schemas/User'
 * 401:
 * description: Unauthorized (Token missing or invalid)
 * 404:
 * description: User not found
 * 500:
 * description: Server error
 */
export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId; 
    
    // Log for debugging: check if userId made it through the middleware
    console.log("GET PROFILE: Received userId from middleware:", userId);
    
    if (!userId) {
        // This check should only fail if middleware is bypassed or misconfigured
        return res.status(401).json({ message: "Unauthorized: User ID missing" });
    }

    const result = await getProfileService(userId);
    res.json({ user: result.user });
  } catch (err) {
    const status = (err as Error).message.includes("User not found") ? 404 : 500;
    res.status(status).json({ message: (err as Error).message, error: err });
  }
};