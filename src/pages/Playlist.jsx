import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

export default function Playlist() {
  const { id } = useParams()

  const [playlist, setPlaylist] = useState([])

  const handlePlaylist = async (id) => {
    const accessToken = localStorage.getItem("accessToken")

    try {
      const response = await axios.get(`https://api.spotify.com/v1/playlists/${id}/tracks`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      setPlaylist(response.data.items)
    } catch (error) {
      console.error("Error getting Playlist details:", error)
    }
  }

  useEffect(() => {
    handlePlaylist(id)
  }, [id])

  return (
    <>
      {playlist.length === 0 ? (
        <h1>...</h1>
      ) : (
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
            {playlist?.map((item, i) => (
              <tr key={item.track.id} className="hover:bg-[#121212]">
                <td>{i + 1}</td>
                <td>
                  <div className="flex items-center space-x-3">
                    <div className="avatar">
                      <div className="mask w-12 h-12">
                        <img src={item.track.album.images[2].url} alt={item.track.album.name} />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{item.track.name}</div>
                      <div className="text-sm opacity-50">
                        {item.track.artists.map((artist) => artist.name).join(", ")}
                      </div>
                    </div>
                  </div>
                </td>
                <td>{item.track.album.name}</td>
                <td>
                  {(() => {
                    const menit = Math.floor(item.track.duration_ms / 60000)
                    const detikSisa = Math.floor((item.track.duration_ms % 60000) / 1000)
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
      )}
    </>
  )
}
