import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  Heading,
  Image,
  Input,
  InputGroup,
  Link,
  Stack,
  Text
} from '@chakra-ui/react'
import React from 'react'
import { useState, useEffect } from 'react'

const App = () => {

  const CLIENT_ID = 'ef23b8840c3e45799174830126ce191c'
  const CLIENT_SECRET = '4e46dddc06b24f64b2668a19a6d2cc86'
  const [searchInput, setSearchInput] = useState('gorillaz')
  const [accessToken, setAccessToken] = useState('')
  const [albums, setAlbums] = useState([])
  const [tracks, setTracks] = useState([])
  const [trackInfo, setTrackInfo] = useState([])

  const getParameters = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + accessToken
    }
  }

  const authParameters = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
  }

  useEffect(() => {
    fetch('https://accounts.spotify.com/api/token', authParameters)
      .then(result => result.json())
      .then(data => setAccessToken(data.access_token))
      .catch(error => alert('Ops, ocorreu um Erro inesperado'))
    handleSearch()
  }, [])

  async function handleSearch() {
    const getAlbum = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=album&include_external=audio&limit=1', getParameters)
      .then(response => response.json())
      .then(data => setAlbums(data.albums.items))
    setTracks([])
  }

  async function handleTracks(id) {
    const getTracks = await fetch('https://api.spotify.com/v1/albums/' + id + '/tracks', getParameters)
      .then(response => response.json())
      .then(data => setTracks(data.items))
  }

  const handleTrackInfo = fetch('https://api.spotify.com/v1/tracks/5VTcSZMbxCnPaVJ07bYBYo', getParameters)
    .then(response => response.json())
    .then(data => setTrackInfo(data))

  const gettingTracks = tracks.map((track) => {
    return (
      <Text
        key={track.id}
      >
        <Link
          href={track.external_urls.spotify}
          target={'_blank'}
        > {track.name}
        </Link>
      </Text>
    )
  })

  return (
    <Flex
      w={'100%'}
      minH={'100vh'}
      direction={'column'}
      bg={'black'}
      color={'white'}
      bgGradient='linear(to-b, blackAlpha.200, green.500)'
      align={'center'}
    >
      <Heading
        bgGradient='linear(to-r, #e5ede9, #54d0be)'
        textShadow='1px 1px 1px #0000005f'
        bgClip='text'
        w={{ base: '100%', md: '35%', lg: '35%' }}
        p={"5px"}
        textAlign={'center'}
        m={'25px 0'}
        fontSize={'3xl'}
      > Digite um termo que indicamos um Álbum para sua Playlist! </Heading>
      <Container
        mb={'10px'}
      >
        <InputGroup>
          <FormControl>
            <Input
              placeholder='Pesquisar álbum'
              bg={'black'}
              boxShadow={'3px 3px 3px #000000a0'}
              color={'white'}
              mb={'5px'}
              type='text'
              onKeyPress={event => {
                if (event.key == "Enter") {
                  handleSearch()
                }
              }}
              onChange={event => setSearchInput(event.target.value)}
            >
            </Input>
            <Button
              colorScheme={'teal'}
              w={'100%'}
              boxShadow={'3px 3px 3px #000000a0'}
              onClick={handleSearch}
            >
              Buscar
            </Button>
          </FormControl>
        </InputGroup>
      </Container>
      <Container>
        <Stack
          display={'flex'}
          w={'100%'}
          gap={'10px'}
        >
          {albums.map((album) => {
            return (
              <Box
                display={'flex'}
                gap={'5px'}
                flexDir={"column"}
                boxShadow={'5px 5px 5px #000000a0'}
                w={'100%'}
                bg={'#000000a0'}
                p={'10px'}
                m={'20px 0'}
                textAlign={'center'}
                key={album.id}
              >
                <Image
                  margin={'auto'}
                  w={"50%"}
                  boxShadow={'3px 3px 3px #000000a0'}
                  src={album.images[1].url}
                />
                <Heading>
                  {album.name}
                </Heading>
                <Text>
                  Artista: {album.artists[0].name}
                </Text>
                <Text>
                  Número de faixas: {album.total_tracks}
                </Text>
                <Text
                  color={'green.200'}
                >
                  <Link
                    href={album.external_urls.spotify}
                    target='_blank'
                  > Ver no Spotify
                  </Link>
                </Text>
                <Box>
                  <Button
                    w={'100%'}
                    m={'10px 0'}
                    colorScheme={'teal'}
                    boxShadow={'3px 3px 3px #000000a0'}
                    onClick={() => handleTracks(album.id)}
                  >
                    Ver faixas
                  </Button>
                  {gettingTracks}
                </Box>
              </Box>
            )
          })}
        </Stack>
      </Container>
    </Flex>
  )
}

export default App