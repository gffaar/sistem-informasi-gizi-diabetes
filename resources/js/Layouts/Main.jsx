import { usePage } from "@inertiajs/react";
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function LayoutMain({ children }) {
  const { flash = {} } = usePage().props;

  useEffect(() => {
    if (flash.success) {
      toast.success(flash.success, {
        id: "flash-success",
        iconTheme: {
          primary: "#16a34a",
          secondary: "#ffffff",
        },
      });
    }

    if (flash.error) {
      toast.error(flash.error, { id: "flash-error" });
    }
  }, [flash.success, flash.error]);

  return (
    <>
      {children}

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "var(--color-base-100)",
            border: "1px solid var(--app-border)",
            color: "var(--color-base-content)",
          },
          success: {
            style: {
              background: "#dcfce7",
              border: "1px solid rgba(22, 163, 74, 0.35)",
              color: "#14532d",
              fontWeight: 700,
            },
          },
        }}
      />
    </>
  );
}
