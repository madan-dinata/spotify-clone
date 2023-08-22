import axios from "axios"
import { useState, useEffect } from "react"

export default function Home() {
  const SEARCH = "https://api.spotify.com/v1/search"

  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])

  const handleSearch = async () => {
    const accessToken = localStorage.getItem("accessToken")

    try {
      const response = await axios.get(`${SEARCH}?q=${searchQuery}&type=track`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      setSearchResults(response.data.tracks.items)
    } catch (error) {
      console.error("Error searching tracks:", error)
    }
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

  const [recommendation, setRecommendation] = useState([])

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    handleRecom(token)
  }, [])

  const handleRecom = async (token) => {
    try {
      const response = await axios.get(
        "https://api.spotify.com/v1/recommendations?seed_artists=4NHQUGzhtTLFvgF5SZesLK&seed_genres=classical%2Ccountry&seed_tracks=0c6xIDDpzE81m2q797ordA",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      setRecommendation(response.data.tracks)
    } catch (err) {
      console.error("Error getting recommendation", err)
    }
  }

  const addToPlaylist = async (uri) => {
    const token = localStorage.getItem("accessToken")
    try {
      const response = await axios.post(
        "https://api.spotify.com/v1/playlists/2lW7YFkq5E1teENIgl0nNI/tracks", // Ganti dengan ID playlist yang sesuai
        {
          uris: [uri],
          position: 0
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      console.log(response.data)
    } catch (err) {
      console.error("Error adding to Playlist", err)
    }
  }

  return (
    <>
      <div className="grid grid-cols-6 gap-4">
        <div className="col-start-1 col-end-10">
          <input
            type="text"
            placeholder="Search..."
            className="px-4 py-3 mb-3 me-3 rounded-3xl w-2/6 text-black"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {/* logout button */}
        <div className="col-end-12 col-span-2"></div>
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
                <tr key={track.id} className="hover:bg-[#121212]" onClick={() => addToPlaylist(track.uri)}>
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
                        <div className="text-sm opacity-50">
                          {track.artists.map((artist) => artist.name).join(", ")}
                        </div>
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
              {recommendation?.map((track, i) => (
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
                        <div className="text-sm opacity-50">
                          {track.artists.map((artist) => artist.name).join(", ")}
                        </div>
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
    </>
  )
}
