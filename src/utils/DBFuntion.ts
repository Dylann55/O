/* eslint-disable class-methods-use-this */
/* eslint-disable import/no-cycle */
// eslint-disable-next-line max-classes-per-file
import { useRouter } from 'next/router';

import createClient from '@/db/supabaseClient';
import { fetchDataWithConfig } from '@/utils/Fetch';
import { generateToken } from '@/utils/Jwt';
import { checkSession } from '@/utils/LocalStorage';

class UpdatePassword {
  async updatePassword(_password: string): Promise<void> {
    throw new Error('updatePassword method not implemented');
  }
}

class SupaBaseChangePassword extends UpdatePassword {
  async updatePassword(password: string): Promise<any> {
    const result = await createClient.auth.updateUser({ password });
    return result;
  }
}

class AuthState {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor, @typescript-eslint/no-empty-function
  constructor() { }

  startListening(): void {
    throw new Error('startListening method not implemented');
  }
}

class SupaBaseAuthState extends AuthState {
  private router: any;

  constructor() {
    super();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    this.router = useRouter();
  }

  startListening(): void {
    createClient.auth.onAuthStateChange(async (event, session) => {
      console.log('El evento es: ', event);
      if (session == null) {
        this.router.push('/');
      }
    });
  }
}

class AuthStateSocial {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor, @typescript-eslint/no-empty-function
  constructor() { }

  checkSessionSocial(): void {
    throw new Error('checkSessionSocial method not implemented');
  }
}

class SupaBaseAuthStateSocial extends AuthStateSocial {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor() {
    super();
  }

  checkSessionSocial(): void {
    if (!checkSession()) {
      createClient.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN') {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          const access_token = session?.access_token;
          const id = session?.user?.id;
          const email = session?.user?.email;

          if (access_token && email && id) {
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('email', email);
            localStorage.setItem('id', id);
            const url = `${process.env.NEXT_PUBLIC_MIDDLE_URL}/auth/saveUser`;
            const user = {
              email,
              id,
              name: '',
              lastName: '',
              rut:'00.000.000-0'
            };
            const config = {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${generateToken(user)}`,
              },
            };
            const data = await fetchDataWithConfig(url, config);
          }
          window.location.href = '/Organization/MyOrganizations';
        }
      });
    }
  }
}

class RefreshSession {
  async refreshSession(): Promise<void> {
    throw new Error('startListening method not implemented');
  }
}

class SupaBaseRefreshSession extends RefreshSession {

  async refreshSession(): Promise<any> {
    const { data, error } = await createClient.auth.refreshSession();
    if (error) {
      return null;
    }
    const { session } = data;
    return session;
  }
}

class SignOut {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor, @typescript-eslint/no-empty-function
  constructor() { }

  signOut(): Promise<void> {
    throw new Error('startListening method not implemented');
  }
}

class SupaBaseSignOut extends SignOut {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor() {
    super();
  }

  async signOut(): Promise<void> {
    await createClient.auth.signOut();
  }
}

export {
  SupaBaseAuthState as AuthState,
  SupaBaseAuthStateSocial as AuthStateSocial,
  SupaBaseSignOut as SignOut,
  SupaBaseChangePassword as UpdatePassword,
  SupaBaseRefreshSession as RefreshSession,
};
