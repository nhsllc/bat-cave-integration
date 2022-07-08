import { base64Encode } from "./depts.ts";
import { Secrets } from "./auth.entities.ts"

async function getAccessToken(): Promise {
    const headers = {
      Subscription: Secrets.Subscription,
    }

    let resp = await fetch(
      `${Secrets.baseUrl}/auth`,
      {
          method: "POST",
          headers,
          body: JSON.stringify(
            {
              authentication: base64Encode(`${Secrets.ClientId}:${Secrets.ClientSecret}`),
              requestor: Secrets.Requestor
          })
        }
    )

   return {
        status: resp.status,
        body: await resp.json()
   }
}


async function getAllContacts(token: string, testCase: string): Promise {

  const params = {

  }

  //Construct the URL with correct parameters
  const URL = `${Secrets.baseUrl}/contacts?${new URLSearchParams(params)}`
  console.log(URL)
  const headers = {
      authorization: `Bearer ${token}`,
      Subscription: Secrets.Subscription,
      requestor: Secrets.Requestor,
      "test_case": testCase,
      firstName: 'Bruce'
    }

    let resp = await fetch(
      URL,
      {
          method: "GET",
          headers,
      }
    )

   return {
        status: resp.status,
        body: await resp.json()
   }
}


const accessTokenRequestResponse = await getAccessToken().then(data => {
  return data
})

function runTests() {
  getAllContacts(accessTokenRequestResponse.body.access_token, "heist").then(data => {
    console.log(JSON.stringify(data.body))
    /** data.body holds all information that you need */
    // Test 2: Logic
    const aliveContacts = []
    const deadContacts = []
    const aliveAndGoodContacts = []
    const aliveAndBadContacts =[]
    for (const contact of data.body.contacts) {
      if (contact.status === 'Alive' && contact.team ==="Bad" ) {
          contact.location = 'Bank'
        aliveAndBadContacts.push(contact)
      }
      
    }
    console.log('Alive and Bad Contacts: ' + JSON.stringify( aliveAndBadContacts)) //post function to update location, then post results to contacts endpoint
    
  }).catch(err => {
    console.log(err)
  }).finally(() => {
    console.log("done")
  }
  )
}



runTests()
