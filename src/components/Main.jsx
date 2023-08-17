import { Routes, Route } from "react-router-dom"
import Home from "../pages/Home"
import Playlist from "../pages/Playlist"
import CreatePlaylist from "../pages/CreatePlaylist"
import Recommendation from "../pages/Recommendation"

export default function Main() {
  return (
    <div className="col-span-12 py-1 ml-[26rem]">
      <div className="overflow-x-auto bg-gradient-to-b from-[#212121] to-[#121212] rounded-xl py-4 px-6">
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/recommendation" element={<Recommendation />} />
          <Route path="/create-playlist/" element={<CreatePlaylist />} />
          <Route path="/playlist/:id" element={<Playlist />} />
        </Routes>

        {/* footer */}
        <footer className="border-t border-gray-500 h-fit pt-8 py-16 mt-16">
          <p className="text-end">&copy; 2023 Spotify Clone</p>
        </footer>
      </div>
    </div>
  )
}
