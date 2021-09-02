import React, { useEffect, useState } from "react";
import axios from "axios";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

const App = () => {
  const [data, setData] = useState(null);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [headerInfo, setHeaderInfo] = useState("");

  const handleSearch = async (event) => {
    const token = await executeRecaptcha("submit");
    axios
      .get(
        `https://chova32n.korconnect.io/GIPHY/v1/channels/search?q=${event.target.value}`,
        {
          headers: {
            token,
            "api_key": "",
          },
        }
      )
      .then((response) => {
        setData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // Create an event handler so you can call the verification on button click event or form submit
  const handleGet = async () => {
    if (!executeRecaptcha) {
      console.log("Execute recaptcha not yet available");
    }
    const token = await executeRecaptcha("submit");
    
    // Do whatever you want with the token
    axios
      .get("https://chova32n.korconnect.io/GIPHY/v1/gifs/random", {
        headers: {
          token,
          "api_key": "",
        },
      })
      .then((response) => {
        setHeaderInfo(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // You can use useEffect to trigger the verification as soon as the component being loaded
    useEffect(() => {
      if (executeRecaptcha) {
        handleGet();
      }
       // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [executeRecaptcha]);

  return (
    <>
      <Grid xs={12} item={true}>
        <h1 className="center-align">Gif Explorer</h1>
      </Grid>
      <Grid
        xs={12}
        item={true}
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <img src={headerInfo.image_url} alt="logo" />
      </Grid>
      <Grid xs={12} item={true}>
        <TextField
          id="standard-basic"
          label="Search"
          fullWidth
          onChange={(e) => handleSearch(e)}
        />
      </Grid>
      {data && data.map(
        (gif) =>
          gif.banner_image && (
            <Grid
              xs={12}
              item={true}
              md={3}
              key={data.id}
              container="row"
              justifyContent="center"
              alignItems="center"
            >
              <img src={gif.banner_image} alt="banner" />
            </Grid>
          )
      )}
    </>
  );
};
export default App;