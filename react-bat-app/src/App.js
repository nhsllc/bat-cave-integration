import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { api } from './auth/api';

const fetchAccessToken = async (testCase) => {
  const bufferString = `${process.env.REACT_APP_BAT_APP_CLIENT_ID}:${process.env.REACT_APP_BAT_APP_CLIENT_SECRET}`;
  const encodedString = (typeof Buffer !== 'undefined')
    ? Buffer.from(bufferString).toString('base64')
    : btoa(bufferString);

  const tokenConfig = {
    headers: {
      Subscription: process.env.REACT_APP_BAT_APP_SUBSCRIPTION,
    },
  };

  try {
    const response = await api.post('auth', {
      authentication: encodedString,
      requestor: process.env.REACT_APP_BAT_APP_REQUESTOR,
    }, tokenConfig);

    const { access_token: accessToken, expires_in } = response.data || {};

    if (accessToken && expires_in > 0) {
      return {
        headers: {
          ...tokenConfig.headers,
          Authorization: `Bearer ${accessToken}`,
          requestor: process.env.REACT_APP_BAT_APP_REQUESTOR,
          test_case: testCase,
        },
      };
    }
  } catch (error) {
    console.error('Error fetching token:', error);
  }

  return null;
};

function useAuthApiConfig(testCase) {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    const initializeConfig = async () => {
      const tokenConfig = await fetchAccessToken(testCase);
      if (tokenConfig) {
        setConfig(tokenConfig);
      }
    };

    // Ensure that the API call for token is made only when necessary
    if (testCase && !config) {
      initializeConfig().catch(console.error);
    }
  }, [testCase, config]);

  return config;
}

function Home() {
  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to the Contact App</p>
    </div>
  );
}

// Get all contacts and post them back to the contacts endpoint.
function ContactList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const config = useAuthApiConfig('connect');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (config && config.headers?.Authorization) {
          console.log('Getting contacts');
          const response = await api.get('contacts', config);
          const { data: responseData } = response;
          const { contacts } = responseData;

          setData(contacts);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [config]); // Only depend on 'config' here

  return (
    <div>
      <h1>Contact List</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {data.map((contact, index) => (
            <li key={index}>{contact.firstName} {contact.lastName}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Get all alive villains, update their location to the bank, and post the results to the contacts endpoint.
function Heist() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const config = useAuthApiConfig('heist');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (config && config.headers?.Authorization) {
          console.log('Getting contacts');
          const response = await api.get('contacts?status=Alive', config);
          const { data: responseData } = response;
          const { contacts } = responseData;

          setData(contacts);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [config]); // Only depend on 'config' here

  const handleApiCall = async () => {
    try {
      setLoading(true);

      const updatedConfig = await fetchAccessToken('heist');

      const updatedData = data.map(o => ({ ...o, location: "Bank" }));
      const response = await api.post('contacts', {
        contacts: updatedData
      }, updatedConfig);

      setData(updatedData);
    } catch (error) {
      console.error('Error making API call:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Heist Page</h1>
      <button onClick={handleApiCall}>Update to "bank"</button>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {data.map((contact, index) => (
            <li key={index}>{contact.firstName} {contact.lastName} - {contact.status} - {contact.location}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

/*
For Superman, add a property called powers as a string array, and add Laser Eyes 
and X-Ray Vision to it. For Scarecrow, add a property called powers 
as a string array, add Toxic Immunity to it, add another property called abilities, 
add Pedagogy to it, and post the results to the contacts endpoint.
*/
function Powers() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const config = useAuthApiConfig('powers');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (config && config.headers?.Authorization) {
          console.log('Getting contacts');
          const response = await api.get('contacts', config);
          const { data: responseData } = response;
          const { contacts } = responseData;

          setData(contacts.filter(character => {
            const allowedTitles = ['Superman', 'Scarecrow'];
            return allowedTitles.includes(character.title);
          }));
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [config]); // Only depend on 'config' here

  const handleApiCall = async () => {
    try {
      setLoading(true);

      const updatedConfig = await fetchAccessToken('powers');

      const updatedData = data
        .filter(character => {
          const allowedTitles = ['Superman', 'Scarecrow'];
          return allowedTitles.includes(character.title);
        })
        .map(character => {
          if (character.title === "Superman") {
            return { ...character, powers: ['Laser Eyes', 'X-Ray Vision'] };
          } else if (character.title === "Scarecrow") {
            return { ...character, powers: ['Toxic Immunity'], abilities: ['Pedagogy '] }
          } else {
            return character;
          }
        });

      const response = await api.post('contacts', {
        contacts: updatedData
      }, updatedConfig);

      setData(updatedData);
    } catch (error) {
      console.error('Error making API call:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Powers Page</h1>
      <button onClick={handleApiCall}>Update Powers</button>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {data.map((contact, index) => (
            <li key={index}>{contact.firstName} {contact.lastName} - powers: {contact.powers} - abilities: {contact.abilities}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

/*
For all contacts that have an age not Unknown, calculate 
their birth year into a new property called birthYear 
as a date string in the format MM-dd-yyyy, and 
post the oldest result to the contacts endpoint.
*/
function Birthdays() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const config = useAuthApiConfig('birthdays');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (config && config.headers?.Authorization) {
          console.log('Getting contacts');
          const response = await api.get('contacts', config);
          const { data: responseData } = response;
          const { contacts } = responseData;

          setData(contacts.filter(character => {
            const disallowedAges = ['Unknown'];
            return !disallowedAges.includes(character.age);
          }));
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [config]); // Only depend on 'config' here

  const calculateBirthYear = (age) => {
    const currentYear = new Date().getFullYear();
    const birthYear = currentYear - age;
    return `${birthYear}`;
  };

  const handleApiCall = async () => {
    try {
      setLoading(true);

      const updatedConfig = await fetchAccessToken('birthdays');

      const updatedData = data
        .filter(character => {
          const disallowedAges = ['Unknown'];
          return !disallowedAges.includes(character.age);
        })
        .map(character => {
          return { ...character, birthYear: calculateBirthYear(character.age) };
        });

      const oldestCharacter = updatedData.reduce((oldest, current) => {
        const birthYearOldest = oldest.birthYear;
        const birthYearCurrent = current.birthYear;

        // Compare birth years and update oldest if needed
        if (birthYearCurrent < birthYearOldest) {
          return current;
        }

        return oldest;
      }, updatedData[0]); // Start with the first character as the initial oldest


      const response = await api.post('contacts', {
        contacts: [oldestCharacter]
      }, updatedConfig);

      setData(updatedData);
    } catch (error) {
      console.error('Error making API call:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Birthdays Page</h1>
      <button onClick={handleApiCall}>Calc Birth Years</button>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {data.map((contact, index) => (
            <li key={index}>{contact.firstName} {contact.lastName} - birthYear : {contact.birthYear}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

/*
For all contacts, sort them by title, then by age, and finally post the results back to the contacts endpoint.
*/
function Sorting() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const config = useAuthApiConfig('heist');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (config && config.headers?.Authorization) {
          console.log('Getting contacts');
          const response = await api.get('contacts', config);
          const { data: responseData } = response;
          const { contacts } = responseData;

          setData(contacts);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [config]); // Only depend on 'config' here

  const handleApiCall = async () => {
    try {
      setLoading(true);

      const updatedConfig = await fetchAccessToken('heist');

      const updatedData = data.sort((a, b) => {
        // first by title
        const comparison = a.title.localeCompare(b.title);
        
        // If titles are equal, then by age
        if (comparison === 0) {
          return a.age - b.age;
        }
      
        return comparison;
      });

      const response = await api.post('contacts', {
        contacts: updatedData
      }, updatedConfig);

      setData(updatedData);
    } catch (error) {
      console.error('Error making API call:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Sorting Page</h1>
      <button onClick={handleApiCall}>Sort</button>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {data.map((contact, index) => (
            <li key={index}>{contact.title} {contact.age} {contact.firstName} {contact.lastName}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function App() {
  const [testCase, setTestCase] = useState('connect');
  const config = useAuthApiConfig(testCase);

  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/contacts">Contact List</Link>
            </li>
            <li>
              <Link to="/heist">Heist</Link>
            </li>
            <li>
              <Link to="/powers">Powers</Link>
            </li>
            <li>
              <Link to="/birthdays">Birthdays</Link>
            </li>
            <li>
              <Link to="/sorting">Sorting</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/contacts" element={<ContactList config={config} />} />
          <Route path="/heist" element={<Heist />} />
          <Route path="/powers" element={<Powers />} />
          <Route path="/birthdays" element={<Birthdays />} />
          <Route path="/sorting" element={<Sorting />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;