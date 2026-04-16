import { Suspense } from 'react';
import ResetPasswordClientComponent from '@/components/Pages/ResetPasswordClientComponent';

export default function ResetPasswordPage() {
    return (
        <main>
            <Suspense fallback={<div>Loading...</div>}>
                <ResetPasswordClientComponent />
            </Suspense>
        </main>
    );
}