export const url = 'https://felipez.emsofe.com'
// export const url = 'http://localhost:7000'


export const getHeader = () => {
  try {
    const auth = JSON.parse(localStorage.getItem('token'))
    const headers = {
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + auth
    }
    return headers
  } catch (error) {
    localStorage.clear()
  }
}
