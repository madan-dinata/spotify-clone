/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios"
import { useEffect } from "react"
import { useState } from "react"

export default function useAuth() {
  const CLIENT_ID = import.meta.env.VITE_SOME_CLIENT_ID
  const REDIRECT_URI = import.meta.env.VITE_SOME_REDIRECT_URI
  const AUTHORIZE = "https://accounts.spotify.com/authorize"
  const TOKEN = "https://accounts.spotify.com/api/token"
  const [token, setToken] = useState("")

  const login = async () => {
    const generateRandomString = (length) => {
      let text = ""
      let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

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

    let codeVerifier = generateRandomString(128)

    await generateCodeChallenge(codeVerifier).then((codeChallenge) => {
      let state = generateRandomString(16)
      let scope = "playlist-modify-private"

      localStorage.setItem("code_verifier", codeVerifier)

      let args = new URLSearchParams({
        response_type: "code",
        client_id: CLIENT_ID,
        scope: scope,
        redirect_uri: REDIRECT_URI,
        state: state,
        code_challenge_method: "S256",
        code_challenge: codeChallenge,
      })

      window.location.replace(`${AUTHORIZE}?${args}`)
    })
  }

  const getToken = async (token) => {
    const urlParams = new URLSearchParams(window.location.search)
    let code = urlParams.get("code")

    if (code && !token) {
      let codeVerifier = localStorage.getItem("code_verifier")

      let body = new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        code_verifier: codeVerifier,
      })

      await axios
        .post(TOKEN, body, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })
        .then((response) => {
          setToken(response.data.access_token)
          localStorage.setItem("accessToken", response.data.access_token)
        })
        .catch((error) => {
          console.error("Error:", error)
        })
    }
  }

  useEffect(() => {
    getToken(token)
  }, [token])

  const logout = () => {
    setToken("")
    localStorage.removeItem("code_verifier")
    localStorage.removeItem("accessToken")
    window.location.replace(REDIRECT_URI)
  }

  return { token, login, logout }
}
