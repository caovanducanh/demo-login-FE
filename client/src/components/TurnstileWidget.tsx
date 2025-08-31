import React, { useEffect, useRef } from "react";

interface TurnstileWidgetProps {
  sitekey: string;
  onVerify?: (token: string) => void;
  theme?: "light" | "dark";
  action?: string;
  widgetName?: string;
}

declare global {
  interface Window {
    turnstile?: any;
  }
}

const TURNSTILE_SCRIPT_ID = "cf-turnstile-script";

export const TurnstileWidget: React.FC<TurnstileWidgetProps> = ({
  sitekey,
  onVerify,
  theme = "light",
  action = "login",
  widgetName = "demologin-fe",
}) => {
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    function renderWidget() {
      if (window.turnstile && widgetRef.current) {
        if (widgetIdRef.current) {
          window.turnstile.remove(widgetIdRef.current);
        }
        widgetIdRef.current = window.turnstile.render(widgetRef.current, {
          sitekey,
          theme,
          action,
          "widget-name": widgetName,
          callback: (token: string) => {
            if (onVerify) onVerify(token);
          },
        });
      }
    }

    if (window.turnstile) {
      renderWidget();
    } else {
      const interval = setInterval(() => {
        if (window.turnstile) {
          clearInterval(interval);
          renderWidget();
        }
      }, 200);
      return () => clearInterval(interval);
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
    };
  }, [sitekey, theme, action, widgetName, onVerify]);

  return (
    <div
      ref={widgetRef}
      style={{
        minHeight: 65,
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    />
  );
};

export default TurnstileWidget;
