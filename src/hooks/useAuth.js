import axios from "axios"
import { useEffect, useState } from "react"

export default function useAuth() {
  const CLIENT_ID = import.meta.env.VITE_SOME_CLIENT_ID
  const REDIRECT_URI = import.meta.env.VITE_SOME_REDIRECT_URI
  const AUTHORIZE = "https://accounts.spotify.com/authorize"
  const TOKEN = "https://accounts.spotify.com/api/token"
  const [token, setToken] = useState("")

  const login = async () => {
    const generateRandomString = (length) => {
      let text = ""
      const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

      for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
      }
      return text
    }

    const generateCodeChallenge = async (codeVerifier) => {
      const base64encode = (string) => {
        return btoa(String.fromCharCode.apply(null, new Uint8Array(string)))
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=+$/, "")
      }

      const encoder = new TextEncoder()
      const data = encoder.encode(codeVerifier)
      const digest = await window.crypto.subtle.digest("SHA-256", data)

      return base64encode(digest)
    }

    const codeVerifier = generateRandomString(128)

    await generateCodeChallenge(codeVerifier).then((codeChallenge) => {
      const state = generateRandomString(16)
      const scope =
        "user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-recently-played playlist-read-private user-read-currently-playing playlist-read-collaborative playlist-modify-private playlist-modify-public user-follow-modify user-follow-read user-top-read user-library-modify"

      localStorage.setItem("code_verifier", codeVerifier)

      const args = new URLSearchParams({
        response_type: "code",
        client_id: CLIENT_ID,
        scope: scope,
        redirect_uri: REDIRECT_URI,
        state: state,
        code_challenge_method: "S256",
        code_challenge: codeChallenge
      })

      window.location.replace(`${AUTHORIZE}?${args}`)
    })
  }

  const getToken = async () => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get("code")

    if (code && !token) {
      const codeVerifier = localStorage.getItem("code_verifier")

      const body = new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        code_verifier: codeVerifier
      })

      try {
        const response = await axios.post(TOKEN, body, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        })

        const accessToken = response.data.access_token
        if (accessToken) {
          setToken(accessToken)
          localStorage.setItem("accessToken", accessToken)
        } else {
          console.error("Access token not received in response.")
        }
      } catch (error) {
        console.error("Error fetching token:", error)
        // Handle error, show message to user, etc.
      }
    }
  }

  useEffect(() => {
    getToken()
  }, [])

  const logout = () => {
    setToken("")
    localStorage.removeItem("code_verifier")
    localStorage.removeItem("accessToken")
    window.location.replace(REDIRECT_URI)
  }

  return { token, login, logout }
}
