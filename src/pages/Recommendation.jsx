import axios from "axios"
import { useEffect, useState } from "react"
import { Button } from "@chakra-ui/react"

export default function Recommendation() {
  const [recommendation, setRecommendation] = useState([])

  const handleRecom = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/v1/playlists/most-played")
      setRecommendation(res.data.data)
    } catch (error) {
      console.error("Error get recommendation", error)
    }
  }

  useEffect(() => {
    handleRecom()
  }, [])

  // add playlist #2
  const playSong = async (id) => {
    try {
      const res = await axios.put(`http://localhost:3000/api/v1/playlists/${id}`)
      console.log(res.data)
    } catch (error) {
      console.error("Error add Playlist", error)
    }
  }

  return (
    <>
      {/* recomemndation */}
      <h2 className="text-xl font-semibold mb-4">Recommendation List</h2>
      <table className="table w-full">
        <thead>
          <tr>
            <th></th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody className="cursor-pointer">
          {recommendation.map((track) => (
            <tr key={track.id} className="hover:bg-[#121212]">
              <td>
                <div className="flex items-center space-x-3">
                  <div>
                    <div className="font-bold">{track.title}</div>
                    <div className="text-sm opacity-50">{track.artist}</div>
                  </div>
                </div>
              </td>
              <td>{track.playCount}</td>
              <td>
                <Button colorScheme="teal" variant="outline" onClick={() => playSong(track.id)}>
                  Play
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
