import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { auth, db, signInWithGoogle, logoutUser, isSuperAdmin, SUPER_ADMIN_EMAIL } from '../lib/firebase';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  isSuperAdmin: boolean;
  ignisTokens: number;
  lastLogin?: any;
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  isSuperAdminUser: boolean;
  loading: boolean;
  loginWithGoogle: () => Promise<User | null>;
  logout: () => Promise<void>;
  updateUserIgnis: (newAmount: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userProfile: null,
  isSuperAdminUser: false,
  loading: true,
  loginWithGoogle: async () => { throw new Error('Not initialized'); },
  logout: async () => {},
  updateUserIgnis: async () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const isSuperAdminUser = isSuperAdmin(currentUser) || (userProfile?.isSuperAdmin ?? false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const isAdmin = isSuperAdmin(user);

        // Fetch or create user record
        try {
          const snap = await getDoc(userRef);
          if (!snap.exists()) {
            const newProfile: UserProfile = {
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName || (isAdmin ? 'Ken X (Super Admin)' : 'Avatar Node'),
              photoURL: user.photoURL || '',
              isSuperAdmin: isAdmin,
              ignisTokens: isAdmin ? 1000 : 333,
            };
            await setDoc(userRef, {
              ...newProfile,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            });
            setUserProfile(newProfile);
          } else {
            const data = snap.data() as UserProfile;
            // Upgrade to super admin & grant 1000 IGNIS if email matches super admin
            if (isAdmin) {
              const targetIgnis = Math.max(data.ignisTokens || 0, 1000);
              if (!data.isSuperAdmin || (data.ignisTokens || 0) < 1000) {
                await setDoc(userRef, { 
                  isSuperAdmin: true, 
                  ignisTokens: targetIgnis,
                  displayName: data.displayName || 'Ken X (Super Admin)',
                  updatedAt: serverTimestamp()
                }, { merge: true });
                data.isSuperAdmin = true;
                data.ignisTokens = targetIgnis;
              }
            }
            setUserProfile(data);
          }
        } catch (err) {
          console.error('Error loading user profile:', err);
        }

        // Listen for live updates to user profile (e.g., IGNIS changes)
        const unsubscribeSnap = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserProfile(docSnap.data() as UserProfile);
          }
        });

        setLoading(false);
        return () => unsubscribeSnap();
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const loginWithGoogle = async () => {
    const user = await signInWithGoogle();
    return user;
  };

  const logout = async () => {
    await logoutUser();
    setUserProfile(null);
  };

  const updateUserIgnis = async (newAmount: number) => {
    if (!currentUser) return;
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await setDoc(userRef, { ignisTokens: newAmount, updatedAt: serverTimestamp() }, { merge: true });
    } catch (err) {
      console.error('Failed to update IGNIS tokens:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        isSuperAdminUser,
        loading,
        loginWithGoogle,
        logout,
        updateUserIgnis
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
