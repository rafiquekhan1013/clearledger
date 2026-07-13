import { useEffect } from "react";
import { useRoutes } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import routes from "./routes";
import { useSendDeviceDataMutation } from "./services/surveyApi";
import { generateFingerprint } from "./utils/fingerprint";

function App() {
  const element = useRoutes(routes);
  const { isAuthenticated } = useAuth();
  const [sendFingerprint] = useSendDeviceDataMutation();

  useEffect(() => {
    const reportFingerprint = async () => {
      try {
        const fingerprint = await generateFingerprint().catch(() => undefined);
        await sendFingerprint({ fingerprint }).unwrap();
      } catch (error) {
        console.error("Failed to capture fingerprint:", error);
      }
    };

    if (isAuthenticated) {
      reportFingerprint();
    }
  }, [isAuthenticated, sendFingerprint]);

  return <>{element}</>;
}

export default App;
