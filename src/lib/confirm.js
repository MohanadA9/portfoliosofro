import Swal from "sweetalert2";

/** SweetAlert2 themed for the academic dark/light palette. */
export async function confirmDelete(message = "This action cannot be undone.") {
  const isDark = document.documentElement.classList.contains("dark");
  const res = await Swal.fire({
    title: "Are you sure?",
    text: message,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it",
    cancelButtonText: "Cancel",
    reverseButtons: true,
    background: isDark ? "#0b1424" : "#ffffff",
    color: isDark ? "#e2e8f0" : "#0f172a",
    confirmButtonColor: "#0ea5e9",
    cancelButtonColor: isDark ? "#334155" : "#cbd5e1",
    customClass: {
      popup: "rounded-2xl",
    },
  });
  return res.isConfirmed;
}
export async function successAlert(title = "Done", text) {
  const isDark = document.documentElement.classList.contains("dark");
  return Swal.fire({
    title,
    text,
    icon: "success",
    timer: 1600,
    showConfirmButton: false,
    background: isDark ? "#0b1424" : "#ffffff",
    color: isDark ? "#e2e8f0" : "#0f172a",
    customClass: {
      popup: "rounded-2xl",
    },
  });
}
