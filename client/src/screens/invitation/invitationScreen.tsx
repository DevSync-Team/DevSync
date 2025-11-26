// src/app/invite/[token]/page.tsx

"use client";

import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import api from '@/utils/api'; // Your configured axios instance

// Interface for the expected API response
interface AcceptanceResponse {
    sessionId: string;
    message: string;
}

export default function InviteAcceptPage() {
    const router = useRouter();
    const params = useParams();
    const token = params.token as string | undefined;

    useEffect(() => {
        if (!token) {
            router.push('/404'); // Redirect if token is missing (shouldn't happen via email link)
            return;
        }

        const acceptInvitation = async () => {
            // 1. Check if user is logged in (via the global interceptor)
            // If the user is NOT logged in, the interceptor in utils/api.ts will handle the 401
            // response and redirect them to /signin, which is required before acceptance.

            try {
                // 2. Call the backend acceptance API
                const response = await api.post<AcceptanceResponse>(
                    `/api/invitations/${token}/accept`
                );
                
                const { sessionId, message } = response.data;

                // 3. Success feedback
                toast.success(message || "Invitation successfully accepted! Redirecting...", {
                    position: "top-center",
                });

                // 4. Redirect to the editor
                router.push(`/editor/${sessionId}`);

            } catch (error) {
                const errorMessage = (error as Error).message || "Failed to accept invitation.";
                
                // If it's a 401, the interceptor handles the signin redirect.
                // If it's another error (e.g., token expired, already member), display the error.
                toast.error(errorMessage, { position: "top-center" });
                
                // Optionally redirect user to the dashboard or home on failure
                router.push('/dashboard'); 
            }
        };

        acceptInvitation();
    }, [token, router]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#0d1117] text-white">
            <div className="text-2xl font-semibold mb-4">Processing Invitation...</div>
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-400">Please wait while we confirm your membership.</p>
        </div>
    );
}