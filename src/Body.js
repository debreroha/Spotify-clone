import React from "react";
import "./Body.css";
import Header from "./Header";
import { useStateValue } from "./StateProvider";
import SongRow from "./SongRow";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import FavoriteIcon from "@material-ui/icons/Favorite";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";

function Body({ spotify }) {
  const [{ discover_weekly }, dispatch] = useStateValue();

  // playlist of songs
  const playPlaylist = (id) => {
    spotify
      .play({
        context_uri: `spotify:playlist:${id}`,
      })
      .then((res) => {
        spotify.getMyCurrentPlayingTrack().then((r) => {
          dispatch({
            type: "SET_ITEM",
            item: r.item,
          });
          dispatch({
            type: "SET_PLAYING",
            playing: true,
          });
        }).catch((err) => {
          console.error("Error getting current playing track:", err);
        });
      })
      .catch((err) => {
        if (err.status === 403 && err.responseText.includes("PREMIUM_REQUIRED")) {
          alert("This feature requires a Spotify Premium account.");
        } else {
          console.error("Error playing playlist:", err);
        }
      });
  };

  // play song
  const playSong = (id) => {
    spotify
      .play({
        uris: [`spotify:track:${id}`],
      })
      .then((res) => {
        spotify.getMyCurrentPlayingTrack().then((r) => {
          dispatch({
            type: "SET_ITEM",
            item: r.item,
          });
          dispatch({
            type: "SET_PLAYING",
            playing: true,
          });
        }).catch((err) => {
          console.error("Error getting current playing track:", err);
        });
      })
      .catch((err) => {
        if (err.status === 403 && err.responseText.includes("PREMIUM_REQUIRED")) {
          alert("This feature requires a Spotify Premium account.");
        } else {
          console.error("Error playing song:", err);
        }
      });
  };

  // return part
  return (
    <div className="body">
      <Header spotify={spotify} />

      <div className="body__info">
        <img src={discover_weekly?.images[0]?.url} alt="" />
        <div className="body__infoText">
          <strong>PLAYLIST</strong>
          <h2>Discover Weekly</h2>
          <p>{discover_weekly?.description}</p>
        </div>
      </div>

      <div className="body__songs">
        <div className="body__icons">
          <PlayCircleFilledIcon
            className="body__shuffle"
            onClick={() => playPlaylist('37i9dQZEVXcJZyENOWUFo7')}
          />
          <FavoriteIcon fontSize="large" />
          <MoreHorizIcon />
        </div>

        {discover_weekly?.tracks.items.map((item) => (
          <SongRow key={item.track.id} playSong={playSong} track={item.track} />
        ))}
      </div>
    </div>
  );
}

export default Body;
