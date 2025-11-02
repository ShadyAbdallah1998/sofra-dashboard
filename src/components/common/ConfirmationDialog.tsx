"use client";

import { AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          handleCancel();
        }
      }}
    >
      <DialogContent
        className="rounded-xl shadow-sm border-border max-w-md"
        showCloseButton={true}
      >
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-full ${iconBgColor} flex items-center justify-center`}
            >
              <div className={iconTextColor}>{iconElement}</div>
            </div>
            <div className="flex-1 space-y-2">
              <DialogTitle className="fz-18 font-semibold text-foreground text-left">
                {title}
              </DialogTitle>
              <DialogDescription className="fz-14 text-muted-foreground text-left">
                {description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="shadow-sm"
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={variant}
            onClick={handleConfirm}
            disabled={isLoading}
            className="shadow-sm"
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

