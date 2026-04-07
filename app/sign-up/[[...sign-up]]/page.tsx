import { SignUp } from '@clerk/nextjs';

export const dynamic = 'force-dynamic';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-cyan-950 flex items-center justify-center px-6">
      <SignUp
        appearance={{
          variables: {
            colorPrimary: '#06b6d4',
            colorBackground: '#000000',
            colorText: '#ffffff',
            borderRadius: '1rem',
          },
        }}
      />
    </div>
  );
}
