/**
 * auth-service.js - Shared authentication logic for Startup Sphere
 * This file should be included in both login.html and signup.html
 */

// User Authentication State Management
class AuthService {
    constructor() {
        this.currentUserKey = 'currentUser';
        this.usersKey = 'users';
        this.rememberedUserKey = 'rememberedUser';
    }

    // Check if user is authenticated
    isAuthenticated() {
        return localStorage.getItem(this.currentUserKey) !== null;
    }

    // Get current user
    getCurrentUser() {
        return JSON.parse(localStorage.getItem(this.currentUserKey));
    }

    // Login user
    login(email, password, role, rememberMe = false) {
        const users = this.getUsers();
        
        if (!users[email]) {
            return { success: false, message: "Account not found" };
        }
        
        if (users[email].password !== password) {
            return { success: false, message: "Incorrect password" };
        }
        
        if (users[email].role.toLowerCase() !== role.toLowerCase()) {
            return { success: false, message: "Selected role doesn't match your account" };
        }
        
        // Set current user in localStorage
        const currentUser = {
            email: email,
            name: users[email].name,
            role: users[email].role
        };
        localStorage.setItem(this.currentUserKey, JSON.stringify(currentUser));
        
        // Handle "remember me" option
        if (rememberMe) {
            localStorage.setItem(this.rememberedUserKey, JSON.stringify({
                email: email,
                role: role
            }));
        } else {
            localStorage.removeItem(this.rememberedUserKey);
        }
        
        return { success: true, user: currentUser };
    }

    // Register new user
    register(name, email, password, role) {
        const users = this.getUsers();
        
        if (users[email]) {
            return { success: false, message: "Email already registered" };
        }
        
        // Create new user
        users[email] = {
            name: name,
            password: password,  // In a real app, this would be hashed
            role: role,
            dateJoined: new Date().toISOString()
        };
        
        // Save to localStorage
        localStorage.setItem(this.usersKey, JSON.stringify(users));
        
        // Set as current user
        const currentUser = {
            email: email,
            name: name,
            role: role
        };
        localStorage.setItem(this.currentUserKey, JSON.stringify(currentUser));
        
        return { success: true, user: currentUser };
    }

    // Logout current user
    logout() {
        localStorage.removeItem(this.currentUserKey);
        
        // Optionally clear remembered user too
        // localStorage.removeItem(this.rememberedUserKey);
        
        return true;
    }

    // Get all users (for admin purposes)
    getUsers() {
        return JSON.parse(localStorage.getItem(this.usersKey)) || {};
    }

    // Get remembered user (if any)
    getRememberedUser() {
        return JSON.parse(localStorage.getItem(this.rememberedUserKey));
    }
    
    // Update user profile
    updateProfile(email, updates) {
        const users = this.getUsers();
        
        if (!users[email]) {
            return { success: false, message: "User not found" };
        }
        
        // Update user data
        users[email] = {...users[email], ...updates};
        
        // Save changes
        localStorage.setItem(this.usersKey, JSON.stringify(users));
        
        // If this is the current user, update current user too
        const currentUser = this.getCurrentUser();
        if (currentUser && currentUser.email === email) {
            const updatedUser = {
                ...currentUser,
                ...updates
            };
            localStorage.setItem(this.currentUserKey, JSON.stringify(updatedUser));
        }
        
        return { success: true };
    }
    
    // Check if email exists
    emailExists(email) {
        const users = this.getUsers();
        return users[email] !== undefined;
    }
    
    // Redirect to appropriate dashboard based on role
    redirectToDashboard(role) {
        if (typeof role !== 'string') return;
        
        switch(role.toLowerCase()) {
            case "student":
                window.location.href = "student-investor.html";
                break;
            case "startup Founder":
                    window.location.href = "founder.html";
                    break;
            case "investor":
                window.location.href = "student-investor.html";
                break;
            default:
                window.location.href = "dashboard.html";
        }
    }
}

// Create global auth service instance
const authService = new AuthService();