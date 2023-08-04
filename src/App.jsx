/* eslint-disable react-hooks/exhaustive-deps */
import "./App.css"
import { useState } from "react"
import axios from "axios"
import Login from "./pages/Login"
import useAuth from "./hooks/useAuth"
import { useEffect } from "react"
import songImage from "/images/song.png"

export default function App() {
  const { token, login, logout } = useAuth()

  const SEARCH = "https://api.spotify.com/v1/search"

  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])

  const handleSearch = async () => {
    return await axios
      .get(`${SEARCH}?q=${searchQuery}&type=track`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((res) => {
        setSearchResults(res.data.tracks.items)
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

  // get recommendation
  // eslint-disable-next-line no-unused-vars
  const [recommendation, setRecommendation] = useState([])

  const handleRecom = async (token) => {
    // function masih harus karena terlambat ngeget token jadi kebutu error dulu
    return await axios
      .get("https://api.spotify.com/v1/recommendations?seed_artists=4NHQUGzhtTLFvgF5SZesLK&seed_genres=classical%2Ccountry&seed_tracks=0c6xIDDpzE81m2q797ordA", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setRecommendation(res.data)
      })
      .catch((err) => {
        console.error("Error get recommendation", err)
      })
  }

  useEffect(() => {
    handleRecom(localStorage.getItem("accessToken"))
  }, [token])

  // playlist
  const [playlist, setPlaylist] = useState([])

  const getPlaylist = async (token) => {
    return await axios
      .get("https://api.spotify.com/v1/me/playlists", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data)
        setPlaylist(res.data)
      })
      .catch((err) => {
        console.error("Error get playlist", err)
      })
  }

  const handlePlaylist = () => {
    console.log(playlist)
  }

  useEffect(() => {
    getPlaylist(localStorage.getItem("accessToken"))
  }, [token])

  return (
    <>
      {!localStorage.getItem("accessToken") ? (
        <Login token={token} handleLogin={login} />
      ) : (
        <div className="grid grid-cols-12 gap-3 py-1 px-1">
          <div className="py-1 h-[99vh] fixed w-[25rem]">
            <div className="bg-[#121212] rounded-xl py-4 px-2 mb-2">
              <h2 className="text-md font-semibold mx-4 my-2 cursor-pointer text-white">Home</h2>
              <h2 className="text-md font-semibold mx-4 my-2 cursor-pointer">Search</h2>
            </div>
            <div className="bg-[#121212] py-4 px-2 max-h-full">
              <div className="flex justify-between">
                <h2 className="text-md font-semibold mb-4 mx-4 cursor-pointer">Your Library</h2>
                <span className="btn" onClick={handlePlaylist}>
                  +
                </span>
              </div>
              {!playlist ? (
                <>
                  <div className="px-4 bg-[#242424] rounded-lg py-3 text-white">
                    <p className="font-semibold mb-2" onClick={handlePlaylist}>
                      Create your first playlist
                    </p>
                    <p className="mb-2">It&apos;s easy, we&apos;ll help you</p>
                    <button className="rounded-2xl bg-white hover:bg-[#f1f1f1] text-black px-5 py-1 mt-5 text-sm">Create playlist</button>
                  </div>
                </>
              ) : (
                <ul>
                  {playlist.items.map((item) => (
                    <li key={item.id} className="hover:bg-[#242424] cursor-pointer mt-1 p-3 rounded-md">
                      <div className="flex items-center space-x-3">
                        <div className="avatar">
                          <div className="mask w-12 h-12">
                            <img src={item.images.length > 0 ? item.images[0].url : songImage} alt={item.name} className="bg-[#282828]" />
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <div className="font-bold whitespace-no-wrap truncate w-64">{item.name}</div>
                          <div className="flex text-sm opacity-50">
                            {item.type} - {item.owner.display_name}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
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
              {/* search */}
              {searchQuery && (
                <>
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
                      {searchResults?.map((track, i) => (
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
                </>
              )}

              {/* recomemndation */}
              {!searchQuery && (
                <>
                  <h2 className="text-xl font-semibold mb-4">Recommendation List</h2>
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
                      {recommendation?.tracks.map((track, i) => (
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
                </>
              )}

              {/* footer */}
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
