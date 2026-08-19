import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const errorPopUp = (errorMessage) => {
  if (!errorMessage) return;
  toast.error(errorMessage, {
    position: "top-right",
    autoClose: 3500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  });
};

export const successPopUp = (successMessage) => {
  if (!successMessage) return;
  toast.success(successMessage, {
    position: "top-right",
    autoClose: 2800,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  });
};

export const infoPopUp = (infoMessage) => {
  if (!infoMessage) return;
  toast.info(infoMessage, {
    position: "top-right",
    autoClose: 2800,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  });
};
