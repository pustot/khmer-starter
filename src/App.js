import "purecss/build/pure.css";
import React, { useState, useEffect } from "react";
import "./styles.scss";
import PostCard from "./components/PostCard";
import { 
  Button, Container, CssBaseline, FormControl, 
  Grid, Icon, IconButton, Input, InputLabel, MenuItem, Select, Stack, Typography,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Paper
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
  const [sentence, setSentence] = React.useState("វិទ្យាស្ថានខុងជឺនៃរាជបណ្ឌិត្យសភាកម្ពុជា");
  const [details, setDetails] = React.useState([{name:"",roma:"",ipa:"",meaning:""}, {name:"",roma:"",ipa:"",meaning:""}]);

  const handleLangChange = (event) => {
    setLang(event.target.value);
  };

  const getLocaleText = (i18nText, language) => {
    return language in i18nText? i18nText[language] : i18nText["en"];
  };

  const splitFixes = {"រាជបណ្ឌិត្យសភា": ["រាជ", "បណ្ឌិត្យ", "សភា"]};

  const splitKhmer = () => {
    let words = [];
    try {
      words = split(sentence);
    } catch (TypeError) {
      words = [];
    }
    console.log(sentence)
    // split further some words according to customized `splitFixes`
    for (const [k, v] of Object.entries(splitFixes)) {
      while (words.indexOf(k) != -1)
        words.splice(words.indexOf(k), 1, ...v);
    }
    
    return words;
  }

  const splitAndDetails = async () => {
    let words = splitKhmer();
    let dtls = [];
    for (let word of words) {
      let ans = {name: word, roma: "", ipa: "", meaning: ""}

      // open the Wiktionary webpage
      let resp = await fetch("https://en.wiktionary.org/w/api.php?origin=*&action=parse&prop=text&formatversion=2&page=" + word, {
        method: "GET"
      });

      if (resp.ok) {
        const parser = new DOMParser();
        let text = await resp.text();
        if (text != undefined) {
          // console.log(text)
          try {
            text = text.replace(/\\&quot;/g, '"').replace(/&gt;/g, '>').replace(/&lt;/g, '<');
            text = text.replaceAll(/\&\#(\d+)\;/g, (match, code) => String.fromCharCode(code));
            // 不知道为何总是没办法处理 &#160;
            //text = text.replaceAll("&#160;", ' ');
            text = text.replace(/\\n/g, '\n');
          } catch (TypeError) {
            text = '';
          }
          let doc = parser.parseFromString(text, 'text/html');

          // 开始去除包含Khmer的h2之前的内容：
          // Step 1 获取文档中所有的 h2 标签
          const h2Elements = doc.querySelectorAll('h2');

          // Step 2 遍历每个 h2 标签
          h2Elements.forEach(h2 => {
              // 检查 h2 标签的文本内容是否包含 "Khmer"
              if (h2.textContent.includes('Khmer')) {
                  // 如果包含，则将该 h2 标签之前的内容移除
                  let currentNode = h2.previousSibling;
                  while (currentNode && currentNode.nodeType !== Node.ELEMENT_NODE) {
                      const previousNode = currentNode.previousSibling;
                      currentNode.parentNode.removeChild(currentNode);
                      currentNode = previousNode;
                  }
              }
          });

          // 现在，doc 变量中存储的是已经去除了 "Khmer" 标题之前内容的 DOM 文档

          // 暂时取巧通过设置的不同fontsize来设置selector，以后找找更好的方式。
          // 示例放在了Untitled-1.html，网页的结构也在变，以前直接通过层级可以方便地设置selector
          let selected = doc.querySelector("span.IPA[lang='km'][style='font-size:95%']");
          if (selected != null)
            ans.roma = selected.textContent;

          selected = doc.querySelector("span.IPA[lang='km'][style='font-size:110%']");
          if (selected != null)
            ans.ipa = selected.textContent;

          selected = doc.querySelector("ol");
          if (selected != null) {
            let tempDiv = document.createElement('div');
            tempDiv.innerHTML = selected.textContent;
            ans.meaning = tempDiv.innerHTML;
            ans.meaning = ans.meaning.replaceAll("&nbsp;", ' ');
          }
            
        }
      }
      dtls.push(ans);
    }
    return dtls;
  }

  const handleClick = async () => {
    splitKhmer();
    let dtls = await splitAndDetails(); // caution await
    setDetails(dtls);
  }

  const domain = "https://twaqngu.com/";

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

        <Typography>
            Split Khmer sentences into words and then look up its romanization, pronunciation and meaning in Wiktionary.
        </Typography>


            <TextField defaultValue="វិទ្យាស្ថានខុងជឺនៃរាជបណ្ឌិត្យសភាកម្ពុជា" id="input" onChange={(v) => setSentence(v.target.value)}
              multiline
              minRows={2} 
              maxRows={Infinity} />
            <Stack direction="row" justifyContent="flex-end">
              <Button variant="outlined" onClick={() => handleClick()} sx={{width: "auto"}}>Lookup</Button>
            </Stack>


      
        <Typography  variant="h5">
          {splitKhmer().join(' ')}
        </Typography>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 450 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Word</TableCell>
                <TableCell align="right">Ortho Romaji</TableCell>
                <TableCell align="right">IPA</TableCell>
                <TableCell align="right">Meaning</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {details.map((word, i) => (
                <TableRow
                  key={i}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {word.name}
                  </TableCell>
                  <TableCell align="right">{word.roma}</TableCell>
                  <TableCell align="right">{word.ipa}</TableCell>
                  <TableCell align="left" sx={{ whiteSpace: 'pre-wrap' }}>{word.meaning}</TableCell>
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