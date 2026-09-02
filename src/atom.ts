import { atom } from "recoil";

export const signupFormState = atom({
  key: "signupFormState",
  default: {
    email: "",
    password: "",
    firstname: "",
    lastname: "",
  },
});

export const loginFormState = atom({
  key: "loginFormState",
  default: {
    email: "",
    password: "",
  },
});
