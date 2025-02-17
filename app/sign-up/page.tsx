'use client';

import { useSearchParams } from 'next/navigation';

export default function Signup() {
    const searchParams = useSearchParams();
    const activeParam = searchParams.get('active');

    return (
        <div>
            <p>Active Param: {activeParam}</p>
        </div>
    );
}