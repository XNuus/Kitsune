import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  ImageList,
  ImageListItem,
  ImageListItemBar,
  IconButton,
} from "@material-ui/core";
import { PlayArrowOutlined } from "@material-ui/icons";
import ModalAnime from "./ModalAnime";
import axios from "axios";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
  },
  imageList: {
    flexWrap: "nowrap",
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: "translateZ(0)",
  },
  title: {
    color: theme.palette.default,
  },
  titleBar: {
    background:
      "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
  },
  img: {
    "&:hover": {
      opacity: 0.8,
      transform: "scale(1.1)",
      cursor: "pointer",
    },
  },
}));

function PopularCards({ Anime }) {
  const classes = useStyles();
  const history = useHistory();

  const [selectedAnime, setSelectedAnime] = React.useState(null);
  const [openDialog, setOpenDialog] = React.useState(false);

  const handleOpen = (item) => {
    getAnime(item.link);
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setSelectedAnime(null);
  };

  const handleWatchClick = (slug) => {
    setOpenDialog(false);
    history.push({
      pathname: `/anime/${slug}`,
    });
  };

  const getAnime = (link) => {
    axios
      .post("/api/v1/anime", { uri: link })
      .then((res) => {
        setSelectedAnime(res.data);
      })
      .catch((err) => console.log(err));
  };

  const handleToEpisode = (item) => {
    setOpenDialog(false);
    history.push({
      pathname: `/anime/${item.link.replace(/\/category\//g, "")}`,
    });
  };

  return (
    <div className={classes.root} style={{ height: 330 }}>
      {Anime.length !== 0 ? (
        <ImageList className={classes.imageList} cols={6}>
          {Anime.map((item) => (
            <ImageListItem
              key={item.img}
              className={classes.img}
              style={{ height: "300px", padding: "12px" }}
            >
              <img
                src={item.img}
                alt={item.name}
                onClick={() => handleOpen(item)}
              />
              <ImageListItemBar
                title={item.name}
                subtitle={item.release}
                classes={{
                  root: classes.titleBar,
                  title: classes.title,
                }}
                actionIcon={
                  <IconButton
                    aria-label={`star ${item.name}`}
                    onClick={() => handleToEpisode(item)}
                  >
                    <PlayArrowOutlined className={classes.title} />
                  </IconButton>
                }
              />
            </ImageListItem>
          ))}
          {selectedAnime !== null ? (
            <ModalAnime
              isOpen={openDialog}
              handleWatchClick={handleWatchClick}
              data={selectedAnime}
              handleClose={handleClose}
            />
          ) : (
            ""
          )}
        </ImageList>
      ) : (
        <div style={{ height: 400 }} />
      )}
    </div>
  );
}

export default PopularCards;