import { BrowserRouter } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import AppRoutes from "./routers/AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <div className="flex">
        <Sidebar /> {/* Sidebar must be inside BrowserRouter */}
        <div className="flex-grow">
          <AppRoutes /> {/* Routes are handled here */}
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
