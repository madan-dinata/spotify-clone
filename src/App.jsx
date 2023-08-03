/* eslint-disable react-hooks/exhaustive-deps */
import "./App.css"
import { useState } from "react"
import axios from "axios"
import Login from "./pages/Login"
import useAuth from "./hooks/useAuth"
import { useEffect } from "react"

export default function App() {
  const { token, login, logout } = useAuth()

  const SEARCH = "https://api.spotify.com/v1/search"

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

  useEffect(() => {
    if (searchQuery) {
      const debounceSearch = setTimeout(() => {
        handleSearch()
      }, 500)

      return () => {
        clearTimeout(debounceSearch)
      }
    }
  }, [searchQuery])

  return (
    <>
      {!localStorage.getItem("accessToken") ? (
        <Login token={token} handleLogin={login} />
      ) : (
        <div className="grid grid-cols-12 gap-3 py-1 px-1">
          <div className="py-1 h-screen fixed w-[25rem]">
            <div className="bg-[#121212] rounded-xl py-4 px-2 mb-2">
              <h2 className="text-md font-semibold mx-4 my-2 cursor-pointer text-white">Home</h2>
              <h2 className="text-md font-semibold mx-4 my-2 cursor-pointer">Search</h2>
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
                </div>
                <div className="col-end-12 col-span-2">
                  <button className="btn btn-danger p-3 rounded-lg" onClick={logout}>
                    Logout from Spotify
                  </button>
                </div>
              </div>
              <br />
              <h2 className="text-xl font-semibold mb-4">Song List</h2>
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Title</th>
                    <th>Album</th>
                    <th>Duration</th>
                  </tr>
                </thead>
                <tbody className="cursor-pointer">
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
