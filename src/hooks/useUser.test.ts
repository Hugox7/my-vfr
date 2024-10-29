import { renderHook, waitFor } from '@testing-library/react';
import { supabase } from '@/lib/supabaseClient';
import { UserProvider } from '@/context/UserContext';
import { useUser } from './useUser';

jest.mock('@/lib/supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      onAuthStateChange: jest.fn().mockImplementation(() => {
        // Simuler un changement d'état
        return { data: { subscription: { unsubscribe: jest.fn() } } };
      }),
    },
  },
}));

describe('useUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devrait initialiser avec un utilisateur null et loading true', async () => {
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({ data: { session: null } });

    const { result } = renderHook(() => useUser(), { wrapper: UserProvider });
    
    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(true);

    
    await waitFor(() => {
        expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBeNull();
  });

  it('devrait mettre à jour l’utilisateur lorsque getSession retourne une session', async () => {
    const mockUser = { id: 'user-123', email: 'test@example.com' };

    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: { user: mockUser } },
    });

    const { result } = renderHook(() => useUser(), { wrapper: UserProvider });

    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(true);

    await waitFor(() => {
        expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toEqual(mockUser);
  });

  it('devrait se mettre à jour quand onAuthStateChange est déclenché', async () => {
    const mockUser = { id: 'user-123', email: 'test@example.com' };

    (supabase.auth.onAuthStateChange as jest.Mock).mockImplementation((callback) => {
      callback('SIGNED_IN', { user: mockUser });
      return { data: { subscription: { unsubscribe: jest.fn() } } };
    });

    const { result } = renderHook(() => useUser(), { wrapper: UserProvider });

    await waitFor(() => {
        expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toEqual(mockUser);
  });
});