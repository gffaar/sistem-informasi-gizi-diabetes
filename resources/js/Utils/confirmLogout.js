import { router } from "@inertiajs/react";
import Swal from "sweetalert2";

export function confirmLogout() {
  Swal.fire({
    title: "Keluar dari Sistem?",
    text: "Apakah Anda yakin ingin keluar dari akun ini?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Logout",
    cancelButtonText: "Batal",
    reverseButtons: true,
    buttonsStyling: false,
    customClass: {
      popup: "rounded-3xl shadow-2xl",
      confirmButton:
        "btn bg-red-600 hover:bg-red-700 border-red-600 text-white px-5",
      cancelButton:
        "btn bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700 px-5 mr-2",
    },
    showClass: {
      popup: "swal2-show",
      backdrop: "swal2-backdrop-show",
      icon: "swal2-icon-show",
    },
    hideClass: {
      popup: "swal2-hide",
      backdrop: "swal2-backdrop-hide",
      icon: "swal2-icon-hide",
    },
  }).then((result) => {
    if (result.isConfirmed) {
      router.get("/logout");
    }
  });
}
