/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import "./App.css"
import { useEffect, useState } from "react"
import axios from "axios"
import spotifyLogo from "/images/spotify_icon.png"

export default function App() {
  const CLIENT_ID = import.meta.env.VITE_SOME_CLIENT_ID
  const REDIRECT_URI = import.meta.env.VITE_SOME_REDIRECT_URI
  const AUTHORIZE = "https://accounts.spotify.com/authorize"
  const TOKEN = "https://accounts.spotify.com/api/token"
  const SEARCH = "https://api.spotify.com/v1/search"

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
          console.log(response.data)
          setToken(response.data.access_token)
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
    window.location.replace(REDIRECT_URI)
  }

  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])

  const handleSearch = () => {
    axios
      .get(`${SEARCH}?q=${searchQuery}&type=track`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setSearchResults(response.data.tracks.items)
      })
      .catch((error) => {
        console.error("Error searching tracks:", error)
      })
  }

  return (
    <>
      {!token ? (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#191919] to-[#050505]">
          <div className="card w-6/12 bg-[#0c0c0c] shadow-xl items-center text-center mx-auto rounded-lg">
            <div className="card-body">
              <div className="flex flex-col items-center justify-center h-96">
                <img src={spotifyLogo} alt="spotify logo" className="w-14 m-5" />
                <h1 className="card-title text-4xl text-white mb-10">Spotify Clone</h1>
                <div className="card-actions justify-center">
                  <button className="bg-[#0c0c0c] text-[#65d46e] border border-green-400 font-semibold py-4 px-12 rounded-full hover:bg-[#65d46e] hover:text-[#0c0c0c] hover:border-transparent" onClick={login}>
                    Login by Spotify
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-3 py-1 px-1">
          <div className="py-1 h-screen fixed w-[25rem]">
            <div className="bg-[#121212] rounded-xl py-4 px-2 mb-2">
              <h2 className="text-md font-semibold mx-4 cursor-pointer text-white">Home</h2>
            </div>
            <div className="bg-[#121212] rounded-xl py-4 px-2 h-screen">
              <h2 className="text-md font-semibold mb-4 mx-4 cursor-pointer">Your Library</h2>
              <div className="px-4 bg-[#242424] rounded-lg py-3 text-white">
                <p className="font-semibold mb-2">Create your first playlist</p>
                <p className="mb-2">It&apos;s easy, we&apos;ll help you</p>
                <button className="rounded-2xl bg-white hover:bg-[#f1f1f1] text-black px-5 py-1 mt-5 text-sm">Create playlist</button>
              </div>
            </div>
          </div>

          <div className="col-span-12 py-1 ml-[26rem]">
            <div className="overflow-x-auto bg-gradient-to-b from-[#212121] to-[#121212] rounded-xl py-4 px-6">
              <div className="grid grid-cols-6 gap-4">
                <div className="col-start-1 col-end-10">
                  <input type="text" placeholder="Search..." className="px-4 py-3 mb-3 me-3 rounded-3xl w-2/6" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                  <button className="btn btn-primary mt-2 px-5 py-3 rounded-xl" onClick={handleSearch}>
                    Search
                  </button>
                </div>
                <div className="col-end-12 col-span-2">
                  <button className="btn btn-danger p-3 rounded-lg" onClick={logout}>
                    Logout from Spotify
                  </button>
                </div>
              </div>
              <br />
              <h2 className="text-xl font-semibold mb-4">Song List</h2>
              <table className="table w-full cursor-pointer">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Title</th>
                    <th>Album</th>
                    <th>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.map((track, i) => (
                    <tr key={track.id} className="hover:bg-[#121212]">
                      <td>{i + 1}</td>
                      <td>
                        <div className="flex items-center space-x-3">
                          <div className="avatar">
                            <div className="mask w-12 h-12">
                              <img src={track.album.images[2].url} alt={track.album.name} />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">{track.name}</div>
                            <div className="text-sm opacity-50">{track.artists.map((artist) => artist.name).join(", ")}</div>
                          </div>
                        </div>
                      </td>
                      <td>{track.album.name}</td>
                      <td>
                        {(() => {
                          const menit = Math.floor(track.duration_ms / 60000)
                          const detikSisa = Math.floor((track.duration_ms % 60000) / 1000)
                          return `${menit}:${detikSisa.toString().padStart(2, "0")}`
                        })()}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th>No</th>
                    <th>Title</th>
                    <th>Album</th>
                    <th>Duration</th>
                  </tr>
                </tfoot>
              </table>
              <footer className="border-t border-gray-500 h-fit pt-8 py-16 mt-16">
                <p className="text-end">&copy; 2023 Spotify Clone</p>
              </footer>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
