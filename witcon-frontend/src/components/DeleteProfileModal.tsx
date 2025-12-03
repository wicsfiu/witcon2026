import { useEffect } from "react";
import Header from "../components/text/Header";
import Text from "../components/text/Text";

interface DeleteProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type: "confirm" | "success" | "error";
  message?: string;
}

export default function DeleteProfileModal({
  isOpen,
  onClose,
  onConfirm,
  type,
  message,
}: DeleteProfileModalProps) {
  // Close modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup: restore scroll when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getContent = () => {
    switch (type) {
      case "confirm":
        return {
          header: "Delete Profile?",
          body: "Are you sure you want to delete your profile? This will permanently delete all your information from our systems. This action cannot be undone.",
          buttonText: "Delete Profile",
          buttonClass: "bg-[color:var(--color-primary-pink)] text-white hover:bg-pink-700",
        };
      case "success":
        return {
          header: "Profile Deleted",
          body: message || "Your profile has been successfully deleted.",
          buttonText: "OK",
          buttonClass: "bg-[color:var(--color-primary-pink)] text-white hover:bg-pink-700",
        };
      case "error":
        return {
          header: "Error",
          body: message || "Failed to delete profile. Please try again.",
          buttonText: "OK",
          buttonClass: "bg-[color:var(--color-primary-pink)] text-white hover:bg-pink-700",
        };
    }
  };

  const content = getContent();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center animate-fadeIn px-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={type === "confirm" ? undefined : onClose}
    >
      <div
        className="rounded-2xl p-6 max-w-md w-full shadow-lg relative animate-scaleIn mx-4"
        style={{ backgroundColor: "#f9d2e8" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close X button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-[color:var(--color-primary-brown)] hover:text-[color:var(--color-primary-brown)]/80 text-xl font-bold"
        >
          ×
        </button>

        <div className="mt-5 mb-3">
          <Header className="text-2xl sm:text-3xl mb-4 sm:mb-6 text-center text-[color:var(--color-primary-brown)]">
            {content.header}
          </Header>
          <Text className="pb-4 text-[color:var(--color-primary-brown)] text-sm sm:text-base text-center font-bold">
            {content.body}
          </Text>

          <div className="flex justify-center gap-3 mt-4">
            <button
              onClick={type === "confirm" ? onConfirm : onClose}
              className={`px-6 py-2 rounded-full font-medium transition ${content.buttonClass}`}
            >
              {content.buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

