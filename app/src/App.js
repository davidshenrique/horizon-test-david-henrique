import { Box, Button, Container, Flex, FormControl, Heading, Image, Input, InputGroup, Link, Stack, Text } from '@chakra-ui/react'
import React from 'react'
import { useState, useEffect } from 'react'


const CLIENT_ID = 'ef23b8840c3e45799174830126ce191c'
const CLIENTE_SECRET = '4e46dddc06b24f64b2668a19a6d2cc86'

const App = () => {
  const [searchInput, setSearchInput] = useState('')
  const [accessToken, setAccessToken] = useState('')
  const [albums, setAlbums] = useState([])

  const searchParameters = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + accessToken
    }
  }

  useEffect(() => {
    const authParameters = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENTE_SECRET
    }
    fetch('https://accounts.spotify.com/api/token', authParameters)
      .then(result => result.json())
      .then(data => setAccessToken(data.access_token))
      .catch(error => alert('Ops, ocorreu um Erro inesperado'))
  }, [])

  async function search() {
    const getAlbum = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=album&include_external=audio&limit=10', searchParameters)
      .then(response => response.json())
      .then(data => setAlbums(data.albums.items))
}

  return (
    <Flex
      w={'100%'}
      direction={'column'}>
      <Container>
        <InputGroup>
          <FormControl>
            <Input
              placeholder='Buscar'
              type='text'
              onKeyPress={event => {
                if (event.key == "Enter") {
                  search()
                }
              }}
              onChange={event => setSearchInput(event.target.value)}
            >
            </Input>
            <Button
              onClick={search}>
              Buscar
            </Button>
          </FormControl>
        </InputGroup>
      </Container>
      <Container>
        <Stack
          w={'100%'}
          direction={'row'}
          border={'1px solid black'}
          wrap={'wrap'}
        >
          {albums.map((album) => {
            return (
              <Box
                w={'100%'}
                key={album.id}
              >

                <Image
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
                <Text>
                  <Link href={album.external_urls.spotify} target='_blank'>Ver no Spotify</Link>
                </Text>
              </Box>
            )
          })}

        </Stack>
      </Container>
    </Flex>
  )
}

export default App