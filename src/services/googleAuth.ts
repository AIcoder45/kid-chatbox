/**
 * Google OAuth service for frontend
 */

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

/**
 * Initialize Google Sign-In
 * Call this once when the app loads
 */
export const initializeGoogleSignIn = (): void => {
  if (!GOOGLE_CLIENT_ID) {
    console.warn('Google Client ID not configured. Google login will not work.');
    return;
  }

  // Wait for Google script to load
  const checkGoogle = setInterval(() => {
    if ((window as unknown as { google?: unknown }).google) {
      clearInterval(checkGoogle);
      
      // Initialize Google Sign-In with FedCM support
      (window as unknown as {
        google: {
          accounts: {
            id: {
              initialize: (config: {
                client_id: string;
                callback: (response: { credential: string }) => void;
                use_fedcm_for_prompt?: boolean;
              }) => void;
            };
          };
        };
      }).google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleSignIn,
        use_fedcm_for_prompt: true, // Opt-in to FedCM to avoid deprecation warning
      });
    }
  }, 100);
};

/**
 * Handle Google Sign-In response
 */
const handleGoogleSignIn = (response: { credential: string }): void => {
  // This will be handled by the button click
  if (response.credential) {
    try {
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      // Store for use in login component
      (window as unknown as { googleAuthData?: unknown }).googleAuthData = {
        credential: response.credential,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      };
    } catch (error) {
      console.error('Failed to decode Google token:', error);
    }
  }
};

/**
 * Sign in with Google using One Tap or button
 * @returns Promise with Google credential token
 */
export const signInWithGoogle = (): Promise<{
  credential: string;
  email: string;
  name: string;
  picture?: string;
}> => {
  return new Promise((resolve, reject) => {
    if (!GOOGLE_CLIENT_ID) {
      reject(new Error('Google Client ID not configured'));
      return;
    }

    // Wait for Google script to load
    const checkGoogle = setInterval(() => {
      if ((window as unknown as { google?: unknown }).google) {
        clearInterval(checkGoogle);
        
        // Try One Tap first with FedCM-compatible handling
        (window as unknown as {
          google: {
            accounts: {
              id: {
                prompt: (callback: (notification: { 
                  credential?: string;
                  g?: string; // FedCM-compatible status code
                }) => void) => void;
              };
            };
          };
        }).google.accounts.id.prompt((notification) => {
          if (notification.credential) {
            try {
              const payload = JSON.parse(
                atob(notification.credential.split('.')[1])
              );
              resolve({
                credential: notification.credential,
                email: payload.email,
                name: payload.name,
                picture: payload.picture,
              });
            } catch (error) {
              reject(new Error('Failed to decode Google token'));
            }
          } else {
            // FedCM-compatible: Check status using 'g' property only
            const status = notification.g;
            if (status === 'skipped_moment' || status === 'display_moment') {
              // Prompt was skipped or displayed but no credential received
              reject(new Error('Please use the Google Sign-In button'));
            } else {
              // Prompt was dismissed or not displayed
              reject(new Error('Google Sign-In was cancelled'));
            }
          }
        });
      }
    }, 100);

    // Timeout after 5 seconds
    setTimeout(() => {
      clearInterval(checkGoogle);
      reject(new Error('Google Sign-In script failed to load'));
    }, 5000);
  });
};

/**
 * Render Google Sign-In button
 * @param elementId - ID of the element where button should be rendered
 * @param onSuccess - Callback when sign-in succeeds
 */
export const renderGoogleButton = (
  elementId: string,
  onSuccess: (credential: string, email: string, name: string) => void
): void => {
  if (!GOOGLE_CLIENT_ID) {
    console.warn('Google Client ID not configured');
    return;
  }

  const checkGoogle = setInterval(() => {
    if ((window as unknown as { google?: unknown }).google) {
      clearInterval(checkGoogle);
      
      const element = document.getElementById(elementId);
      if (!element) {
        console.error(`Element with id ${elementId} not found`);
        return;
      }

      (window as unknown as {
        google: {
          accounts: {
            id: {
              renderButton: (
                element: HTMLElement,
                config: {
                  type: string;
                  theme: string;
                  size: string;
                  text: string;
                  width: number;
                  callback: (response: { credential: string }) => void;
                }
              ) => void;
            };
          };
        };
      }).google.accounts.id.renderButton(element, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        width: 300,
        callback: (response) => {
          if (response.credential) {
            try {
              const payload = JSON.parse(
                atob(response.credential.split('.')[1])
              );
              onSuccess(response.credential, payload.email, payload.name);
            } catch (error) {
              console.error('Failed to decode Google token:', error);
            }
          }
        },
      });
    }
  }, 100);
};
