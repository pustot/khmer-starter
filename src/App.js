import "purecss/build/pure.css";
import React, { useState, useEffect } from "react";
import "./styles.scss";
import PostCard from "./components/PostCard";
import { 
  Button, Container, CssBaseline, FormControl, 
  Grid, Icon, IconButton, InputLabel, MenuItem, Select, Stack, Typography,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';

import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

import { split } from 'split-khmer'


const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

function App() {
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);

  const [lang, setLang] = React.useState('en');

  const handleLangChange = (event) => {
    setLang(event.target.value);
  };

  const getLocaleText = (i18nText, language) => {
    return language in i18nText? i18nText[language] : i18nText["en"];
  };

  const splitFixes = {"រាជបណ្ឌិត្យសភា": ["រាជ", "បណ្ឌិត្យ", "សភា"]};

  const splitKhmer = (sentence) => {
    let words = split(sentence);
    // split further some words according to customized `splitFixes`
    for (const [k, v] of Object.entries(splitFixes)) {
      while (words.indexOf(k) != -1)
        words.splice(words.indexOf(k), 1, ...v);
    }
    return words;
  }

  const splitAndDetails = (sentence) => {
    let words = splitKhmer(sentence);
    return words.map((word) => {
      let ans = {name: word, roma: "", ipa: "", meaning: ""}

      // // open the Wiktionary webpage
      // let resp = await fetch("https://en.wiktionary.org/w/api.php?action=parse&prop=text&disablepp=1&format=json&formatversion=2&page=" + word, {
      //   method: "GET"
      // })

      // if (resp.ok) {
      //   const parser = new DOMParser();
      //   let doc = parser.parseFromString(resp, 'text/html');
      //   ans.roma = doc.querySelector("#mw-content-text > div.mw-parser-output > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td:nth-child(2) > span.IPA");
      //   ans.ipa = doc.querySelector("#mw-content-text > div.mw-parser-output > table > tbody > tr > td > table > tbody > tr:nth-last-child(1) > td:nth-child(2) > span");
      // }
      
      return ans;
    });
  }

  const domain = "http://yangcx.tk/";

  return (
    <div>
      
      <Container maxWidth="sm">
      <Stack spacing={4} px={2} pb={4}>
        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{p: 3}}>
          <Button variant="outlined" 
                onClick={colorMode.toggleColorMode}
                color="inherit"
                sx={{textTransform: "none"}}
                startIcon={theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}>
            {getLocaleText(
              {"en": "Theme", "zh-tra": "主題", "zh-sim": "主题", "tto-bro": "Tvo2D8ae", "tto": "VvaH"}, 
              lang
              )}
          </Button>

          <FormControl >
            <InputLabel id="demo-simple-select-label">{getLocaleText(
              {"en": "Language", "zh-tra": "語言", "zh-sim": "语言", "tto-bro": "Zei2ZeiH", "tto": "SRHM"}, 
              lang
              )}</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={lang}
              label="Language"
              onChange={handleLangChange}
            >
              <MenuItem value={"en"}>English</MenuItem>
              <MenuItem value={"zh-tra"}>繁體中文</MenuItem>
              <MenuItem value={"zh-sim"}>简体中文</MenuItem>
              <MenuItem value={"tto-bro"}>b8Q7Z2D.</MenuItem>
              <MenuItem value={"tto"}>mim</MenuItem>
            </Select>
          </FormControl>

        </Stack>
      
        <Typography  variant="h5">
          {splitKhmer('វិទ្យាស្ថានខុងជឺនៃរាជបណ្ឌិត្យសភាកម្ពុជា').join(' ')}
        </Typography>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 450 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Word</TableCell>
                <TableCell align="right">Ortho Romaji</TableCell>
                <TableCell align="right">IPA</TableCell>
                <TableCell align="right">Meaning (first)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {splitAndDetails('វិទ្យាស្ថានខុងជឺនៃរាជបណ្ឌិត្យសភាកម្ពុជា').map((word, i) => (
                <TableRow
                  key={i}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {word.name}
                  </TableCell>
                  <TableCell align="right">{word.roma}</TableCell>
                  <TableCell align="right">{word.ipa}</TableCell>
                  <TableCell align="right">{word.meaning}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

      </Stack>
      </Container>
    </div>
  );
}

export default function AppWithColorToggler() {
  const [mode, setMode] = React.useState('light');
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
      <CssBaseline />
        <App />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}