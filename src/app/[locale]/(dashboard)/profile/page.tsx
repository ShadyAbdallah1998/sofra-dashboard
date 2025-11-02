"use client";

import { useEffect, useState } from "react";
import { useAuthStore, useUsersStore } from "@/store";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { UpdateUserRequest } from "@/types/users.types";
import { useTranslations } from "next-intl";
import { Mail } from "lucide-react";
import {
  getInitials,
  getAvatarColor,
  isValidImageUrl,
  AvatarPreview,
} from "@/lib/helpers/avatar";
import { toast } from "sonner";

export default function ProfilePage() {
  const t = useTranslations("Profile");
  const router = useRouter();
  const [isSendingVerification, setIsSendingVerification] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  // Create schema with translated error messages
  const updateProfileSchema = z.object({
    fullname: z
      .string()
      .min(2, t("validation.fullnameMin"))
      .optional()
      .or(z.literal("")),
    firstname: z
      .string()
      .min(2, t("validation.firstnameMin"))
      .optional()
      .or(z.literal("")),
    lastname: z
      .string()
      .min(2, t("validation.lastnameMin"))
      .optional()
      .or(z.literal("")),
    picture: z
      .string()
      .url(t("validation.pictureUrl"))
      .optional()
      .or(z.literal("")),
  });

  type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

  // Auth store
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const sendVerifyEmail = useAuthStore((state) => state.sendVerifyEmail);

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
    watch,
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
  });

  const pictureUrl = watch("picture");
  const firstnameValue = watch("firstname");
  const lastnameValue = watch("lastname");

  // Fetch user data on mount
  useEffect(() => {
    if (user?.id) {
      getUser(user.id);
    } else {
      router.push("/auth/login");
    }

    return () => {
      useUsersStore.getState().reset();
    };
  }, [user?.id, getUser, router]);

  // Update form when user data is loaded
  useEffect(() => {
    if (currentUser) {
      reset({
        fullname: currentUser.fullname || "",
        firstname: currentUser.firstname || "",
        lastname: currentUser.lastname || "",
        picture: currentUser.picture || "",
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

      // Handle picture: send null if empty, otherwise send the URL
      if (data.picture === "" || !data.picture) {
        updateData.picture = null;
      } else {
        updateData.picture = data.picture;
      }

      await updateUser(user.id, updateData);

      // Update auth store with new user data
      const updatedUser = useUsersStore.getState().currentUser;
      if (updatedUser) {
        setUser(updatedUser);
      }

      toast.success(t("updateSuccess"));
    } catch (err) {
      console.error("Failed to update profile:", err);
      toast.error(t("updateError"));
    }
  };

  const handleSendVerificationEmail = async () => {
    if (!user?.email) return;

    setIsSendingVerification(true);
    setVerificationSent(false);
    try {
      await sendVerifyEmail({ email: user.email });
      setVerificationSent(true);
      toast.success(t("verificationSent"));
    } catch (err) {
      console.error("Failed to send verification email:", err);
      toast.error(t("verificationError"));
    } finally {
      setIsSendingVerification(false);
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
            <h1 className="fz-25 font-bold text-foreground">{t("title")}</h1>
            <Button variant="outline" onClick={() => router.push("/dashboard")}>
              {t("backToDashboard")}
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
              <p className="ml-4 fz-14 text-muted-foreground">{t("loading")}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                {/* Email with verification status */}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className=" fz-14 font-medium text-foreground flex justify-between"
                  >
                    {t("email")}
                    {!user.emailVerified ? (
                      <div className="flex items-center justify-between gap-2 mb-2">
                        {/* <p className="fz-12 text-destructive font-light">
                          {t("emailNotVerified")}
                        </p> */}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleSendVerificationEmail}
                          disabled={isSendingVerification}
                          className="h-7 px-2 fz-11 text-destructive hover:text-destructive/80"
                        >
                          <Mail className="h-3 w-3 me-1" />
                          {isSendingVerification
                            ? t("sending")
                            : t("sendVerification")}
                        </Button>
                      </div>
                    ) : null}
                  </label>

                  <Input
                    id="email"
                    type="email"
                    value={user.email}
                    disabled
                    className="fz-14 bg-muted cursor-not-allowed"
                  />

                  {/* Email verification status under input */}
                  {!user.emailVerified ? (
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <p className="fz-12 text-destructive font-light">
                        {t("emailNotVerified")}
                      </p>
                    </div>
                  ) : (
                    <p className="fz-12 text-chart-1">{t("emailIsVerified")}</p>
                  )}

                  {verificationSent && (
                    <div className="p-2 bg-chart-1/10 border border-chart-1/20 rounded-lg">
                      <p className="fz-12 text-chart-1">
                        {t("verificationSent")}
                      </p>
                    </div>
                  )}
                </div>

                {/* Email Verified Status */}
                {/* <div className="space-y-2">
                                    <label htmlFor="emailVerified" className="block fz-14 font-medium text-foreground">
                                        {t('emailVerified')}
                                    </label>
                                    <Input
                                        id="emailVerified"
                                        type="text"
                                        value={user.emailVerified ? t('verified') : t('notVerified')}
                                        disabled
                                        className="fz-14 bg-muted cursor-not-allowed"
                                    />
                                </div> */}

                {/* Role */}
                {user.role && (
                  <div className="space-y-2">
                    <label
                      htmlFor="role"
                      className="block fz-14 font-medium text-foreground"
                    >
                      {t("role")}
                    </label>
                    <Input
                      id="role"
                      type="text"
                      value={user.role}
                      disabled
                      className="fz-14 bg-muted cursor-not-allowed"
                    />
                  </div>
                )}

                {/* Joined At */}
                <div className="space-y-2">
                  <label
                    htmlFor="joinedAt"
                    className="block fz-14 font-medium text-foreground"
                  >
                    {t("joinedAt")}
                  </label>
                  <Input
                    id="joinedAt"
                    type="text"
                    value={new Date(user.joinedAt).toLocaleDateString()}
                    disabled
                    className="fz-14 bg-muted cursor-not-allowed"
                  />
                </div>

                {/* Divider */}
                <div className="border-t border-border my-6"></div>

                <div className="space-y-2">
                  <label
                    htmlFor="fullname"
                    className="block fz-14 font-medium text-foreground"
                  >
                    {t("fullName")}
                  </label>
                  <Input
                    {...register("fullname")}
                    id="fullname"
                    type="text"
                    placeholder={t("fullNamePlaceholder")}
                    className="fz-14"
                  />
                  {errors.fullname && (
                    <p className="fz-12 text-destructive">
                      {errors.fullname.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="firstname"
                    className="block fz-14 font-medium text-foreground"
                  >
                    {t("firstName")}
                  </label>
                  <Input
                    {...register("firstname")}
                    id="firstname"
                    type="text"
                    placeholder={t("firstNamePlaceholder")}
                    className="fz-14"
                  />
                  {errors.firstname && (
                    <p className="fz-12 text-destructive">
                      {errors.firstname.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="lastname"
                    className="block fz-14 font-medium text-foreground"
                  >
                    {t("lastName")}
                  </label>
                  <Input
                    {...register("lastname")}
                    id="lastname"
                    type="text"
                    placeholder={t("lastNamePlaceholder")}
                    className="fz-14"
                  />
                  {errors.lastname && (
                    <p className="fz-12 text-destructive">
                      {errors.lastname.message}
                    </p>
                  )}
                </div>

                {/* Profile Picture */}
                <div className="space-y-2">
                  <label
                    htmlFor="picture"
                    className="block fz-14 font-medium text-foreground"
                  >
                    {t("profilePicture")}
                  </label>

                  {/* Image Preview */}
                  <div className="flex items-center gap-4 mb-3">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden bg-muted border-2 border-border shadow-sm flex items-center justify-center">
                      {isValidImageUrl(pictureUrl) ? (
                        <AvatarPreview
                          url={pictureUrl!}
                          firstname={firstnameValue}
                          lastname={lastnameValue}
                          userEmail={user.email}
                        />
                      ) : (
                        <div
                          className={`w-full h-full flex items-center justify-center ${getAvatarColor(
                            user.email
                          )}`}
                        >
                          <span className="text-white font-semibold fz-20">
                            {getInitials(firstnameValue, lastnameValue)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="fz-12 text-muted-foreground">
                        {isValidImageUrl(pictureUrl)
                          ? t("currentPicture")
                          : t("noPicture")}
                      </p>
                    </div>
                  </div>

                  <Input
                    {...register("picture")}
                    id="picture"
                    type="url"
                    placeholder={t("profilePicturePlaceholder")}
                    className="fz-14"
                  />
                  {errors.picture && (
                    <p className="fz-12 text-destructive">
                      {errors.picture.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="fz-16" disabled={isLoading}>
                  {isLoading ? t("updating") : t("updateButton")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => reset()}
                  disabled={isLoading}
                >
                  {t("reset")}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
