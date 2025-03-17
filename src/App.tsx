import { BrowserRouter as Router } from "react-router-dom";

import "./shared/styles/global.scss";
import "./shared/styles/index.scss";
import Routing from "./pages";

function App() {
  return (
    <>
      <Router>
        <Routing />
      </Router>
    </>
  );
}

export default App;
