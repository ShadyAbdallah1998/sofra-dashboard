"use client";

import { AlertCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  variant?: "destructive" | "default";
  icon?: ReactNode;
}

export const ConfirmationDialog = ({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  onCancel,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isLoading = false,
  variant = "destructive",
  icon,
}: ConfirmationDialogProps) => {
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onOpenChange(false);
  };

  const handleConfirm = () => {
    onConfirm();
  };

  const defaultIcon = <AlertCircle className="h-5 w-5 text-destructive" />;

  const iconElement = icon || defaultIcon;
  const iconBgColor =
    variant === "destructive" ? "bg-destructive/10" : "bg-primary/10";
  const iconTextColor =
    variant === "destructive" ? "text-destructive" : "text-primary";

  return (
    <AlertDialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          handleCancel();
        }
      }}
    >
      <AlertDialogContent className="rounded-xl shadow-sm border-border max-w-md">
        <AlertDialogHeader>
          <div className="flex items-start gap-4">
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-full ${iconBgColor} flex items-center justify-center`}
            >
              <div className={iconTextColor}>{iconElement}</div>
            </div>
            <div className="flex-1 space-y-2">
              <AlertDialogTitle className="fz-18 font-semibold text-foreground text-left">
                {title}
              </AlertDialogTitle>
              <AlertDialogDescription className="fz-14 text-muted-foreground text-left">
                {description}
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-2">
          <AlertDialogCancel
            onClick={handleCancel}
            className={cn(
              "shadow-sm",
              isLoading && "pointer-events-none opacity-50"
            )}
            disabled={isLoading}
          >
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className={cn(
              buttonVariants({ variant }),
              "shadow-sm",
              isLoading && "pointer-events-none opacity-50"
            )}
            disabled={isLoading}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
