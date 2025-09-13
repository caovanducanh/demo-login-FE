import 'antd/dist/reset.css';

import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

const root = createRoot(document.getElementById("root")!);
root.render(
	<QueryClientProvider client={queryClient}>
		<App />
	</QueryClientProvider>
);
