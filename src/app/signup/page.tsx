import Link from 'next/link';
import { AppLogo } from '@/components/app-logo';
import { SignUpForm } from '@/components/auth/signup-form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
             <div className="mx-auto mb-4">
              <AppLogo />
            </div>
            <CardTitle className="text-3xl font-bold">Create an Account</CardTitle>
            <CardDescription>Join the community and start your collection!</CardDescription>
          </CardHeader>
          <CardContent>
            <SignUpForm />
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/" className="font-semibold text-primary hover:underline">
                Log In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
