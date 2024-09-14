import { Navigate } from "react-router-dom";
import { useTokenStore } from "./store/use-bear-store";

function App() {
  const { init } = useTokenStore();
  if (!init) return <Navigate to={"/dashboard"} />;
  return <div>hello</div>;
}

export default App;
