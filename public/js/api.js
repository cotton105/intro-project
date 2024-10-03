

const rooturl = `${window.location.protocol}//${window.location.host}/api/`

/**
 * Wrapper for all API GET requests.
 * @param { string } api 
 * @returns { Promise< object > }
 */
export async function getdata( api ) {
  return await makerequest( api, "GET" )
}

/**
 * Wrapper for all API PUT requests.
 * @param { string } api
 * @param { object } data
 * @returns { Promise }
 */
export async function putdata( api, data ) {
  return await makerequest( api, "PUT", data )
}

/**
 * Wrapper for all API DELETE requests.
 * @param { string } api
 * @param { object } data
 * @returns { Promise }
 */
export async function deletedata( api, data ) {
  return await makerequest( api, "DELETE", data )
}

/**
 * Handle API requests.
 * @param { string } api 
 * @param { string } method 
 * @param { object } data 
 * @returns { Promise }
 */
async function makerequest( api, method, data ) {
  try {
    const url = rooturl + api
    const request = { method: method }
    if( undefined !== data ) {
      request.headers = { "Content-Type": "application/json" }
      request.body = JSON.stringify( data )
    }

    const response = await fetch( url , request )

    if( !response.ok ) {
      throw new Error( `Request failed with status: ${response.status}` )
    }
    const retrieveddata = await response.json()
    if( undefined !== retrieveddata ) {
      return retrieveddata
    }
  } catch ( error ) {
    console.error( 'Error fetching data:', error.message )
  }
}

