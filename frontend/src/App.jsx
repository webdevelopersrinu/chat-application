import { Route, Routes } from "react-router"
import Home from "./pages/Home"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import ProtectedRoute from "./components/ProtectedRoute"
import Loading from "./components/Loading"
import { useSelector } from "react-redux"

const App = () => {
  const isLoading = useSelector(state => state.loader.isLoader)
  return <div>
    {isLoading && <Loading />}
    <Routes>
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  </div>

}

export default App