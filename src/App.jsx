import "./App.css"
import Login from "./pages/Login"
import useAuth from "./hooks/useAuth"
import Main from "./components/Main"
import Nav from "./components/Nav"

export default function App() {
  const { login } = useAuth()
  return (
    <>
      {!localStorage.getItem("accessToken") ? (
        <Login handleLogin={login} />
      ) : (
        <div className="grid grid-cols-12 gap-3 py-1 px-1">
          <Nav />
          <Main />
        </div>
      )}
    </>
  )
}
