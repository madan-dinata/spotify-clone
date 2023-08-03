/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import spotifyLogo from "/images/spotify_icon.png"

export default function Login({ token, handleLogin }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#191919] to-[#050505]">
      <div className="card w-6/12 bg-[#0c0c0c] shadow-xl items-center text-center mx-auto rounded-lg">
        <div className="card-body">
          <div className="flex flex-col items-center justify-center h-96">
            <img src={spotifyLogo} alt="spotify logo" className="w-14 m-5" />
            <h1 className="card-title text-4xl text-white mb-10">Spotify Clone</h1>
            <div className="card-actions justify-center">
              <button className="bg-[#0c0c0c] text-[#65d46e] border border-green-400 font-semibold py-4 px-12 rounded-full hover:bg-[#65d46e] hover:text-[#0c0c0c] hover:border-transparent" onClick={handleLogin}>
                Login by Spotify
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
