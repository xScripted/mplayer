const BASE_URL = 'https://serpapi.com/search'

export default {
  getImageUrl: async (search: string) => {
    const fullURL = `${BASE_URL}/?q=${search}&tbm=isch&ijn=0&api_key=${process.env.VUE_APP_SERP_API_KEY}`
    const response = await fetch(fullURL, {
      credentials: 'include'
    })
    console.log(response)
  }
}