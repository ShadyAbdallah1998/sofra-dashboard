import LoginForm from '@/components/auth/login/LoginForm';
import LoginHeader from '@/components/auth/login/LoginHeader';
import LoginFooter from '@/components/auth/login/LoginFooter';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="bg-card text-card-foreground rounded-xl shadow-sm border border-border p-8 space-y-8">
          <LoginHeader />
          <LoginForm />
          <LoginFooter />
        </div>
      </div>
    </div>
  );
}
