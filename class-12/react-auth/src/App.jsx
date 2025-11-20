import React, { useEffect } from 'react'
import { supabase } from './utils/supabase';
import { useNavigate } from 'react-router';

export default function App() {
  const navigate = useNavigate();

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log("Error signing out:", error);
      return;
    }
    navigate('/login');
  }

  useEffect(() => {
      const checkSession = async () => {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.log('Error checking session:', error);
          return;
        }
        if (data.session) {
          navigate('/');
          console.log('User is signed in:', data.session);
          
        }

        else {
          navigate('/login');
          console.log('User is not signed in');
        }
      };
      checkSession();
    }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold underline">
        Welcome
      </h1>

      <button onClick={() => signOut()}>Sign out</button>
    </div>
  )
}
