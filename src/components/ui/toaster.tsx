import * as ToastPrimitives from "@radix-ui/react-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastTitle,
  ToastViewport,
} from "./toast";
import { useToast } from "../../hooks/useToast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastPrimitives.Provider>
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast key={id} {...props}>
          <div className="grid gap-1">
            {title ? <ToastTitle>{title}</ToastTitle> : null}
            {description ? (
              <ToastDescription>{description}</ToastDescription>
            ) : null}
          </div>
          {action}
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastPrimitives.Provider>
  );
}
