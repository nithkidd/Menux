import { supabase } from '../../config/supabase.js';
import { AuthTokenResponse, User } from '@supabase/supabase-js';

export class AuthService {
  /**
   * Login with email and password
   */
  async loginWithPassword(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }

  /**
   * Sign up with email and password
   */
  async signupWithPassword(email: string, password: string, fullName?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) throw error;
    return data;
  }

  /**
   * Logout (Sign out)
   */
  async logout(token: string) {
    const { error } = await supabase.auth.admin.signOut(token);
    if (error) throw error;
  }

  /**
   * Refresh Session
   */
  async refreshSession(refreshToken: string) {
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error) throw error;
    return data;
  }

  /**
   * Get OAuth URL
   */
  async getOAuthUrl(provider: 'google', redirectTo: string) {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
        skipBrowserRedirect: true,
      },
    });

    if (error) throw error;
    return data;
  }
}

export const authService = new AuthService();
