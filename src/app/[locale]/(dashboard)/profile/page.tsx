'use client';

import { useEffect } from 'react';
import { useAuthStore, useUsersStore } from '@/store';
import { useRouter } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { UpdateUserRequest } from '@/types/users.types';

const updateProfileSchema = z.object({
    fullname: z.string().min(2, 'Full name must be at least 2 characters').optional(),
    firstname: z.string().min(2, 'First name must be at least 2 characters').optional(),
    lastname: z.string().min(2, 'Last name must be at least 2 characters').optional(),
});

type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

export default function ProfilePage() {
    const router = useRouter();

    // Auth store
    const user = useAuthStore((state) => state.user);
    const setUser = useAuthStore((state) => state.setUser);

    // Users store
    const currentUser = useUsersStore((state) => state.currentUser);
    const isLoading = useUsersStore((state) => state.isLoading);
    const error = useUsersStore((state) => state.error);
    const getUser = useUsersStore((state) => state.getUser);
    const updateUser = useUsersStore((state) => state.updateUser);
    const clearError = useUsersStore((state) => state.clearError);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<UpdateProfileFormData>({
        resolver: zodResolver(updateProfileSchema),
    });

    // Fetch user data on mount
    useEffect(() => {
        if (user?.id) {
            getUser(user.id);
        } else {
            router.push('/auth/login');
        }

        return () => {
            useUsersStore.getState().reset();
        };
    }, [user?.id, getUser, router]);

    // Update form when user data is loaded
    useEffect(() => {
        if (currentUser) {
            reset({
                fullname: currentUser.fullname || '',
                firstname: currentUser.firstname || '',
                lastname: currentUser.lastname || '',
            });
        }
    }, [currentUser, reset]);

    const onSubmit = async (data: UpdateProfileFormData) => {
        if (!user?.id) return;

        clearError();
        try {
            const updateData: UpdateUserRequest = {};
            if (data.fullname) updateData.fullname = data.fullname;
            if (data.firstname) updateData.firstname = data.firstname;
            if (data.lastname) updateData.lastname = data.lastname;

            await updateUser(user.id, updateData);

            // Update auth store with new user data
            const updatedUser = useUsersStore.getState().currentUser;
            if (updatedUser) {
                setUser(updatedUser);
            }

            alert('Profile updated successfully!');
        } catch (err) {
            console.error('Failed to update profile:', err);
        }
    };

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-card rounded-lg shadow-md p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="fz-25 font-bold text-foreground">Profile Settings</h1>
                        <Button
                            variant="outline"
                            onClick={() => router.push('/dashboard')}
                        >
                            Back to Dashboard
                        </Button>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                            <p className="fz-14 text-destructive">{error.message}</p>
                        </div>
                    )}

                    {isLoading && !currentUser ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 space-y-2">
                                <h2 className="fz-16 font-semibold text-foreground">Account Information</h2>
                                <div className="fz-14 space-y-1">
                                    <p><span className="font-medium">Email:</span> {user.email}</p>
                                    <p><span className="font-medium">Email Verified:</span> {user.emailVerified ? '✅ Yes' : '❌ No'}</p>
                                    {user.role && <p><span className="font-medium">Role:</span> {user.role}</p>}
                                    <p><span className="font-medium">Joined:</span> {new Date(user.joinedAt).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="fullname" className="block fz-14 font-medium text-foreground">
                                        Full Name
                                    </label>
                                    <Input
                                        {...register('fullname')}
                                        id="fullname"
                                        type="text"
                                        placeholder="John Doe"
                                        className="fz-14"
                                    />
                                    {errors.fullname && (
                                        <p className="fz-12 text-destructive">{errors.fullname.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="firstname" className="block fz-14 font-medium text-foreground">
                                        First Name
                                    </label>
                                    <Input
                                        {...register('firstname')}
                                        id="firstname"
                                        type="text"
                                        placeholder="John"
                                        className="fz-14"
                                    />
                                    {errors.firstname && (
                                        <p className="fz-12 text-destructive">{errors.firstname.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="lastname" className="block fz-14 font-medium text-foreground">
                                        Last Name
                                    </label>
                                    <Input
                                        {...register('lastname')}
                                        id="lastname"
                                        type="text"
                                        placeholder="Doe"
                                        className="fz-14"
                                    />
                                    {errors.lastname && (
                                        <p className="fz-12 text-destructive">{errors.lastname.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button
                                    type="submit"
                                    className="fz-16"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Updating...' : 'Update Profile'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => reset()}
                                    disabled={isLoading}
                                >
                                    Reset
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
