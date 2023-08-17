import axios from "axios"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import useAuth from "../hooks/useAuth"

export default function Nav() {
  const { logout } = useAuth()
  // playlist
  const [playlist, setPlaylist] = useState([])

  const getPlaylist = async (token) => {
    return await axios
      .get("https://api.spotify.com/v1/me/playlists", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => {
        console.log(res.data)
        setPlaylist(res.data)
      })
      .catch((err) => {
        console.error("Error get playlist", err)
      })
  }

  useEffect(() => {
    getPlaylist(localStorage.getItem("accessToken"))
  }, [])

  const handlePlaylist = () => {
    // return
  }

  return (
    <div className="py-1 h-[99vh] fixed w-[25rem]">
      <div className="bg-[#121212] rounded-xl py-4 px-2 mb-2">
        <Link to="/">
          <h2 className="text-md font-semibold mx-4 my-2 cursor-pointer text-white">Home</h2>
        </Link>
        <Link to="/recommendation">
          <h2 className="text-md font-semibold mx-4 my-2 cursor-pointer">Recommendation</h2>
        </Link>
        <h2 className="text-md font-semibold mx-4 my-2 cursor-pointer" onClick={logout}>
          Logout from Spotify
        </h2>
      </div>
      <div className="bg-[#121212] py-4 px-2 max-h-full">
        <div className="flex justify-between">
          <Link to="/create-playlist">
            <h2 className="text-md font-semibold mb-4 mx-4 cursor-pointer">Create Playlist</h2>
          </Link>
          {/* <span className="btn cursor-pointer" onClick={handlePlaylist}>
            +
          </span> */}
        </div>
        {!playlist ? (
          <>
            <div className="px-4 bg-[#242424] rounded-lg py-3 text-white">
              <p className="font-semibold mb-2" onClick={handlePlaylist}>
                Create your first playlist
              </p>
              <p className="mb-2">It&apos;s easy, we&apos;ll help you</p>
              <button className="rounded-2xl bg-white hover:bg-[#f1f1f1] text-black px-5 py-1 mt-5 text-sm">
                Create playlist
              </button>
            </div>
          </>
        ) : (
          <ul>
            {/* {playlist.items.map((item) => (
              <li key={item.id} className="hover:bg-[#242424] cursor-pointer mt-1 p-3 rounded-md">
                <Link to={`/playlist/${item.id}`}>
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
                </Link>
              </li>
            ))} */}
          </ul>
        )}
      </div>
    </div>
  )
}
